// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute        from './ProtectedRoute';
import Login                 from '../pages/auth/Login';
import SuperAdminDashboard   from '../pages/superadmin/SuperAdminDashboard';
import CompanyAdminDashboard from '../pages/company/CompanyDashboard';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route path="/superadmin/dashboard" element={
      <ProtectedRoute allowedRoles={['SUPERADMIN']}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    }/>

    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={['COMPANY_ADMIN']}>
        <CompanyAdminDashboard />
      </ProtectedRoute>
    }/>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;