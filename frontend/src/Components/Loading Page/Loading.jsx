import React, { useState, useEffect } from "react";
import "./Loading.css";

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState("Loading");

  // Animated loading text with dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="loading-container">
        {/* Background floating elements */}
        <div className="bg-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>

        <div className="loading-content">
          {/* Main spinner */}
          <div className="spinner-container">
            <div className="spinner"></div>
            <div className="spinner-inner"></div>
          </div>

          {/* Loading text */}
          <div className="loading-text">{loadingText}</div>
        </div>
      </div>
    </>
  );
}

