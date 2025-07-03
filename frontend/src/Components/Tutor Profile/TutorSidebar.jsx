// Sidebar.jsx

import "../Tutee Profile/TuteeSidebar.css";
import logo from "../../assets/StudyNest_Colored.png";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Log out error:", error);
  else {
    setUser(null);
    navigate("/login");
  }
};

const TutorSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src={logo} alt="Logo" />
        </div>
        <h3 className="profile-name">Tutor View</h3>
        <p className="profile-status"></p>
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-menu-item ${
            activeTab === "account" ? "active" : ""
          }`}
          onClick={() => setActiveTab("account")}
        >
          <p className="menu-icon">👤</p>
          <span>Account Information</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "booking" ? "active" : ""
          }`}
          onClick={() => setActiveTab("booking")}
        >
          <p className="menu-icon">📅</p>
          <span>Booking Preferences</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "security" ? "active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <p className="menu-icon">🔒</p>
          <span>Sign-In & Security</span>
        </button>
        
        <button
          className={`sidebar-menu-item ${
            activeTab === "report" ? "active" : ""
          }`}
          onClick={() => setActiveTab("report")}
        >
          <p className="menu-icon">📝</p>
          <span>Report Issue</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "viewreport" ? "active" : ""
          }`}
          onClick={() => setActiveTab("viewreport")}
        >
          <p className="menu-icon">📈</p>
          <span>View Reported Issues</span>
        </button>
      
      </div>

      

      {/* <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          <i className="menu-icon">🚪</i>
          <span>Logout</span>
        </button>
      </div> */}
    </div>
  );
};

export default TutorSidebar;
