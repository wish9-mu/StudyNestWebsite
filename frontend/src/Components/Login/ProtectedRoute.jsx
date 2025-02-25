import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // Redirect if not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // Redirect if wrong role

  return children;
};

export default ProtectedRoute;
