import React from "react";
import "../Hero/Hero.css";
import Nav from "../Nav/Nav";
import { Link } from "react-router-dom";

const GuestRequest = () => {
  return (
    <>
      <Nav />
      <div className="hero">
        <div className="hero-text">
          <h1>Find your Tutor here!</h1>
          <p>
            Are you struggling on some of your courses? StudyNest is here to
            help you achieve your academic dreams. Find your tutor now and
            become a top student in your class!
          </p>
          <Link to="/login" className="nav-links">
            <button className="btn">Login Here!</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GuestRequest;
