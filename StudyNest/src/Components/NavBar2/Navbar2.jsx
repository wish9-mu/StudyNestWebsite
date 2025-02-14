import React from "react"; // Remove useState and useEffect since they're not used
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import "./Navbar2.css";
import logo from "../../../assets/SNHome.png"; // Adjust path based on your structure

const Navbar2 = () => {
  const location = useLocation();

  // If we're not on the request page, don't render the navbar
  if (location.pathname !== "/Request") {
    return null;
  }

  return (
    <nav className="container">
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

export default Navbar2;
