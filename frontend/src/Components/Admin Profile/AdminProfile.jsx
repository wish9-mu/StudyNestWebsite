import React from "react";
import "./AdminProfile.css";
import NavAdmin from "../Nav/AdminNav";
import AvailableCourses from "./AvailableCourses";
import { useAuth } from "../Login/AuthContext";
import { supabase } from "../../supabaseClient";
import "../ProfileContent/AccountInformation.css";

const AdminProfile = () => {
  return (
    <>
      <NavAdmin />
      <div className="admin-profile-container">
        <div className="profile-card">
          <div className="profile-image"></div>
          <div className="profile-info">
            <h1>StudyNest Admin</h1>
            <p>This is an admin view exclusive for Admins under StudyNest.</p>
          </div>
        </div>

        <h2 className="section-title">Tutoring Courses</h2>
        <div className="courses-container">
          <AvailableCourses />
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
