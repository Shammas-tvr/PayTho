// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const redirectMap = {
  SUPERADMIN:    '/superadmin/dashboard',
  COMPANY_ADMIN: '/admin/dashboard',
  MANAGER:       '/manager/dashboard',
  STAFF:         '/staff/dashboard',
  CASHIER:       '/cashier/dashboard',
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectMap[role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;