import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    low: 0,
    medium: 0,
    high: 0,
  });

  const [leaks, setLeaks] = useState([]);

  const goToScan = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const summaryRes = await axios.get("http://localhost:3000/api/v1/summary");
      const leaksRes = await axios.get("http://localhost:3000/api/v1/leaks");

      setSummary(summaryRes.data);
      setLeaks(leaksRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="h-container">

      <h1 className="h-header">
        Developer Secret Detection Framework
      </h1>

      <div className="h-top-btn">
        <button className="h-scan-btn" onClick={goToScan}>
          {loading ? "LOADING..." : "Go to Scan"}
        </button>
      </div>


      {loading && (
        <div className="h-loader-overlay">
          <div className="h-spinner"></div>
        </div>
      )}


      <div className="h-grid-4">
        <div className="h-card">
          <p>Total Scanned</p>
          <h2>{summary.total}</h2>
        </div>

        <div className="h-card">
          <p>High Risk</p>
          <h2 className="h-high">{summary.high}</h2>
        </div>

        <div className="h-card">
          <p>Medium Risk</p>
          <h2 className="h-medium">{summary.medium}</h2>
        </div>

        <div className="h-card">
          <p>Low Risk</p>
          <h2 className="h-low">{summary.low}</h2>
        </div>
      </div>

      <div className="h-grid-2">

        <div className="h-card">
          <h2>Detection Engine</h2>
          <p>✔ Regex Detection</p>
          <p>✔ Entropy Analysis</p>

          <div className="h-progress">
            <div className="h-progress-bar"></div>
          </div>
        </div>

       <div className="h-card">
        <h2>Alerts</h2>

        {leaks.length === 0 ? (
          <p className="h-alert">✅ No threats detected</p>
        ) : (
          leaks
            .filter(item => item.risk === "HIGH")
            .slice(0, 3) // show top 3 alerts
            .map((item, index) => (
              <p key={index} className="h-alert">
                ⚠ {item.type} key detected in {item.source}
              </p>
            ))
        )}
      </div>
      </div>

      <div className="h-card h-table-container">
        <h2>Detected Secrets</h2>

        <table className="h-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Type</th>
              <th>Key</th>
              <th>Risk</th>
              <th>Score</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {leaks.map((item, index) => (
              <tr key={index}>
                <td>{item.source}</td>
                <td>{item.type}</td>
                <td className="h-key-cell">
                  <span className="h-key-mask">{item.key}</span>
                  <span className="h-key-full">{item.originalKey || item.key}</span>
                </td>
                <td
                  className={
                    item.risk === "HIGH"
                      ? "h-high"
                      : item.risk === "MEDIUM"
                      ? "h-medium"
                      : "h-low"
                  }
                >
                  {item.risk}
                </td>
                <td>{item.riskScore}%</td>
                <td>
                  {new Date(item.detectedAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Home;