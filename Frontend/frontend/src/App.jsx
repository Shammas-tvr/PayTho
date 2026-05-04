import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import CompanyLogin from "./pages/company/Companylogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Superadmin */}
        <Route path="/admin" element={<SuperAdminLogin />} />
        <Route path="/" element={<CompanyLogin/>}></Route>
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