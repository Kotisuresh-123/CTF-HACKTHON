const axios = require("axios");
const Leak = require("../model/dataModel");
const { detectKeys, classifyRisk, maskKey } = require("../utils/detectors");



function extractRepoDetails(url) {
  const parts = url.split("github.com/")[1].split("/");
  return {
    owner: parts[0],
    repo: parts[1],
  };
}


let fileCount = 0;
const MAX_FILES = 25;

const ignoreExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".lock"];


async function fetchAllFiles(owner, repo, path = "", results = []) {
  if (fileCount > MAX_FILES) return results;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const { data } = await axios.get(apiUrl);

  for (let item of data) {
    if (fileCount > MAX_FILES) break;

    if (ignoreExtensions.some(ext => item.name.endsWith(ext))) continue;

    if (item.type === "file" && item.download_url) {
      try {
        const fileData = await axios.get(item.download_url);

        const detected = detectKeys(fileData.data);

        for (let d of detected) {
          results.push({
            key: d.key,
            type: d.type,
            method: d.method,
            entropy: d.entropy || null,
            fileName: item.path, 
          });
        }

        fileCount++;
      } catch (err) {
        continue;
      }
    }

    else if (item.type === "dir") {
      await fetchAllFiles(owner, repo, item.path, results);
    }
  }

  return results;
}

// 🚀 MAIN CONTROLLER
exports.scanForLeaks = async (req, res) => {
  try {
    const { url, demo } = req.body;

    fileCount = 0;
    let detectedResults = [];

    // 🟢 GitHub scanning
    if (url && url.includes("github.com")) {
      const { owner, repo } = extractRepoDetails(url);

      try {
        detectedResults = await fetchAllFiles(owner, repo);
      } catch (err) {
        console.log("GitHub error:", err.message);
      }
    }

    // 🟡 Demo mode
    if (demo) {
      const demoText = `
      sk-1234567890abcdefghijklmnopqrstuvwxyz123456
      AKIA1234567890ABCDE
      ghp_abcdefghijklmnopqrstuvwxyz123456
      randomstringasdkjashdkjashdkjashdkjashdkjashd
      `;

      const demoDetected = detectKeys(demoText);

      demoDetected.forEach(d => {
        detectedResults.push({
          key: d.key,
          type: d.type,
          method: d.method,
          entropy: d.entropy || null,
          fileName: "demo-file.txt",
        });
      });
    }

    if (detectedResults.length === 0) {
      return res.json({
        message: "No API keys found (safe repository)",
        total: 0,
        data: [],
      });
    }

    let savedResults = [];

    for (let item of detectedResults) {
      try {
        const riskData = classifyRisk(item.type, item.entropy);

        const newLeak = new Leak({
          key: item.key,
          maskedKey: maskKey(item.key),
          type: item.type,
          source: item.fileName, // 🔥 REAL SOURCE (file)
          risk: riskData.level,
          riskScore: riskData.score,
          method: item.method,
          entropy: item.entropy,
        });

        const saved = await newLeak.save();
        savedResults.push(saved);

      } catch (err) {
        if (err.code === 11000) continue; // ignore duplicates
      }
    }

    res.json({
      message: "Scan completed successfully",
      scannedFiles: fileCount,
      total: savedResults.length,
      data: savedResults,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const total = await Leak.countDocuments();

    const low = await Leak.countDocuments({ risk: "LOW" });
    const medium = await Leak.countDocuments({ risk: "MEDIUM" });
    const high = await Leak.countDocuments({ risk: "HIGH" });

    res.json({
      total,
      low,
      medium,
      high,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeaksTable = async (req, res) => {
  try {
    const data = await Leak.find().sort({ detectedAt: -1 });

    const formatted = data.map(item => ({
      type: item.type,
      source: item.source,
      key: item.maskedKey,
      risk: item.risk,
      riskScore: item.riskScore,
      detectedAt: item.detectedAt
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};