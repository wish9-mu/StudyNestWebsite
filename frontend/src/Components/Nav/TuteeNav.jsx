import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/SNHome.png";
import userImage from "../../assets/user.png";
import { supabase } from "../../supabaseClient";
import Notifications from "../Notifications/Notifications";
import { useSession } from "../../SessionContext";

const TuteeNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && session.user) {
      setUserId(session.user.id);
    }
  }, [session]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Log out error:", error);
    else {
      navigate("/login");
    }
  };

  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          {/* Logo */}
          <Link to="/tuteehome">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* Hamburger Menu Button */}
          <button onClick={toggleMobileMenu} className="mobile-menu-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                // X icon when menu is open
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                // Hamburger icon when menu is closed
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>

          {/* Navigation Links for Desktop */}
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
          </ul>

          <div className="nav-right">
            {/* Notifications for Desktop */}
            {userId && (
              <Notifications
                userId={userId}
                className="desktop-notifications"
              />
            )}

            {/* Profile Dropdown for Desktop */}
            <div className="profile-dropdown">
              <button onClick={toggleDropdown} className="btnlog">
                <img src={userImage} alt="User" className="user-image" />
                My Account
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    onClick={() => navigate("/TuteeProfile")}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/request" className="mobile-link">
              Request
            </Link>
            <Link to="/tuteeactivity" className="mobile-link">
              Activity
            </Link>
            <Link to="/TuteeProfile" className="mobile-link">
              Profile
            </Link>
            {/* Notifications for Mobile */}
            {userId && (
              <div className="mobile-notifications-container">
                <Notifications
                  userId={userId}
                  className="mobile-notifications"
                />
              </div>
            )}
            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TuteeNav;
