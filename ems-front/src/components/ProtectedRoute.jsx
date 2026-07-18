import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth";

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
