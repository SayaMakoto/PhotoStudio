import { Navigate, Outlet, useLocation } from 'react-router-dom';
import adminAuthService from '../services/admin/authService';
import { ROUTES } from '../routes/web';

export default function AdminRoute() {
  const location = useLocation();

  if (!adminAuthService.hasAdminAccess()) {
    return (
      <Navigate
        to={ROUTES.AUTH.ADMIN_LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
