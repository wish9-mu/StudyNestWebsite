import React from "react";
import "./AdminHome.css";

const AdminCard = ({ className, onClick }) => {
  return (
    <div className={`admin-box ${className || ""}`} onClick={onClick}>
      {/* Card content will go here */}
    </div>
  );
};

export default AdminCard;
