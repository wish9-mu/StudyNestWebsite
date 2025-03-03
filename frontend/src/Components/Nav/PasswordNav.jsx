import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/SNHome.png";

const PasswordNav = () => {
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
          <Link>
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PasswordNav;
