import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth(); // Prevents undefined access

  if (loading) return <p>Loading...</p>; // Prevent rendering before session loads

  if (!user) return <Navigate to="/login" />; // Redirect if not logged in

  if (role && user.role !== role) return <Navigate to="/" />; // Redirect if role mismatch

  return children;
};

export default ProtectedRoute;
