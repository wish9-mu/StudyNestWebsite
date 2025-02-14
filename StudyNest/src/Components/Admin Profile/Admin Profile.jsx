import React from "react";
import "./Admin Profile.css";

const AdminProfile = () => {
  return (
    <div className="admin-profile">
      <div className="profile-header">
        <div className="profile-image"></div>
        <div className="profile-info">
          <h1>StudyNest Admin</h1>
          <div className="tag">
            Admin View
          </div>
        </div>
      </div>

      <button className="logout-button">
        <span className="logout-icon">↩</span>
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
