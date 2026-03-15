import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../auth/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // 🔹 Grab the token directly from your store. If it exists, they are logged in!
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token; // Converts the token (or null) into a true/false boolean

  if (!isAuthenticated) {
    // Redirect them to the login page, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they have a token, render the protected component!
  return children;
};

export default ProtectedRoute;
