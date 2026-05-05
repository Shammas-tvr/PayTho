// src/components/shared/Header.jsx
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, role, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #eee' }}>
      <span>Welcome, {user?.username}</span>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', padding: '4px 10px', background: '#e0f2fe', borderRadius: '999px' }}>
          {role}
        </span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;