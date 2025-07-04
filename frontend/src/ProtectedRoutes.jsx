import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole, children }) => {
  if (userRole === null) return null; // still loading

  // If not logged in (userRole is undefined or false)
  if (!userRole) {
    return <Navigate to="/login"/>;
  }

  // If logged in but role not allowed
  return allowedRoles.includes(userRole)
    ? children
    : <Navigate to="/EP_403"/>;
};

export default ProtectedRoute;
