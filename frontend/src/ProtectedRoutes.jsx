import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole, session, children }) => {
  // Case 1: Still loading userRole but logged in
  if (session && userRole === null) return null;

  // Case 2: Not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Case 3: Logged in but role not allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/EP_403" replace />;
  }

  // Case 4: Authorized
  return children;
};

export default ProtectedRoute;
