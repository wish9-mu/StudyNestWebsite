import React from "react";
import "./Video.css";

const Video = ({ videoId }) => {
  return (
    <div className="youtube-container">
      <iframe
        src={`https://www.youtube.com/embed/bD9whtdq7dw?si=h8xEA-_6rGWKJ73r&start=5&autoplay=1&controls=0`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Video;
