import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./Components/Login/AuthContext";
import ProtectedRoute from "./Components/Login/ProtectedRoute";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Components import
import HomePage from "./Components/HomePage/HomePage";
import About from "./Components/About/About";
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
import VisionMissionSection from "./Components/VisionMissionSection/VisionMissionSection";
import ForgotPassword from "./Components/ResetPassword/ForgotPassword";
import UpdateYourPassword from "./Components/ResetPassword/UpdateYourPassword";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Redirect logged-in users to the correct dashboard if they visit "/"
      if (location.pathname === "/") {
        if (user.role === "admin") navigate("/adminhome");
        else if (user.role === "tutor") navigate("/tutorhome");
        else if (user.role === "tutee") navigate("/tuteehome");
      }
    }
  }, [user, loading, location, navigate]);

  if (loading) return <p>Loading session...</p>;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
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
      <Route path="/visionmission" element={<VisionMissionSection />} />
      <Route path="/updateyourpassword" element={<UpdateYourPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/tutorhome"
        element={
          <ProtectedRoute role="tutor">
            <TutorHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminhome"
        element={
          <ProtectedRoute role="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuteehome"
        element={
          <ProtectedRoute role="tutee">
            <TuteeHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <AppRoutes />
        </div>
      </Router>
      <footer>© StudyNest 2025. All Rights Reserved.</footer>
    </AuthProvider>
  );
};

export default App;
