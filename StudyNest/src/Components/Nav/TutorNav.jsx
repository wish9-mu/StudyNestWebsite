import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TutorNav.css";
import userImage from "../../assets/user.png";
import logo from "../../assets/SNHome.png";

const TutorNav = ({ setUser }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser({ role: "guest" }); // Reset user role to "guest"
    navigate("/"); // Redirect to home page
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          {/* Logo */}
          <Link to="/tutorhome">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* Navigation Links */}
          <ul className="nav-list">
            <li>
              <Link to="/tutorhome" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tutorbookings" className="nav-link">
                Bookings
              </Link>
            </li>
          </ul>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button onClick={toggleDropdown} className="btnlog">
              <img src={userImage} alt="User" className="user-image" />{" "}
              {/* Add the user image */}
              Tutor Dela Cruz
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/TutorProfile" className="dropdown-item">
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

export default TutorNav;
