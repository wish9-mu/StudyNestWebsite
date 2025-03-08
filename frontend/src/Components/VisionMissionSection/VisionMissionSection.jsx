import React from "react";
import { FaLightbulb, FaBullseye } from "react-icons/fa"; // Importing appropriate icons
import "./VisionMissionSection.css"; // Import the CSS file

const VisionMissionSection = () => {
  return (
    <section className="vision-mission-section">
      <div className="vision-container">
        <div className="vm-header">
          <FaLightbulb className="vm-icon" />
          <h1>VISION</h1>
        </div>
        <p>
          To be the premier peer-to-peer learning hub that empowers Mapúa
          students to achieve academic excellence through collaborative
          learning, fostering a community where knowledge is freely shared and
          every student reaches their full potential.
        </p>
      </div>

      <div className="mission-container">
        <div className="vm-header">
          <FaBullseye className="vm-icon" />
          <h1>MISSION</h1>
        </div>
        <p>
          Providing high-quality, accessible academic support through trained
          peer tutors. Creating an inclusive learning environment that addresses
          diverse learning needs. Developing student leaders through our peer
          tutoring program. Supporting Mapúa University's academic standards
          through supplementary learning assistance. Promoting a culture of
          collaborative learning and academic excellence.
        </p>
      </div>
    </section>
  );
};

export default VisionMissionSection;
