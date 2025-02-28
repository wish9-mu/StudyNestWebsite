import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TutorNav.css";
import userImage from "../../assets/user.png";
import logo from "../../assets/SNHome.png";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../Login/AuthContext";

const TutorNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Log out error:", error);
      else {
        setUser(null);
        navigate("/login");
      }
    }

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
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TutorNav;
