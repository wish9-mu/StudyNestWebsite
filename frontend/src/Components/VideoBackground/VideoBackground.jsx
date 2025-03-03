import React from "react";
import kiyoVideo from "../../assets/kiyo.mp4";
import "./VideoBackground.css";
import LabHaha from "../../assets/LABHAHA.mp4";

const VideoBackground = () => {
  return (
    <section className="video-section">
      <video autoPlay loop muted playsInline className="background-video">
        <source src={LabHaha} type="video/mp4" />
      </video>
      <div className="overlay-content">
        <div className="text-container">
          <h2>Ready to Learn?</h2>
          <p className="subtitle">Join our community of learners today</p>
          <button className="action-btn">Find a Tutor</button>
        </div>
      </div>
    </section>
  );
};

export default VideoBackground;
