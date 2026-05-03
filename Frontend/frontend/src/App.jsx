import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Superadmin */}
        <Route path="/" element={<SuperAdminLogin />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <SuperAdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;