// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import Companies from '../pages/superadmin/Companies';



import CompanyAdminDashboard from '../pages/company/CompanyDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
      <Route path='/superadmin/companies' element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><Companies/></ProtectedRoute>}/>

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN']}><CompanyAdminDashboard /></ProtectedRoute>} />

      

      {/* Catch-all route - Redirect unknown URLs to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;