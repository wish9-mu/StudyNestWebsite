import React from "react";
import Hero from "../Hero/Hero";
import Title from "../Title/Title";
import About from "../About/About";
import Nav from "../Nav/Nav";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Nav />

      <main>
        <Hero />
        <section className="welcome-section">
          <div className="content-container">
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
              <button className="cta-button">Get Started</button>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="content-container">
            <About />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
