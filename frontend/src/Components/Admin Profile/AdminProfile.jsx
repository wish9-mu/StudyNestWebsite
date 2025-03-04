import React from "react";
import "./AdminProfile.css";
import NavAdmin from "../Nav/AdminNav";
import AvailableCourses from "./AvailableCourses"

const AdminProfile = () => {
  return (
    <>
      <NavAdmin />
      <section>
        <div className="admin-profile">
          <div className="admin-profile-header">
            <div className="admin-profile-image"></div>
            <div className="admin-profile-info">
              <h1>StudyNest Admin</h1>
              <div className="tag">Admin View</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <AvailableCourses />
      </section>
    </>
  );
};

export default AdminProfile;
