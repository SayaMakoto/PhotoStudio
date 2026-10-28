import { Navigate, Outlet, useLocation } from 'react-router-dom';
import employeeAuthService from '../services/employee/authService';
import { ROUTES } from '../routes/web';

export default function EmployeeRoute() {
  const location = useLocation();

  if (!employeeAuthService.hasEmployeeAccess()) {
    return (
      <Navigate
        to={ROUTES.AUTH.EMPLOYEE_LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
