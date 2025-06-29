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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  //search bar states
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [tutees, setTutees] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Log out error:", error);
    else {
      setUser(null);
      navigate("/login");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get the user ID
  useEffect(() => {
    if (!user?.email) return; // Ensure `user.email` exists before fetching

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
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

  //Search functionality
  // Fetch courses and tutees on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch courses
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("course_code, course_name");
      if (!courseError && courseData) setCourses(courseData);

      // Fetch tutees
      const { data: tuteeData, error: tuteeError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .eq("role", "tutee");
      if (!tuteeError && tuteeData) setTutees(tuteeData);
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (search.trim() === "") {
      setFilteredResults([]);
      setShowDropdown(false);
      return;
    }

    // Filter courses
    const filteredCourses = courses.filter(
      (c) =>
        c.course_code.toLowerCase().includes(search.toLowerCase()) ||
        c.course_name.toLowerCase().includes(search.toLowerCase())
    );

    // Filter tutees
    const filteredTutees = tutees.filter(
      (t) =>
        t.first_name.toLowerCase().includes(search.toLowerCase()) ||
        t.last_name.toLowerCase().includes(search.toLowerCase()) ||
        `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    // Combine results with a type field
    const results = [
      ...filteredCourses.map((c) => ({ type: "course", ...c })),
      ...filteredTutees.map((t) => ({ type: "tutee", ...t })),
    ];

    setFilteredResults(results);
    setShowDropdown(results.length > 0);
  }, [search, courses, tutees]);

  const handleCourseClick = (course) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/courseinfo/${encodeURIComponent(course.course_code)}`);
  };

  const handleTuteeClick = (tutee) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/tuteeinfo/${tutee.id}`); // You need to create this page if you want
  };

  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          {/* Logo */}
          <Link to="/tutorhome">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* --- Search Bar --- */}
          <div style={{ position: "relative", width: "250px", marginLeft: "20px" }}>
            <input
              type="text"
              className="nav-search-bar"
              placeholder="Search courses or tutees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(filteredResults.length > 0)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
            {showDropdown && (
              <div
                className="nav-search-dropdown"
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto"
                }}
              >
                {filteredResults.map((item) =>
                  item.type === "course" ? (
                    <div
                      key={`course-${item.course_code}`}
                      className="nav-search-item"
                      onMouseDown={() => handleCourseClick(item)}
                    >
                      <strong>{item.course_code}</strong> - {item.course_name}
                    </div>
                  ) : (
                    <div
                      key={`tutee-${item.id}`}
                      className="nav-search-item tutee-result"
                      onMouseDown={() => handleTuteeClick(item)}
                    >
                      <span className="tutee-icon" role="img" aria-label="Tutee">👤</span>{" "}
                      {item.first_name} {item.last_name}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          {/* --- End Search Bar --- */}


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
            {userId && (
              <Notifications
                userId={userId}
                className="desktop-notifications"
              />
            )}

            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <button onClick={toggleDropdown} className="btnlog">
                <img src={userImage} alt="User" className="user-image" />
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/tutorhome" className="mobile-link">
              Dashboard
            </Link>
            <Link to="/tutorbookings" className="mobile-link">
              Bookings
            </Link>
            <Link to="/tutoractivity" className="mobile-link">
              Activity
            </Link>
            <Link to="/TutorProfile" className="mobile-link">
              Profile
            </Link>

            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TutorNav;
