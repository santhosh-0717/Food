import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in → go to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin/Owner only route → check role
  if (adminOnly && user.role !== 'admin' && user.role !== 'restaurant_owner') {
    return <Navigate to="/home" replace />;
  }

  // Customer trying to access dashboard → redirect to home
  if (!adminOnly && user.role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;  