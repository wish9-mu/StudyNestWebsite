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

  // Search Bar States
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tutors, setTutors] = useState([]);

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

  //SEARCH BAR FUNCTIONALITY

  // Fetch courses and tutors on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch courses
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("course_code, course_name");
      if (!courseError && courseData) setCourses(courseData);

      // Fetch tutors
      const { data: tutorData, error: tutorError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .eq("role", "tutor");
      if (!tutorError && tutorData) setTutors(tutorData);
    };
    fetchData();
  }, []);

  // Filter courses as user types
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

  // Filter tutors
  const filteredTutors = tutors.filter(
    (t) =>
      t.first_name.toLowerCase().includes(search.toLowerCase()) ||
      t.last_name.toLowerCase().includes(search.toLowerCase()) ||
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  // Combine results with a type field
  const results = [
    ...filteredCourses.map((c) => ({ type: "course", ...c })),
    ...filteredTutors.map((t) => ({ type: "tutor", ...t })),
  ];

  setFilteredResults(results);
  setShowDropdown(results.length > 0);
}, [search, courses, tutors]);

  // Handle course click
  const handleCourseClick = (course) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/courseinfo/${encodeURIComponent(course.course_code)}`);
  };

  // Handle tutor click
  const handleTutorClick = (tutor) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/tutorinfo/${tutor.id}`);
  };

  return (
    <nav className="nav nav-colored">
      <div className="container">
        <div className="wrapper">
          {/* Logo */}
          <Link to="/tuteehome">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* --- Search Bar --- */}
          <div style={{ position: "relative", width: "250px", marginLeft: "20px" }}>
            <input
              type="text"
              className="nav-search-bar"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(filteredCourses.length > 0)}
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
                      key={`tutor-${item.id}`}
                      className="nav-search-item tutor-result"
                      onMouseDown={() => handleTutorClick(item)}
                    >
                      <span className="tutor-icon" role="img" aria-label="Tutor">👨‍🏫</span>{" "}
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
