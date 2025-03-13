import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Nav.css";
import logo from "../../assets/SNHome.png";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const titleSection = document.querySelector(".title");
        if (titleSection) {
          const titlePosition = titleSection.getBoundingClientRect().top;
          setNavBackground(titlePosition <= 0);
        } else {
          // Fall back to basic scroll position if .title doesn't exist
          setNavBackground(window.scrollY > 80);
        }
      }
    };

    // Set initial state based on route
    if (location.pathname !== "/") {
      // For non-home pages, always have background
      setNavBackground(true);
    } else {
      // For homepage, start with no background
      setNavBackground(false);

      // Add scroll listener for homepage only
      window.addEventListener("scroll", handleScroll);

      // Check initial scroll position after a small delay to ensure DOM is ready
      setTimeout(handleScroll, 100);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]); // Re-run effect when location changes
  return (
    <nav className={`nav ${navBackground ? "nav-colored" : ""}`}>
      <div className="container">
        <div className="wrapper">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* Navigation Links */}
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/guestrequest" className="nav-link">
                Request
              </Link>
            </li>
            <li>
              <Link to="/developers" className="nav-link">
                Developers
              </Link>
            </li>
          </ul>

          {/* Login Button */}
          <Link to="/login" className="btnlog">
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link">
              Home
            </Link>
            <Link to="/about" className="mobile-link">
              About
            </Link>
            <Link to="/request" className="mobile-link">
              Request
            </Link>
            <Link to="/developers" className="mobile-link">
              Developers
            </Link>
            <Link to="/login" className="mobile-link">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
