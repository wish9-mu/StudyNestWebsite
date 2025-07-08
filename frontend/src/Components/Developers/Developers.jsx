import React from "react";
import "./Developers.css";
import Nav from "../Nav/Nav";
import sofia from "../../assets/Dsofia.png";
import rayleen from "../../assets/Drayleen.png";
import luis from "../../assets/Dluis.jpg";
import rafael from "../../assets/Drafael.png";
import ralf from "../../assets/RalfD.jpg";

const Developers = () => {
  const developers = [
    {
      name: "Sofia Dela Cruz",
      role: "Frontend Developer",
      description:
        "As the Frontend Developer, Sofia builds and optimizes visually engaging, responsive, and interactive user interfaces to enhance the overall user experience.",
      image: sofia,
    },
    {
      name: "Rayleen Morales",
      role: "Backend Developer",
      description:
        "As the Backend Developer, Rayleen develops and maintains the server-side logic, database architecture, and APIs to ensure robust and scalable application performance.",
      image: rayleen,
    },
    {
      name: "Luis Respicio",
      role: "UI/UX Designer",
      description:
        "As the UI/UX Designer, Luis creates intuitive, user-centered designs by blending aesthetics and functionality to ensure seamless navigation and engagement.",
      image: luis,
    },
    {
      name: "Rafael Benipayo",
      role: "Quality Assurance (QA)",
      description:
        "As the Quality Assurance (QA) specialist, Rafael ensures software reliability and functionality by conducting thorough testing, identifying bugs, and improving system stability.",
      image: rafael,
    },
    {
      name: "Ralf Zabala",
      role: "Quality Assurance (QA)",
      description:
        "As the Quality Assurance (QA) specialist, Rafael ensures software reliability and functionality by conducting thorough testing, identifying bugs, and improving system stability.",
      image: ralf,
    },
  ];

  return (
    <>
      <Nav />
      <div className="developers">
        <div className="container">
          <h1>Meet the Developers.</h1>

          <div className="developers-grid">
            {developers.map((dev, index) => (
              <div key={index} className="developer-card">
                <div className="dev-profile-image">
                  <img src={dev.image} alt={dev.name} />
                </div>
                <div className="developer-info">
                  <h2>{dev.name}</h2>
                  <p className="role">{dev.role}</p>
                  <p className="description">{dev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Developers;
