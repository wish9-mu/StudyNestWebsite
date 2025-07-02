// Sidebar.jsx

import "../Admin Statistics/AdminSidebar.css";
import logo from "../../assets/StudyNest_Colored.png";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-profile">
        <div className="profile-avatar">
          <img src={logo} alt="Logo" />
        </div>
        <h3 className="profile-name">Admin View</h3>
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-menu-item ${
            activeTab === "studynest" ? "active" : ""
          }`}
          onClick={() => setActiveTab("studynest")}
        >
          <p className="menu-icon">📈</p>
          <span>StudyNest Metrics</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "people" ? "active" : ""
          }`}
          onClick={() => setActiveTab("people")}
        >
          <p className="menu-icon">👥</p>
          <span>User Metrics</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "reports" ? "active" : ""
          }`}
          onClick={() => setActiveTab("reports")}
        >
          <p className="menu-icon">🛠️</p>
          <span>Issue Reports</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
