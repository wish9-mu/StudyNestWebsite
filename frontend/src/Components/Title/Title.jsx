import React from "react";
import "./Title.css";

const Title = ({ subTitle, title }) => {
  return (
    <div className="title">
      <h2>{subTitle}</h2>
      <p>{title}</p>
    </div>
  );
};

export default Title;
