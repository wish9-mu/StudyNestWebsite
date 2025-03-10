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
      const titleSection = document.querySelector(".title");
      if (titleSection) {
        const titlePosition = titleSection.getBoundingClientRect().top;
        setNavBackground(titlePosition <= 0);
      } else {
        // If .title section doesn't exist, set navBackground to true
        setNavBackground(true);
      }
    };

    // If the current route is not the home page, force red background
    if (location.pathname !== "/") {
      setNavBackground(true);
    } else {
      // If on the home page, handle scroll logic
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Call once to set initial state
    }

    return () => window.removeEventListener("scroll", handleScroll);
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
