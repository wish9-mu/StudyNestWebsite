import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/SNHome.png";
import userImage from "../../assets/user.png";

const TuteeNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          <Link to="/tutee">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <ul className="nav-list">
            <li>
              <Link to="/request" className="nav-link">
                Request
              </Link>
            </li>
            <li>
              <Link to="/tuteeactivity" className="nav-link">
                Activity
              </Link>
            </li>
            <li>
              <Link to="/tuteewaitlist" className="nav-link">
                Waitlist
              </Link>
            </li>
          </ul>
          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button onClick={toggleDropdown} className="btnlog">
              <img src={userImage} alt="User" className="user-image" />
              Tutee Dela Cruz
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/tuteeprofile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/" className="dropdown-item">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TuteeNav;
