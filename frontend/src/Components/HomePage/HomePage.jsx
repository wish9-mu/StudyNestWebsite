import React from "react";
import Hero from "../Hero/Hero";
import Title from "../Title/Title";
import Nav from "../Nav/Nav";
import "./HomePage.css";
import TutorImg2 from "../../assets/TutorImg2.png";
import about_icon_1 from "../../assets/program-icon-1.png";
import TutorImg1 from "../../assets/TutorImg1.png";
import { FaLightbulb, FaChartLine } from "react-icons/fa";
import nelson from "../../assets/nelson.jpg";
import study from "../../assets/study.jpg";
import study2 from "../../assets/study2.jpg";
import { FaEye, FaBullseye } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="homepage">
      <Nav />

      <main>
        <Hero />

        {/*hi*/}
        <section className="fullscreen-section">
          <div className="content-container">
            <h1>STUDYNEST IS THE KEY TO YOUR SUCCESS</h1>
            <p>
              At StudyNest, we recognize the unique challenges and demands of
              Mapua's rigorous academic environment. Our mission is to support
              you in overcoming these challenges and help you reach your
              academic goals. Join us at StudyNest to take charge of your
              academic journey, enhance your learning experience, and connect
              with peers who share your passion for knowledge. Together, we can
              navigate the challenges of university life and celebrate the joys
              of learning!
            </p>
          </div>
        </section>

        {/* Banner Section - Matches the image */}
        <section className="banner-section">
          <div className="banner-content">
            <h1>STUDYNEST IS THE KEY TO YOUR SUCCESS</h1>
            <p>
              At StudyNest, we recognize the unique challenges and demands of
              Mapua's rigorous academic environment. Our mission is to support
              you in overcoming these challenges and help you reach your
              academic goals. Join us at StudyNest to take charge of your
              academic journey, enhance your learning experience, and connect
              with peers who share your passion for knowledge. Together, we can
              navigate the challenges of university life and celebrate the joys
              of learning!
            </p>
          </div>
          <div className="banner-image">
            <img src={study2} alt="Mapúa University Building" />
          </div>
        </section>

        <section className="welcome-section">
          <div className="welcome-content">
            <Title
              title="Transform your academic journey with StudyNest, the premier peer tutoring platform exclusively designed for Mapúa University students. Built by Cardinals for Cardinals, we understand the unique challenges of Mapúa's rigorous academic environment."
              className="main-title"
              subTitle="Welcome to StudyNest: Where Mapúans Help Mapúans Excel"
            />

            <div className="cta-section">
              <Title
                subTitle="Ready to Excel?"
                title="Join our community of successful Mapúan students today"
              />
              <button className="cta-button">GET STARTED</button>
            </div>
          </div>

          <div className="welcome-image">
            <img src={TutorImg1} alt="Mapúa students studying together" />
          </div>
        </section>

        <section className="welcome-section vision-mission-section">
          <div className="card-container">
            <div className="card">
              <div className="card-header">
                <FaEye size={36} color="#cc0000" />
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
                <FaBullseye size={36} color="#cc0000" />
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
        </section>
      </main>
    </div>
  );
};

export default HomePage;
