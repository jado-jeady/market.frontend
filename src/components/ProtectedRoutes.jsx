import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log(`Token: ${token}, User: ${user?.role || 'undefined'} allowedRole: ${allowedRole}`);
    alert('You must be logged in to access this page.');
    return <Navigate to="/" replace />;

  }

  // if role is not allowed, block access
  if (allowedRole && user.role !== allowedRole) {
    console.log(` From second if cloese ,User role: ${user.role} is not allowed to access this route. Required role: ${allowedRole}`);
    alert('Access Denied: You do not have permission to view this page.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
