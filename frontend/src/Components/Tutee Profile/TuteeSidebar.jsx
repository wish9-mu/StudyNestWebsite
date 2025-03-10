// Sidebar.jsx
import React from "react";
import "./TuteeSidebar.css";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Log out error:", error);
  else {
    setUser(null);
    navigate("/login");
  }
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      {/* <div className="sidebar-profile">
        <div className="profile-avatar">
          <img
            src={userData.profile_picture || "/default-avatar.png"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <h3 className="profile-name">Paano ba to</h3>
        <p className="profile-status">hihi</p>
      </div> */}

      <div className="sidebar-menu">
        <button
          className={`sidebar-menu-item ${
            activeTab === "account" ? "active" : ""
          }`}
          onClick={() => setActiveTab("account")}
        >
          <i className="menu-icon">👤</i>
          <span>Account Information</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "booking" ? "active" : ""
          }`}
          onClick={() => setActiveTab("booking")}
        >
          <i className="menu-icon">📅</i>
          <span>Booking Preferences</span>
        </button>

        <button
          className={`sidebar-menu-item ${
            activeTab === "security" ? "active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <i className="menu-icon">🔒</i>
          <span>Sign-In & Security</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          <i className="menu-icon">🚪</i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
