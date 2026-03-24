import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Scan.css";

export default function Scan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = () => {
    if (!url.trim()) {
      alert("Please enter API URL");
      return;
    }

    setLoading(true);

    // Simulate scanning process
    setTimeout(() => {
      setLoading(false);

      // Redirect to Home page
      navigate("/home");
    }, 1500);
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