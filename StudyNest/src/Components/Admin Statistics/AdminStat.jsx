import React from "react";
import "./AdminStat.css";

const AdminStat = () => {
  return (
    <div className="admin-stat">
      <div className="header">
        <div className="header-text">
            <h1>Welcome to Statistics</h1>
        </div>
        <div className="header-info">
          <p>In statistics, you can monitor activities, track performance metrics, and generate reports.</p>
        </div>
      </div>

      <div className="stat-content">
        <div className="box-placeholder">
            <div>
                <h2>Instructors</h2>
                <small>Click a tutor to access their Performance Metrics</small>
            </div>
            <div>
                <button className="generate-report-button">Generate Report</button>
                <small>Click to generate performance rating report.</small>
            </div>
        </div>
        <div className="tutor-display">
            <div className="card-1">
                <h3>Lastname, Firstname</h3>
                <p>Student Number</p>
            </div>
            <div className="card-2">
                <h3>Lastname, Firstname</h3>
                <p>Student Number</p>
            </div>
            <div className="card-3">
                <h3>Lastname, Firstname</h3>
                <p>Student Number</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStat;
