import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import Login from './pages/auth/Login';
import NotFound from './pages/errors/NotFound';

function App() {
  useEffect(() => {
    // Fires after React has painted — safe to hide the splash
    window.__hideLoader?.();
  }, []); // empty deps = runs once on mount

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;