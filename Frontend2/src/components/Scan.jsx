import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Scan.css";

export default function Scan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleScan = async () => {
  if (!url.trim()) {
    alert("Please enter API URL");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post("http://localhost:3000/api/v1/scan", {
      url: url
    });

    const result = response.data;

    setLoading(false);

    // ✅ Show meaningful alert
    if (result.total === 0) {
      alert("✅ No API keys found. Repository is SAFE.");
    } else {
      alert(
        `⚠️ Scan Completed!\n\n` +
        `Files Scanned: ${result.scannedFiles}\n` +
        `Leaks Found: ${result.total}\n\n` +
        `Check dashboard for risk analysis.`
      );
      navigate("/home");
    }

  } catch (error) {
    console.error("Scan Error:", error);
    setLoading(false);
    alert("❌ Scan failed! Please try again.");
  }
};

  return (
    <div className="s-app">
      <div className="s-card">
        
        <h1 className="s-title">LEAKED KEYS DETECTOR</h1>

        {/* Input */}
        <input
          type="text"
          placeholder="https://api.example.com/v1/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="s-input"
        />

        {/* Button */}
        <button
          className="s-btn"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "SCANNING..." : "INITIALIZE SCAN"}
        </button>

      </div>
    </div>
  );
}