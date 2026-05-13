import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired, redirectTo = "/" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
