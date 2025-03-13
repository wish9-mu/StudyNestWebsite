import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TutorNav.css";
import userImage from "../../assets/user.png";
import logo from "../../assets/SNHome.png";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../Login/AuthContext";
import Notifications from "../Notifications/Notifications";

const TutorNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Log out error:", error);
    else {
      setUser(null);
      navigate("/login");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Get the user ID
  useEffect(() => {
    if (!user?.email) return; // Ensure `user.email` exists before fetching

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserID(data.id);
        setUserName(data.first_name + " " + data.last_name);
      }
    };

    fetchUser();
  }, [user]); // Depend on `user`

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
            <li>
              <Link to="/tutoractivity" className="nav-link">
                Activity
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            {/* Notifications */}
            {userId && <Notifications userId={userId} />}

            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <button onClick={toggleDropdown} className="btnlog">
                <img src={userImage} alt="User" className="user-image" />{" "}
                {/* Add the user image */}
                My Account
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    onClick={() => navigate("/TutorProfile")}
                    className="dropdown-item"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TutorNav;
