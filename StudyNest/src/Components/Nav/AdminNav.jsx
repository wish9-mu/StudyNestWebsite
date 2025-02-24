import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Nav.css";
import logo from "../../assets/SNHome.png";
import userImage from "../../assets/user.png";

const AdminNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          <Link to="/tutor">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <ul className="nav-list">
            <li>
              <Link to="/adminhome" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/tutor/sessions" className="nav-link">
                Statistics
              </Link>
            </li>
          </ul>
          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button onClick={toggleDropdown} className="btnlog">
              <img src={userImage} alt="User" className="user-image" />
              Admin Dela Cruz
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/adminprofile" className="dropdown-item">
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

export default AdminNav;
