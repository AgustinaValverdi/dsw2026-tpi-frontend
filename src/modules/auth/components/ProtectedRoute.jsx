import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { homePathForRole } from '../helpers/roles';

function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
