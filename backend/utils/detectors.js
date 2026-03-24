const patterns = {
  AWS: /AKIA[0-9A-Z]{16}/g,
  OPENAI: /sk-[A-Za-z0-9_\-]{20,}/g, 
  GITHUB: /ghp_[A-Za-z0-9]{36}/g,
  STRIPE: /sk_live_[A-Za-z0-9]+/g,
};


function calculateEntropy(str) {
  const map = {};
  for (let char of str) {
    map[char] = (map[char] || 0) + 1;
  }

  let entropy = 0;
  const length = str.length;

  for (let key in map) {
    const p = map[key] / length;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}


function regexDetection(text) {
  let results = [];

  for (let type in patterns) {
    const matches = text.match(patterns[type]);
    if (matches) {
      matches.forEach((key) => {
        results.push({ key, type, method: "REGEX" });
      });
    }
  }

  return results;
}


function entropyDetection(text) {
  const words = text.split(/\s+/);
  let results = [];

  words.forEach((word) => {
    if (word.length > 20) {
      const entropy = calculateEntropy(word);

      if (entropy > 4.5) {
        results.push({
          key: word,
          type: "UNKNOWN",
          method: "ENTROPY",
          entropy,
        });
      }
    }
  });

  return results;
}

function detectKeys(text) {
  const regexResults = regexDetection(text);
  const entropyResults = entropyDetection(text);

  return [...regexResults, ...entropyResults];
}


function classifyRisk(type, entropy = null) {
  if (type === "AWS" || type === "OPENAI")
    return { level: "HIGH", score: 90 };

  if (type === "STRIPE")
    return { level: "MEDIUM", score: 70 };

  if (type === "UNKNOWN" && entropy > 4.5)
    return { level: "MEDIUM", score: 60 };

  return { level: "LOW", score: 40 };
}


function maskKey(key) {
  return key.substring(0, 4) + "****" + key.slice(-4);
}

module.exports = {
  detectKeys,
  classifyRisk,
  maskKey,
};