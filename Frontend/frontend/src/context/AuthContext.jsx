// src/context/AuthContext.jsx
// like speaker in a class room . log in out knows about it immediately every componant 


import { createContext, useContext, useState } from 'react';
import { getRole, getUser, clearAuth, isLoggedIn } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole]   = useState(getRole());
  const [user, setUser]   = useState(getUser());

  const logout = () => {
    clearAuth();
    setRole(null);
    setUser({});
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ role, user, setRole, setUser, logout, isLoggedIn: isLoggedIn() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);