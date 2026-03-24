import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Scan from "./components/Scan.jsx";

// import "./App.css"
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ First page = Scan */}
        <Route path="/" element={<Scan />} />

        {/* ✅ Home page after scan */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}