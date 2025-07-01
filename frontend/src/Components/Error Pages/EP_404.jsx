import React from "react";
import "./ErrorPages.css";
import SNError from "../../assets/SNError.png";

const EP_404 = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <img src={SNError} alt="Not Found" className="notfound-image" />
        <h1 className="notfound-code">404</h1>
        <h1 className="notfound-heading">Page not Found</h1>
        <p className="notfound-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className="notfound-link">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default EP_404;