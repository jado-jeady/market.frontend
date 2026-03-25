import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.data.user.role) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/" replace />;
  }

  // if role is not allowed, block access
  if (allowedRole && user.data.user.role !== allowedRole) {
    alert("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
