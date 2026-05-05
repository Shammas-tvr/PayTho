// src/utils/auth.js
// storing user details 
export const getToken = () => localStorage.getItem('token');
export const getRole  = () => localStorage.getItem('role');
export const getUser  = () => JSON.parse(localStorage.getItem('user') || '{}');

export const saveAuth = (data) => {
  localStorage.setItem('token',      data.access);
  localStorage.setItem('role',       data.role);
  localStorage.setItem('user',       JSON.stringify({
    username:   data.username,
    company_id: data.company_id,
    branch_id:  data.branch_id,
  }));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

export const isLoggedIn = () => !!getToken();