import React from "react";
import "./About.css";
import Nav from "../Nav/Nav";
import { FaEye, FaBullseye } from "react-icons/fa";

const AboutPage = () => {
  return (
    <>
      <Nav />
      <div className="about-container">
        <div className="about-section">
          <div className="about-header">
            <h1 className="about-title">About Us</h1>
          </div>

          <div className="about-content">
            <p>
              StudyNest is Mapúa University's premier peer tutoring program,
              dedicated to fostering academic excellence through
              student-to-student learning support. Our program selects, trains,
              and deploys qualified volunteer student tutors to conduct both
              one-on-one and group tutoring sessions.
            </p>
            <p>
              Established with the goal of enhancing academic performance,
              StudyNest focuses on providing comprehensive support for
              fundamental courses in mathematics and engineering subjects,
              ensuring that Mapúa students receive the assistance they need to
              excel in their academic journey.
            </p>
          </div>
        </div>

        <div className="card-container">
          <div className="card">
            <div className="card-header">
              <FaEye size={36} color="var(--red)" />
              <h2 className="card-title">Vision</h2>
            </div>
            <p className="card-content">
              To be the premier peer-to-peer learning hub that empowers Mapúa
              students to achieve academic excellence through collaborative
              learning, fostering a community where knowledge is freely shared
              and every student reaches their full potential.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <FaBullseye size={36} color="var(--red)" />
              <h2 className="card-title">Mission</h2>
            </div>
            <p className="card-content">
              We are committed to providing high-quality, accessible academic
              support through trained peer tutors while fostering an inclusive
              learning environment that caters to diverse learning needs. Our
              peer tutoring program not only offers supplementary learning
              assistance to uphold Mapúa University's academic standards but
              also develops student leaders. By promoting a culture of
              collaborative learning and academic excellence, we strive to
              empower students in their academic journey.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
