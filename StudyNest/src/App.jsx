import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Title from "./Components/Title/Title";
import Video from "./Components/Video/Video";
import Request from "./Components/Request/Request";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Developers from "./Components/Developers/Developers";
import TutorProfile from "./Components/Tutor Profile/TutorProfile";
import TutorHome from "./Components/Tutor Home/TutorHome";
import AdminHome from "./Components/Admin Home/AdminHome";
import TuteeHome from "./Components/Tutee Home/TuteeHome";

const App = () => {
  const HomePage = () => (
    <>
      <Hero />
      <div className="container">
        <Title
          subTitle="Takot Bumagsak?"
          title="Oras mo na para humanap ng Tutor!"
        />
        <About />
        <Video />
        <Register />
        <TutorProfile />
      </div>
    </>
  );

  return (
    <Router>
      <div>
        <Navbar />
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
  );
};

export default App;
