import React from "react";
import "./About.css";
import program_1 from "../../assets/Rayleen.png";
import program_2 from "../../assets/Ralf.png";
import program_3 from "../../assets/Sofia.png";

import program_icon_1 from "../../assets/program-icon-1.png";
import program_icon_2 from "../../assets/program-icon-2.png";
import program_icon_3 from "../../assets/program-icon-3.png";

//Other Import
// import program_icon_1 from "../../assets/perd1.jpg";
// import program_icon_2 from "../../assets/perd2.jpg";
// import program_icon_3 from "../../assets/perd3.png";
// import program_1 from "../../assets/ml1.jpg";
// import program_2 from "../../assets/ml2.jpg";
// import program_3 from "../../assets/ml3.jpg";
import VideoBackground from "../VideoBackground/VideoBackground";

const About = () => {
  return (
    <div className="content-wrapper">
      <div className="abouts">
        <div className="about">
          <img src={program_1} alt="" />
          <div className="caption">
            <img src={program_icon_1} alt="" />
            <p>Learn with Us!</p>
          </div>
        </div>
        <div className="about">
          <img src={program_2} alt="" />
          <div className="caption">
            <img src={program_icon_2} alt="" />
            <p>How you can excel.</p>
          </div>
        </div>
        <div className="about">
          <img src={program_3} alt="" />
          <div className="caption">
            <img src={program_icon_3} alt="" />
            <p>Courses</p>
          </div>
        </div>
      </div>
      <VideoBackground />
    </div>
  );
};

export default About;
