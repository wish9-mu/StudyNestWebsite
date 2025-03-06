import React from "react";
import "./AdminProfile.css";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import AvailableCourses from "./AvailableCourses";
import { useAuth } from "../Login/AuthContext";
import { supabase } from "../../supabaseClient";
import AdminNav from "../Nav/AdminNav";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="admin-profile-page">
      <AdminNav />
      {/* Main Content */}
      <main className="main-content">
        <div className="admin-header">
          <h1 className="admin-title">StudyNest Admin</h1>
          <p className="admin-subtitle">
            This is an admin view exclusive for Admins under StudyNest.
          </p>
        </div>

        <section className="courses-section">
          <h2 className="section-title">Tutoring Courses</h2>
          <div className="courses-container">
            <AvailableCourses />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminProfile;
