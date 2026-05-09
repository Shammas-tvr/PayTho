// src/App.jsx
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.__hideLoader?.();
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;