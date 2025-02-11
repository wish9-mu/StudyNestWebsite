import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/SNHome.png";

const Navbar = () => {
  const [navBackground, setNavBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const titleSection = document.querySelector(".title");
      if (titleSection) {
        const titlePosition = titleSection.getBoundingClientRect().top;
        setNavBackground(titlePosition <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`container ${navBackground ? "nav-colored" : ""}`}>
      <Link to="/">
        <img src={logo} alt="" className="logo" />
      </Link>
      <ul>
        <li>
          <Link to="/" className="nav-links">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-links">
            About
          </Link>
        </li>
        <li>
          <Link to="/request" className="nav-links">
            Request
          </Link>
        </li>
        <li>
          <Link to="/developers" className="nav-links">
            Developers
          </Link>
        </li>
        <li>
          <Link to="/login" className="btnlog">
            Tutor Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
