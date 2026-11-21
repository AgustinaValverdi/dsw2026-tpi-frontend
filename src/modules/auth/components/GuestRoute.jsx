import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { redirectAfterLogin } from '../helpers/roles';

function GuestRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate to={redirectAfterLogin(role, location.state?.from)} replace />
    );
  }

  return children;
}

export default GuestRoute;
