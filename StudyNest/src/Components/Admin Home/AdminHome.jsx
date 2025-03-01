import React from "react";
import "./AdminHome.css";
import AdminNav from "../Nav/AdminNav";
import AdminCard from "./AdminCard.jsx";

const AdminHome = () => {
  return (
    <>
      <AdminNav />
      <div className="admin-home">
        <div className="header">
          <div className="header-text">
            <h1>Hello Admin.</h1>
          </div>
          <div className="header-info">
            <p>
              StudyNest is a student-led tutoring platform exclusively for
              Mapúans, connecting knowledgeable upper-year students with those
              seeking academic support. Whether you're struggling with Calculus,
              Physics, or Engineering subjects, find a qualified peer tutor
              who's been in your shoes.
            </p>
          </div>
        </div>

        <div className="box-placeholders">
          //<AdminCard></AdminCard>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
