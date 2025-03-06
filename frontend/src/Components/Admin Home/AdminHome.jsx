import React from "react";
import "./AdminHome.css";
import AdminNav from "../Nav/AdminNav";
import AdminCard from "./AdminCard.jsx";

const AdminHome = () => {
  console.log("Admin Home Page");

  return (
    <div className="page-wrapper">
      <AdminNav />
      <div className="admin-home">
        <div className="admin-home-container">
          <h1 className="admin-title">Hello Admin.</h1>
          <p className="admin-home-description">
            StudyNest is a student-led tutoring platform exclusively for
            Mapúans, connecting knowledgeable upper-year students with those
            seeking academic support. Whether you're struggling with Calculus,
            Physics, or Engineering subjects, find a qualified peer tutor who's
            been in your shoes.
          </p>

          <div className="admin-home-boxes">
            <AdminCard className="box-1" />
            <AdminCard className="box-2" />
            <AdminCard className="box-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
