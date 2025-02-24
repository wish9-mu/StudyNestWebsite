import React from "react";
import "./AdminProfile.css";
import NavAdmin from "../Nav/AdminNav";

const AdminProfile = () => {
  return (
    <>
      <NavAdmin />
      <div className="admin-profile">
        <div className="profile-header">
          <div className="profile-image"></div>
          <div className="profile-info">
            <h1>StudyNest Admin</h1>
            <div className="tag">Admin View</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
