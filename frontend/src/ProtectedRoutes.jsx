import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole, children }) => {
  if (userRole === null) return null; // wait for role to load
  console.log("ProtectedRoute → Role:", userRole);
  return allowedRoles.includes(userRole) ? children : <Navigate to="/EP_403" />;
};

export default ProtectedRoute;
