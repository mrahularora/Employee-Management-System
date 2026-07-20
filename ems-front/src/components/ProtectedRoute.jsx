import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../auth";

const ProtectedRoute = ({ children, role }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return !role || getRole() === role ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
