// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { saveAuth } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

const redirectMap = {
  SUPERADMIN:    '/superadmin/dashboard',
  COMPANY_ADMIN: '/admin/dashboard',
  MANAGER:       '/manager/dashboard',
  STAFF:         '/staff/dashboard',
  CASHIER:       '/cashier/dashboard',
};

const Login = () => {
  const navigate        = useNavigate();
  const { setRole, setUser } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login/', form);
      saveAuth(res.data);
      setRole(res.data.role);
      setUser({ username: res.data.username });
      navigate(redirectMap[res.data.role] || '/login');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Paytho ERP</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;