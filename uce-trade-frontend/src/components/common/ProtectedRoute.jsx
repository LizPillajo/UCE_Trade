import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore} from '../../store/authStore';
import { CircularProgress, Box } from '@mui/material';

// allowedRoles: Array with the allowed roles for this route ['ADMIN'], ['STUDENT'], etc.
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  // If not logged in, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but role is not in the allowed list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a student tries to access admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;