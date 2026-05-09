// src/components/shared/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ROLE_META = {
  SUPERADMIN:      { label: 'Super Admin',      icon: 'ti-crown',        color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.22)' },
  COMPANY_ADMIN:   { label: 'Company Admin',    icon: 'ti-user-shield',  color: '#1A7FA0', bg: 'rgba(26,127,160,0.10)',  border: 'rgba(26,127,160,0.28)' },
  HR_MANAGER:      { label: 'HR Manager',       icon: 'ti-users',        color: '#0891B2', bg: 'rgba(8,145,178,0.09)',   border: 'rgba(8,145,178,0.25)'  },
  FINANCE_MANAGER: { label: 'Finance Manager',  icon: 'ti-report-money', color: '#059669', bg: 'rgba(5,150,105,0.08)',   border: 'rgba(5,150,105,0.22)'  },
  AUDITOR:         { label: 'Auditor',          icon: 'ti-shield-check', color: '#B45309', bg: 'rgba(180,83,9,0.08)',    border: 'rgba(180,83,9,0.22)'   },
  MANAGER:         { label: 'Manager',          icon: 'ti-briefcase',    color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.22)'  },
  STAFF:           { label: 'Staff',            icon: 'ti-id-badge',     color: '#5E8FA0', bg: 'rgba(94,143,160,0.10)',  border: 'rgba(94,143,160,0.28)' },
  CASHIER:         { label: 'Cashier',          icon: 'ti-cash',         color: '#16A34A', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.22)'  },
  SALESMAN:        { label: 'Salesman',         icon: 'ti-tag',          color: '#C2410C', bg: 'rgba(194,65,12,0.08)',   border: 'rgba(194,65,12,0.22)'  },
};

const getInitials = (name = '') =>
  name.split(/[\s._-]/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || '?';

const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');

  .hdr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: sticky; top: 0; z-index: 40;
    width: 100%;
    height: 64px;
    background: rgba(240,248,251,0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1.5px solid #90C0D4;
    box-shadow: 0 2px 12px rgba(14,42,54,0.06);
    display: flex; align-items: center;
  }

  .hdr-inner {
    width: 100%;
    display: flex; align-items: center;
    padding: 0 clamp(16px, 2.5vw, 28px);
    gap: 10px;
  }

  /* ── Page context (left) ── */
  .hdr-context { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
  .hdr-page-title {
    font-size: 15px; font-weight: 700;
    color: #0E2A36;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    line-height: 1.2;
  }
  .hdr-breadcrumb {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #8AAEBB; margin-top: 1px;
    font-weight: 500;
  }
  .hdr-breadcrumb i { font-size: 10px; }

  /* ── Search bar ── */
  .hdr-search {
    position: relative; flex-shrink: 0;
    width: clamp(160px, 22vw, 280px);
  }
  .hdr-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    font-size: 16px; color: #8AAEBB; pointer-events: none;
  }
  .hdr-search-input {
    width: 100%; height: 36px;
    padding: 0 12px 0 36px;
    background: #D6EBF2;
    border: 1.5px solid #90C0D4;
    border-radius: 9px;
    font-size: 12.5px; font-weight: 500; color: #0E2A36;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .hdr-search-input::placeholder { color: #8AAEBB; }
  .hdr-search-input:focus {
    background: #fff;
    border-color: #1A7FA0;
    box-shadow: 0 0 0 3px rgba(26,127,160,0.14);
  }
  .hdr-search-kbd {
    position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
    font-size: 9.5px; font-weight: 700; color: #8AAEBB;
    background: #CCE3EC; border-radius: 4px; padding: 1px 5px;
    letter-spacing: 0.03em;
  }
  @media (max-width: 640px) { .hdr-search { display: none; } }

  /* ── Right cluster ── */
  .hdr-right {
    display: flex; align-items: center;
    gap: clamp(4px, 0.8vw, 10px);
    flex-shrink: 0;
  }

  /* icon button */
  .hdr-icon-btn {
    width: 36px; height: 36px; border-radius: 9px;
    background: #D6EBF2; border: 1.5px solid #90C0D4;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #5E8FA0; font-size: 17px;
    transition: background 0.14s, color 0.14s, border-color 0.14s;
    position: relative; flex-shrink: 0;
  }
  .hdr-icon-btn:hover { background: #C8DFE9; color: #1A7FA0; border-color: #1A7FA0; }

  .hdr-notif-dot {
    position: absolute; top: 8px; right: 8px;
    width: 6.5px; height: 6.5px; border-radius: 50%;
    background: #EF4444; border: 1.5px solid #F0F8FB;
  }

  /* vertical divider */
  .hdr-vdivider {
    width: 1px; height: 22px;
    background: #90C0D4; flex-shrink: 0;
    margin: 0 2px;
  }

  /* role badge */
  .hdr-role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px 4px 8px;
    border-radius: 999px; border: 1.5px solid;
    font-size: 11.5px; font-weight: 700;
    white-space: nowrap; flex-shrink: 0;
  }
  .hdr-role-badge i { font-size: 13px; }
  @media (max-width: 768px) { .hdr-role-badge { display: none; } }

  /* ── Avatar/profile button ── */
  .hdr-profile-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px 4px 5px;
    border-radius: 999px;
    background: #D6EBF2; border: 1.5px solid #90C0D4;
    cursor: pointer; flex-shrink: 0;
    transition: background 0.14s, border-color 0.14s;
    position: relative;
  }
  .hdr-profile-btn:hover { background: #C8DFE9; border-color: #1A7FA0; }

  .hdr-avatar {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #1A7FA0, #135E78);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.5);
  }
  .hdr-profile-name {
    font-size: 12.5px; font-weight: 600; color: #0E2A36;
    max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .hdr-profile-chevron {
    font-size: 13px; color: #5E8FA0;
    transition: transform 0.18s;
  }
  .hdr-profile-chevron.open { transform: rotate(180deg); }
  @media (max-width: 480px) {
    .hdr-profile-name { display: none; }
    .hdr-profile-btn  { padding: 5px; }
  }

  /* ── Dropdown ── */
  .hdr-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    min-width: 220px;
    background: #F0F8FB;
    border: 1.5px solid #90C0D4;
    border-radius: 14px;
    box-shadow: 0 16px 48px rgba(14,42,54,0.12), 0 2px 8px rgba(14,42,54,0.06);
    padding: 6px;
    z-index: 200;
    animation: hdrFadeIn 0.17s cubic-bezier(0.22,1,0.36,1);
    transform-origin: top right;
  }
  @keyframes hdrFadeIn {
    from { opacity: 0; transform: scale(0.94) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .hdr-drop-profile {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px 12px;
    border-bottom: 1px solid #CCE3EC;
    margin-bottom: 4px;
  }
  .hdr-drop-avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #1A7FA0, #135E78);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    border: 2px solid rgba(255,255,255,0.6);
    box-shadow: 0 2px 8px rgba(26,127,160,0.25);
  }
  .hdr-drop-name { font-size: 13.5px; font-weight: 700; color: #0E2A36; }
  .hdr-drop-role { font-size: 11px; color: #5A8898; margin-top: 2px; font-weight: 500; }

  .hdr-drop-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: #2E5868;
    cursor: pointer; transition: background 0.12s;
    background: none; border: none; width: 100%; text-align: left;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .hdr-drop-item i { font-size: 16px; color: #8AAEBB; }
  .hdr-drop-item:hover { background: rgba(26,127,160,0.08); color: #0E2A36; }
  .hdr-drop-item:hover i { color: #1A7FA0; }

  .hdr-drop-sep { height: 1px; background: #CCE3EC; margin: 4px 0; }

  .hdr-drop-item.danger { color: #922010; }
  .hdr-drop-item.danger i { color: #C53030; }
  .hdr-drop-item.danger:hover { background: #FEF0EE; }

  /* status dot */
  .hdr-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22C55E; margin-left: auto; flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
  }
`;

/* ═══════════════════════════════════════════════════════════════
   HEADER COMPONENT
═══════════════════════════════════════════════════════════════ */
const Header = ({ pageTitle = 'Dashboard', breadcrumb = [] }) => {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const meta     = ROLE_META[role] ?? { label: role, icon: 'ti-user', color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)' };
  const initials = getInitials(user?.username);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{headerStyles}</style>

      <header className="hdr-root">
        <div className="hdr-inner">

          {/* Page context */}
          <div className="hdr-context">
            <span className="hdr-page-title">{pageTitle}</span>
            {breadcrumb.length > 0 && (
              <div className="hdr-breadcrumb">
                <span>Home</span>
                {breadcrumb.map((crumb, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-chevron-right" />
                    <span>{crumb}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hdr-search">
            <i className="ti ti-search hdr-search-icon" />
            <input
              className="hdr-search-input"
              type="text"
              placeholder="Search anything…"
            />
            <span className="hdr-search-kbd">⌘K</span>
          </div>

          {/* Right cluster */}
          <div className="hdr-right">

            {/* Role badge */}
            <span
              className="hdr-role-badge"
              style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
            >
              <i className={`ti ${meta.icon}`} />
              {meta.label}
            </span>

            <div className="hdr-vdivider" />

            {/* Notifications */}
            <button className="hdr-icon-btn" type="button" title="Notifications">
              <i className="ti ti-bell" />
              <span className="hdr-notif-dot" />
            </button>

            {/* Help */}
            <button className="hdr-icon-btn" type="button" title="Help">
              <i className="ti ti-help-circle" />
            </button>

            <div className="hdr-vdivider" />

            {/* Profile dropdown */}
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                className="hdr-profile-btn"
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
              >
                <div className="hdr-avatar">{initials}</div>
                <span className="hdr-profile-name">{user?.username ?? 'User'}</span>
                <i className={`ti ti-chevron-down hdr-profile-chevron${open ? ' open' : ''}`} />
              </button>

              {open && (
                <div className="hdr-dropdown">
                  <div className="hdr-drop-profile">
                    <div className="hdr-drop-avatar">{initials}</div>
                    <div>
                      <div className="hdr-drop-name">{user?.username ?? 'User'}</div>
                      <div className="hdr-drop-role">{meta.label}</div>
                    </div>
                  </div>

                  <button className="hdr-drop-item" type="button">
                    <i className="ti ti-user-circle" /> My Profile
                    <span className="hdr-status-dot" />
                  </button>
                  <button className="hdr-drop-item" type="button">
                    <i className="ti ti-settings" /> Account Settings
                  </button>
                  <button className="hdr-drop-item" type="button">
                    <i className="ti ti-bell" /> Notifications
                  </button>
                  <button className="hdr-drop-item" type="button">
                    <i className="ti ti-help-circle" /> Help & Support
                  </button>

                  <div className="hdr-drop-sep" />

                  <button
                    className="hdr-drop-item danger"
                    type="button"
                    onClick={() => { setOpen(false); logout(); }}
                  >
                    <i className="ti ti-logout" /> Sign out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;