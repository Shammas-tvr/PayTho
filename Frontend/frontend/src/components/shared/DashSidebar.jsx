// src/components/shared/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = {
  SUPERADMIN: [
    { label: 'Dashboard',  path: '/superadmin/dashboard' },
    { label: 'Companies',  path: '/superadmin/companies' },
    { label: 'All Users',  path: '/superadmin/users' },
  ],
  COMPANY_ADMIN: [
    { label: 'Dashboard',  path: '/admin/dashboard' },
    { label: 'Branches',   path: '/admin/branches' },
    { label: 'Staff',      path: '/admin/staff' },
  ],
  MANAGER: [
    { label: 'Dashboard',  path: '/manager/dashboard' },
    { label: 'My Team',    path: '/manager/team' },
    { label: 'Approvals',  path: '/manager/approvals' },
  ],
  STAFF: [
    { label: 'Dashboard',  path: '/staff/dashboard' },
    { label: 'My Tasks',   path: '/staff/tasks' },
    { label: 'Attendance', path: '/staff/attendance' },
  ],
  CASHIER: [
    { label: 'Dashboard',  path: '/cashier/dashboard' },
    { label: 'Payments',   path: '/cashier/payments' },
  ],
};

const Sidebar = () => {
  const { role } = useAuth();
  const items = menuItems[role] || [];

  return (
    <aside style={{ width: '240px', minHeight: '100vh', padding: '24px 16px' }}>
      <h3>Paytho ERP</h3>
      <nav>
        {items.map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 12px',
              marginBottom: '4px',
              borderRadius: '8px',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;