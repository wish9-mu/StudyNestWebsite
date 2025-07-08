import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { SessionContext } from "./SessionContext";
import ProtectedRoute from "./ProtectedRoutes";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

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
import TuteeActivity from "./Components/Tutee Activity/TuteeActivity";
import AdminProfile from "./Components/Admin Profile/AdminProfile";
import VisionMissionSection from "./Components/VisionMissionSection/VisionMissionSection";
import ForgotPassword from "./Components/ResetPassword/ForgotPassword";
import UpdateYourPassword from "./Components/ResetPassword/UpdateYourPassword";
import TutorActivity from "./Components/TutorActivity/TutorActivity";
import GuestRequest from "./Components/Request/GuestRequest";
import AdminStats from "./Components/Admin Statistics/AdminStat";
import ClassSchedule from "./Components/ProfileContent/ClassSchedule";
import CourseInfo from "./Components/CourseInfo/CourseInfo";
import TutorPublicProfile from "./Components/TutorPublicProfile/TutorPublicProfile";
import TuteePublicProfile from "./Components/TuteePublicProfile/TuteePublicProfile";
import EP_403 from "./Components/Error Pages/EP_403";
import EP_404 from "./Components/Error Pages/EP_404";
import Loading from "./Components/Loading Page/Loading"
import ReminderService from "./Components/Notifications/ReminderService";

const AppRoutes = ({ session, userRole, loading }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && session && userRole) {
      const currentPath = location.pathname;

      // Only auto-redirect if currently on "/" or "/login"
      if (currentPath === "/" || currentPath === "/login") {
        switch (userRole) {
          case "admin":
            navigate("/adminhome", { replace: true });
            break;
          case "tutor":
            navigate("/tutorhome", { replace: true });
            break;
          case "tutee":
            navigate("/tuteehome", { replace: true });
            break;
          default:
            navigate("/EP_403", { replace: true });
        }
      }
    }
  }, [session, userRole, loading, location.pathname, navigate]);

  const roleStillLoading = session && userRole === null;
  if (loading || roleStillLoading) return <Loading/>;


  return (
    <Routes>
      {/* General Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/guestrequest" element={<GuestRequest />} />
      <Route path="/developers" element={<Developers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/updateyourpassword" element={<UpdateYourPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/tutoractivity" element={<TutorActivity />} />
      <Route path="/guestrequest" element={<GuestRequest />} />
      <Route path="/adminstats" element={<AdminStats />} />
      <Route path="/classschedule" element={<ClassSchedule />} />
      <Route path="/courseinfo/:course_code" element={<CourseInfo />} />
      <Route path="/tutorinfo/:id" element={<TutorPublicProfile />} />
      <Route path="/tuteeinfo/:id" element={<TuteePublicProfile />} />
      <Route path="/EP_403" element={<EP_403 />} />
      <Route path="*" element={<EP_404 />} />

      {/* Admin Routes */}
      <Route path="/adminprofile" element={
        <ProtectedRoute allowedRoles={["admin"]} userRole={userRole} session={session}>
          <AdminProfile />
        </ProtectedRoute>
      } />
      <Route path="/adminstats" element={
        <ProtectedRoute allowedRoles={["admin"]} userRole={userRole} session={session}>
          <AdminStats />
        </ProtectedRoute>
      } />
      <Route path="/adminhome" element={
        <ProtectedRoute allowedRoles={["admin"]} userRole={userRole} session={session}>
          <AdminHome />
        </ProtectedRoute>
      } />

      {/* Tutor Routes */}
      <Route path="/tutorprofile" element={
        <ProtectedRoute allowedRoles={["tutor"]} userRole={userRole} session={session}>
          <TutorProfile />
        </ProtectedRoute>
      } />
      <Route path="/tutorbookings" element={
        <ProtectedRoute allowedRoles={["tutor"]} userRole={userRole} session={session}>
          <TutorBookings />
        </ProtectedRoute>
      } />
      <Route path="/tutoractivity" element={
        <ProtectedRoute allowedRoles={["tutor"]} userRole={userRole} session={session}>
          <TutorActivity />
        </ProtectedRoute>
      } />
      <Route path="/tutorhome" element={
        <ProtectedRoute allowedRoles={["tutor"]} userRole={userRole} session={session}>
          <TutorHome />
        </ProtectedRoute>
      } />

      {/* Tutee Routes */}
      <Route path="/request" element={
        <ProtectedRoute allowedRoles={["tutee"]} userRole={userRole} session={session}>
          <Request />
        </ProtectedRoute>
      } />
      <Route path="/tuteeprofile" element={
        <ProtectedRoute allowedRoles={["tutee"]} userRole={userRole} session={session}>
          <TuteeProfile />
        </ProtectedRoute>
      } />
      <Route path="/tuteeactivity" element={
        <ProtectedRoute allowedRoles={["tutee"]} userRole={userRole} session={session}>
          <TuteeActivity />
        </ProtectedRoute>
      } />
      <Route path="/tuteehome" element={
        <ProtectedRoute allowedRoles={["tutee"]} userRole={userRole} session={session}>
          <TuteeHome />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const FooterWithRouteCheck = () => {
  const location = useLocation();
  const noFooterPaths = [
    "/login",
    "/register",
    "/forgotpassword",
    "/tuteeprofile",
    "/tutorprofile",
  ];

  if (noFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <footer>© StudyNest 2025. All Rights Reserved.</footer>;
};

const App = () => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("❌ Failed to fetch role:", error.message);
        } else {
          setUserRole(data.role);
        }
      }

      setLoading(false); // session is ready, role is fetched
    };

    fetchUserRole();
  }, [session]);

  // Debug
  useEffect(() => {
    console.log("✅ Session:", session);
    console.log("✅ Role:", userRole);
  }, [session, userRole]);

  // Wait for both session and role to be ready
  if (loading) return <Loading/>;

  return (
    <SessionContext.Provider value={{ session, userRole }}>
      <Router>
        <div className="app-container">
          <div className="content">
            <AppRoutes session={session} userRole={userRole} loading={loading} />
          </div>
          <ReminderService />
          <FooterWithRouteCheck />
        </div>
      </Router>
    </SessionContext.Provider>
  );
};


export default App;