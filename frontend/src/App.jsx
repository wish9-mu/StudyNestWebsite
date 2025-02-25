import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/Homepage"; // Import HomePage
import About from "./Components/About/About"; // Add this import
import Request from "./Components/Request/Request";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Developers from "./Components/Developers/Developers";
import TutorProfile from "./Components/Tutor Profile/TutorProfile";
import TutorHome from "./Components/Tutor Home/TutorHome";
import AdminHome from "./Components/Admin Home/AdminHome";
import TuteeHome from "./Components/Tutee Home/TuteeHome";
import TuteeProfile from "./Components/Tutee Profile/TuteeProfile";
import TutorBookings from "./Components/Tutor Bookings/TutorBookings";
import TuteeWaitlist from "./Components/Tutee Waitlist/TuteeWaitlist";
import TuteeActivity from "./Components/Tutee Activity/TuteeActivity";
import AdminProfile from "./Components/Admin Profile/AdminProfile";
import ProtectedRoute from "./Components/Login/ProtectedRoute";
import { AuthProvider } from "./Components/Login/AuthContext";

const App = () => {
  //const [loggedIn, setLoggedIn] = useState(false);  for checking log ins
  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Include the Nav component */}
          <Routes>
            <Route path="/" element={<HomePage />} />{" "}
            <Route path="/about" element={<About />} />{" "}
            <Route path="/request" element={<Request />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tutorprofile" element={<TutorProfile />} />
            <Route path="/logout" element={<HomePage />} />
            <Route path="/tuteeprofile" element={<TuteeProfile />} />
            <Route path="/tutorbookings" element={<TutorBookings />} />
            <Route path="/tuteewaitlist" element={<TuteeWaitlist />} />
            <Route path="/tuteeactivity" element={<TuteeActivity />} />
            <Route path="/adminprofile" element={<AdminProfile />} />

            {/* Protected Routes */}
            <Route path="/tutorhome" element={<ProtectedRoute role="tutor"><TutorHome /></ProtectedRoute>} />
            <Route path="/adminhome" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
            <Route path="/tuteehome" element={<ProtectedRoute role="tutee"><TuteeHome /></ProtectedRoute>} />

          </Routes>
        </div>
      </Router>

      <footer>© StudyNest 2025. All Rights Reserved.</footer>
    </AuthProvider>
  );
};

export default App;
