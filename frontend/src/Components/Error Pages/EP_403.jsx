import React from "react";
import "./ErrorPages.css";
import SNError from "../../assets/SNError.png";

const EP_403 = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <img src={SNError} alt="Not Found" className="notfound-image" />
        <h1 className="notfound-code">403</h1>
        <h1 className="notfound-heading">Forbidden</h1>
        <p className="notfound-message">
          You don't have permission to access this resource.
        </p>
        <a href="/" className="notfound-link">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default EP_403;