// src/components/shared/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/* ── Menu config ─────────────────────────────────────────────── */
const menuItems = {
  SUPERADMIN: [
    { label: 'Dashboard',    path: '/superadmin/dashboard', icon: 'ti-layout-dashboard' },
    { label: 'Companies',    path: '/superadmin/companies', icon: 'ti-building'          },
    { label: 'All Users',    path: '/superadmin/users',     icon: 'ti-users'             },
    { label: 'Audit Logs',   path: '/superadmin/logs',      icon: 'ti-clipboard-list'    },
    { label: 'Settings',     path: '/superadmin/settings',  icon: 'ti-settings'          },
  ],
  COMPANY_ADMIN: [
    { label: 'Dashboard',    path: '/admin/dashboard',      icon: 'ti-layout-dashboard' },
    { label: 'Branches',     path: '/admin/branches',       icon: 'ti-building-store'   },
    { label: 'Staff',        path: '/admin/staff',          icon: 'ti-id-badge'         },
    { label: 'Reports',      path: '/admin/reports',        icon: 'ti-chart-bar'        },
    { label: 'Settings',     path: '/admin/settings',       icon: 'ti-settings'         },
  ],
  HR_MANAGER: [
    { label: 'Dashboard',    path: '/hr/dashboard',         icon: 'ti-layout-dashboard' },
    { label: 'Employees',    path: '/hr/employees',         icon: 'ti-users'            },
    { label: 'Attendance',   path: '/hr/attendance',        icon: 'ti-calendar-check'   },
    { label: 'Payroll',      path: '/hr/payroll',           icon: 'ti-report-money'     },
    { label: 'Leave',        path: '/hr/leave',             icon: 'ti-beach'            },
  ],
  FINANCE_MANAGER: [
    { label: 'Dashboard',    path: '/finance/dashboard',    icon: 'ti-layout-dashboard' },
    { label: 'Transactions', path: '/finance/transactions', icon: 'ti-arrows-exchange'  },
    { label: 'Invoices',     path: '/finance/invoices',     icon: 'ti-file-invoice'     },
    { label: 'Budgets',      path: '/finance/budgets',      icon: 'ti-coins'            },
    { label: 'Reports',      path: '/finance/reports',      icon: 'ti-chart-line'       },
  ],
  AUDITOR: [
    { label: 'Dashboard',    path: '/auditor/dashboard',    icon: 'ti-layout-dashboard' },
    { label: 'Audit Logs',   path: '/auditor/logs',         icon: 'ti-clipboard-list'   },
    { label: 'Compliance',   path: '/auditor/compliance',   icon: 'ti-shield-check'     },
    { label: 'Reports',      path: '/auditor/reports',      icon: 'ti-chart-bar'        },
  ],
  MANAGER: [
    { label: 'Dashboard',    path: '/manager/dashboard',    icon: 'ti-layout-dashboard' },
    { label: 'My Team',      path: '/manager/team',         icon: 'ti-users-group'      },
    { label: 'Approvals',    path: '/manager/approvals',    icon: 'ti-circle-check'     },
    { label: 'Reports',      path: '/manager/reports',      icon: 'ti-chart-bar'        },
  ],
  STAFF: [
    { label: 'Dashboard',    path: '/staff/dashboard',      icon: 'ti-layout-dashboard' },
    { label: 'My Tasks',     path: '/staff/tasks',          icon: 'ti-checklist'        },
    { label: 'Attendance',   path: '/staff/attendance',     icon: 'ti-calendar-check'   },
    { label: 'Leaves',       path: '/staff/leaves',         icon: 'ti-beach'            },
  ],
  CASHIER: [
    { label: 'Dashboard',    path: '/cashier/dashboard',    icon: 'ti-layout-dashboard' },
    { label: 'Payments',     path: '/cashier/payments',     icon: 'ti-cash'             },
    { label: 'Receipts',     path: '/cashier/receipts',     icon: 'ti-receipt'          },
  ],
  SALESMAN: [
    { label: 'Dashboard',    path: '/salesman/dashboard',   icon: 'ti-layout-dashboard' },
    { label: 'Sales',        path: '/salesman/sales',       icon: 'ti-tag'              },
    { label: 'Customers',    path: '/salesman/customers',   icon: 'ti-user-check'       },
    { label: 'Targets',      path: '/salesman/targets',     icon: 'ti-target'           },
  ],
};

const ROLE_META = {
  SUPERADMIN:      { label: 'Super Admin',      color: '#7C3AED' },
  COMPANY_ADMIN:   { label: 'Company Admin',    color: '#1A7FA0' },
  HR_MANAGER:      { label: 'HR Manager',       color: '#0891B2' },
  FINANCE_MANAGER: { label: 'Finance Manager',  color: '#059669' },
  AUDITOR:         { label: 'Auditor',          color: '#D97706' },
  MANAGER:         { label: 'Manager',          color: '#2563EB' },
  STAFF:           { label: 'Staff',            color: '#5E8FA0' },
  CASHIER:         { label: 'Cashier',          color: '#16A34A' },
  SALESMAN:        { label: 'Salesman',         color: '#EA580C' },
};

const getInitials = (name = '') =>
  name.split(/[\s._-]/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || '?';

/* ── Styles ──────────────────────────────────────────────────── */
const sidebarStyles = `
  .sdb-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 252px;
    height: 100vh;

    /* matches --panel-l gradient from login left panel */
    background: linear-gradient(180deg, #C8DFE9 0%, #B8D8E8 60%, #AECFDC 100%);

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    transition: width 0.22s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    z-index: 50;

    /* right edge: subtle inner shadow + border matching --border */
    border-right: 1.5px solid #90C0D4;
    box-shadow: inset -1px 0 0 rgba(255,255,255,0.5), 4px 0 20px rgba(14,42,54,0.08);
  }
  .sdb-root.collapsed { width: 64px; }

  /* ── Brand ── */
  .sdb-brand {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 14px;
    height: 64px;
    border-bottom: 1px solid rgba(26,127,160,0.14);
    background: rgba(255,255,255,0.30);
    flex-shrink: 0;
    gap: 8px;
  }
  .sdb-brand-left {
    display: flex; align-items: center; gap: 10px;
    overflow: hidden; min-width: 0; flex: 1;
  }
  .sdb-logo {
    width: 34px; height: 34px; border-radius: 9px;
    background: #fff;
    border: 1.5px solid rgba(26,127,160,0.22);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; padding: 5px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(26,127,160,0.12);
  }
  .sdb-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .sdb-brand-text { overflow: hidden; min-width: 0; }
  .sdb-brand-name {
    font-family: 'Sora', sans-serif;
    font-size: 16.5px; font-weight: 700; color: #0E2A36;
    white-space: nowrap; line-height: 1.1;
    transition: opacity 0.18s;
  }
  .sdb-brand-name span { color: #1A7FA0; }
  .sdb-brand-tag {
    font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #5A8898;
    white-space: nowrap; margin-top: 2px;
    transition: opacity 0.18s;
  }
  .sdb-root.collapsed .sdb-brand-name,
  .sdb-root.collapsed .sdb-brand-tag { opacity: 0; }

  .sdb-toggle {
    width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
    background: rgba(255,255,255,0.50);
    border: 1px solid rgba(26,127,160,0.18);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #5E8FA0; font-size: 14px;
    transition: background 0.15s, color 0.15s;
  }
  .sdb-toggle:hover { background: rgba(26,127,160,0.12); color: #1A7FA0; border-color: #90C0D4; }

  /* ── Scroll ── */
  .sdb-scroll {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 14px 8px 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(26,127,160,0.20) transparent;
  }
  .sdb-scroll::-webkit-scrollbar { width: 3px; }
  .sdb-scroll::-webkit-scrollbar-thumb { background: rgba(26,127,160,0.20); border-radius: 3px; }

  .sdb-section-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.13em;
    text-transform: uppercase; color: #5A8898;
    padding: 0 10px 7px;
    white-space: nowrap;
    transition: opacity 0.15s;
  }
  .sdb-root.collapsed .sdb-section-label { opacity: 0; pointer-events: none; }

  /* ── Nav item ── */
  .sdb-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: 10px;
    margin-bottom: 2px;
    font-size: 13px; font-weight: 500;
    color: #2E5868;
    text-decoration: none;
    transition: background 0.13s, color 0.13s;
    white-space: nowrap; overflow: hidden;
    position: relative; cursor: pointer;
  }
  .sdb-item i {
    font-size: 18px; flex-shrink: 0;
    color: #5E8FA0;
    transition: color 0.13s;
  }
  .sdb-item-label {
    flex: 1; min-width: 0;
    overflow: hidden; text-overflow: ellipsis;
    transition: opacity 0.16s;
  }
  .sdb-root.collapsed .sdb-item-label { opacity: 0; width: 0; flex: 0; }
  .sdb-root.collapsed .sdb-item { justify-content: center; padding: 10px; }

  .sdb-item:hover {
    background: rgba(255,255,255,0.55);
    color: #0E2A36;
  }
  .sdb-item:hover i { color: #1A7FA0; }

  /* Active state — white card with blue left bar */
  .sdb-item.active {
    background: rgba(255,255,255,0.78);
    color: #1A7FA0;
    font-weight: 700;
    box-shadow: 0 1px 4px rgba(26,127,160,0.10);
  }
  .sdb-item.active i { color: #1A7FA0; }
  .sdb-item.active::before {
    content: '';
    position: absolute; left: 0; top: 22%; bottom: 22%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: #1A7FA0;
  }

  /* tooltip for collapsed mode */
  .sdb-tooltip {
    position: absolute; left: calc(100% + 14px); top: 50%;
    transform: translateY(-50%);
    background: #0E2A36; color: #E0F0F5;
    font-size: 11.5px; font-weight: 600;
    padding: 5px 11px; border-radius: 7px;
    white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 0.13s;
    z-index: 999;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
  }
  .sdb-tooltip::before {
    content: '';
    position: absolute; right: 100%; top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #0E2A36;
  }
  .sdb-root.collapsed .sdb-item:hover .sdb-tooltip { opacity: 1; }

  .sdb-sep {
    height: 1px;
    background: rgba(26,127,160,0.13);
    margin: 8px 6px 14px;
  }

  /* ── Footer user card ── */
  .sdb-footer {
    flex-shrink: 0;
    padding: 10px 8px 14px;
    border-top: 1px solid rgba(26,127,160,0.12);
    background: rgba(255,255,255,0.18);
  }
  .sdb-user-card {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; border-radius: 11px;
    background: rgba(255,255,255,0.55);
    border: 1px solid rgba(26,127,160,0.14);
    overflow: hidden; cursor: default;
    box-shadow: 0 1px 4px rgba(26,127,160,0.08);
    transition: background 0.15s;
  }
  .sdb-user-card:hover { background: rgba(255,255,255,0.72); }
  .sdb-root.collapsed .sdb-user-card { justify-content: center; padding: 8px; }

  .sdb-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #1A7FA0, #135E78);
    display: flex; align-items: center; justify-content: center;
    font-size: 11.5px; font-weight: 700; color: #fff;
    border: 2px solid rgba(255,255,255,0.6);
    box-shadow: 0 2px 6px rgba(26,127,160,0.25);
  }
  .sdb-user-info {
    flex: 1; min-width: 0; overflow: hidden;
    transition: opacity 0.16s;
  }
  .sdb-root.collapsed .sdb-user-info { opacity: 0; width: 0; flex: 0; }
  .sdb-uname {
    font-size: 12.5px; font-weight: 700; color: #0E2A36;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sdb-urole {
    font-size: 10.5px; font-weight: 500; color: #5A8898;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;
  }
  .sdb-logout-btn {
    width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
    background: rgba(220,38,38,0.08);
    border: 1px solid rgba(220,38,38,0.16);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #C53030; font-size: 15px;
    transition: background 0.15s;
  }
  .sdb-logout-btn:hover { background: rgba(220,38,38,0.16); }
  .sdb-root.collapsed .sdb-logout-btn { display: none; }
`;

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
═══════════════════════════════════════════════════════════════ */
const Sidebar = () => {
  const { role, user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const items    = menuItems[role] || [];
  const meta     = ROLE_META[role] ?? { label: role, color: '#5E8FA0' };
  const initials = getInitials(user?.username);

  return (
    <>
      <style>{sidebarStyles}</style>
      <aside className={`sdb-root${collapsed ? ' collapsed' : ''}`}>

        {/* Brand */}
        <div className="sdb-brand">
          <div className="sdb-brand-left">
            <div className="sdb-logo">
              <img src="/src/assets/logos/paytho-hero-mark.svg" alt="Paytho" />
            </div>
            <div className="sdb-brand-text">
              <div className="sdb-brand-name">Paytho<span>.</span></div>
              <div className="sdb-brand-tag">Enterprise Resource Platform</div>
            </div>
          </div>
          <button
            className="sdb-toggle" type="button"
            title={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed(v => !v)}
          >
            <i className={`ti ${collapsed ? 'ti-chevrons-right' : 'ti-chevrons-left'}`} />
          </button>
        </div>

        {/* Navigation */}
        <div className="sdb-scroll">
          <p className="sdb-section-label">Main Menu</p>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sdb-item${isActive ? ' active' : ''}`}
            >
              <i className={`ti ${item.icon}`} />
              <span className="sdb-item-label">{item.label}</span>
              {collapsed && <span className="sdb-tooltip">{item.label}</span>}
            </NavLink>
          ))}

          <div className="sdb-sep" />
          <p className="sdb-section-label">System</p>

          <NavLink to="/settings" className={({ isActive }) => `sdb-item${isActive ? ' active' : ''}`}>
            <i className="ti ti-settings" />
            <span className="sdb-item-label">Settings</span>
            {collapsed && <span className="sdb-tooltip">Settings</span>}
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `sdb-item${isActive ? ' active' : ''}`}>
            <i className="ti ti-help-circle" />
            <span className="sdb-item-label">Help & Support</span>
            {collapsed && <span className="sdb-tooltip">Help & Support</span>}
          </NavLink>
        </div>

        {/* Footer user card */}
        <div className="sdb-footer">
          <div className="sdb-user-card">
            <div className="sdb-avatar">{initials}</div>
            <div className="sdb-user-info">
              <div className="sdb-uname">{user?.username ?? 'User'}</div>
              <div className="sdb-urole">{meta.label}</div>
            </div>
            <button className="sdb-logout-btn" type="button" title="Sign out" onClick={logout}>
              <i className="ti ti-logout" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;