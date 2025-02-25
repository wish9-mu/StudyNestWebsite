import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Request from "./Components/Request/Request";
import Developers from "./Components/Developers/Developers";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import TutorHome from "./Components/Tutor Home/TutorHome";
import AdminHome from "./Components/Admin Home/AdminHome";
import TuteeHome from "./Components/Tutee Home/TuteeHome";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/request", element: <Request /> },
  { path: "/developers", element: <Developers /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/tutorhome", element: <TutorHome /> },
  { path: "/adminhome", element: <AdminHome /> },
  { path: "/tuteehome", element: <TuteeHome /> },
];

export default routes;
