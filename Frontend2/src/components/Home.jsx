import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToScan = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="h-container">

      <h1 className="h-header">
        Developer Secret Detection Framework
      </h1>

      {/* Navigate Button */}
      <div className="h-top-btn">
        <button className="h-scan-btn" onClick={goToScan}>
          {loading ? "LOADING..." : "Go to Scan"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="h-loader-overlay">
          <div className="h-spinner"></div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="h-grid-4">
        <div className="h-card">
          <p>Total Scanned</p>
          <h2>2134</h2>
        </div>

        <div className="h-card">
          <p>High Risk</p>
          <h2 className="h-high">12</h2>
        </div>

        <div className="h-card">
          <p>Medium Risk</p>
          <h2 className="h-medium">28</h2>
        </div>

        <div className="h-card">
          <p>Low Risk</p>
          <h2 className="h-low">64</h2>
        </div>
      </div>

      {/* Middle Section */}
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
          <p className="h-alert">⚠ High-risk AWS key found</p>
          <p className="h-alert">⚠ GitHub token exposed</p>
        </div>
      </div>

      {/* Table */}
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
            <tr>
              <td>GitHub</td>
              <td>AWS</td>
              <td>AKIA****</td>
              <td className="h-high">High</td>
              <td>33%</td>
              <td>3:00</td>
            </tr>

            <tr>
              <td>Pastebin</td>
              <td>OpenAI</td>
              <td>sk-****</td>
              <td className="h-medium">Medium</td>
              <td>44%</td>
              <td>4:00</td>
            </tr>

            <tr>
              <td>Logs</td>
              <td>Stripe</td>
              <td>pk_****</td>
              <td className="h-low">Low</td>
              <td>55%</td>
              <td>5:00</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Home;