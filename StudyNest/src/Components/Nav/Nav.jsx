import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Nav.css";
import logo from "../../assets/SNHome.png";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className={`nav ${navBackground ? "nav-colored" : ""}`}>
      <div className="container">
        <div className="wrapper">
          <div className="left-section">
            <Link to="/">
              <img src={logo} alt="Logo" className="logo" />
            </Link>
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
                <Link to="/request" className="nav-link">
                  Request
                </Link>
              </li>
              <li>
                <Link to="/developers" className="nav-link">
                  Developers
                </Link>
              </li>
              <li>
                <Link to="/login" className="btnlog">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
