import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Title from "./Components/Title/Title";
import Request from "./Components/Request/Request";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Developers from "./Components/Developers/Developers";
import TutorProfile from "./Components/Tutor Profile/TutorProfile";
import TutorHome from "./Components/Tutor Home/TutorHome";
import AdminHome from "./Components/Admin Home/AdminHome";
import TuteeHome from "./Components/Tutee Home/TuteeHome";
import Nav from "./Components/Nav/Nav";

const App = () => {
  const HomePage = () => (
    <>
      <Hero />
      <div>
        <Title
          subTitle="Takot Bumagsak?"
          title="Oras mo na para humanap ng Tutor!"
        />
        <About />
        <Register />
        <TutorProfile />
      </div>
    </>
  );

  return (
    <>
      <Router>
        <div>
          <Nav />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/request" element={<Request />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tutorhome" element={<TutorHome />} />
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/tuteehome" element={<TuteeHome />} />
          </Routes>
        </div>
      </Router>
      <footer>© StudyNest 2025. All Rights Reserved.</footer>
    </>
  );
};

export default App;
