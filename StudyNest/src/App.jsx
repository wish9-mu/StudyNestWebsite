import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Title from "./Components/Title/Title";
import Video from "./Components/Video/Video";
import Request from "./Components/Request/Request";

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
          <Route path="/developers" element={<div>Developers Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
