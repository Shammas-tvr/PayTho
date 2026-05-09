import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { saveAuth } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

const REDIRECT = {
  SUPERADMIN:      '/superadmin/dashboard',
  COMPANY_ADMIN:   '/admin/dashboard',
  HR_MANAGER:      '/hr/dashboard',
  FINANCE_MANAGER: '/finance/dashboard',
  AUDITOR:         '/auditor/dashboard',
  MANAGER:         '/manager/dashboard',
  STAFF:           '/staff/dashboard',
  CASHIER:         '/cashier/dashboard',
  SALESMAN:        '/salesman/dashboard',
};

const ROLES = [
  { key: 'superadmin', label: 'Super Admin',   icon: 'ti-crown'       },
  { key: 'admin',      label: 'Company Admin', icon: 'ti-user-shield' },
  { key: 'staff',      label: 'Staff',         icon: 'ti-id-badge'    },
  { key: 'branch',     label: 'Branch User',   icon: 'ti-building'    },
];

const FIELDS = {
  superadmin: [{ name: 'email',        label: 'Work email address', type: 'email', icon: 'ti-mail'    }],
  admin:      [{ name: 'email',        label: 'Work email address', type: 'email', icon: 'ti-mail'    }],
  staff: [
    { name: 'company_code', label: 'Company code', type: 'text', icon: 'ti-building' },
    { name: 'username',     label: 'Username',     type: 'text', icon: 'ti-user'     },
  ],
  branch: [
    { name: 'company_code', label: 'Company code', type: 'text', icon: 'ti-building' },
    { name: 'branch_code',  label: 'Branch code',  type: 'text', icon: 'ti-map-pin'  },
    { name: 'username',     label: 'Username',     type: 'text', icon: 'ti-user'     },
  ],
};

const FEATURES = [
  { icon: 'ti-users',          text: 'Multi-role access control'     },
  { icon: 'ti-building-store', text: 'Branch & company management'   },
  { icon: 'ti-chart-bar',      text: 'Real-time analytics & reports' },
  { icon: 'ti-shield-check',   text: 'Enterprise-grade security'     },
];

const loginStyles = `
  .login-page {
    min-height: 100vh; display: flex;
    align-items: center; justify-content: center;
    background: var(--bg); padding: 1.5rem 1rem;
  }

  /* card */
  .login-card {
    width: 100%; max-width: 800px;
    display: grid; grid-template-columns: 1fr 1.4fr;
    border-radius: 26px; overflow: hidden;
    border: 1.5px solid var(--border);
    box-shadow: 0 20px 60px rgba(14,42,54,0.12);
  }
  @media (max-width: 640px) {
    .login-card { grid-template-columns: 1fr; }
    .login-left { display: none; }
  }

  /* ── left panel ── */
  .login-left {
    background: var(--panel-l); padding: 2.5rem 2rem;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .deco { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.18); }
  .deco-1 { width:220px; height:220px; top:-80px;    right:-80px; }
  .deco-2 { width:140px; height:140px; bottom:20px;  left:-55px;  }
  .deco-3 { width:75px;  height:75px;  bottom:130px; right:10px;  }

  .brand { position: relative; z-index: 1; }
  .brand-logo {
    width: clamp(40px, 5vw, 60px);
    height: clamp(40px, 5vw, 60px);
    border-radius: clamp(10px, 1.2vw, 16px);
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: clamp(0.6rem, 1vw, 1rem);
    border: 1.5px solid rgba(26,127,160,0.22);
    overflow: hidden;
    padding: clamp(4px, 0.6vw, 8px);
  }
  .brand-logo img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }
  .brand-name    { font-family:'Sora',sans-serif; font-size:25px; font-weight:700; color:var(--text); line-height:1.1; }
  .brand-name span { color:var(--blue); }
  .brand-tag     { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-m); font-weight:600; margin-top:5px; }

  .left-mid     { position:relative; z-index:1; margin-top:2rem; }
  .left-heading { font-size:14.5px; font-weight:600; color:var(--text); margin-bottom:1rem; line-height:1.5; }
  .feature {
    display:flex; align-items:center; gap:10px;
    padding:10px 13px; background:rgba(255,255,255,0.55);
    border-radius:11px; border:1px solid rgba(255,255,255,0.8); margin-bottom:8px;
  }
  .feature i    { font-size:16px; color:var(--blue); }
  .feature span { font-size:12.5px; color:var(--text-m); font-weight:500; }

  .left-footer {
    position:relative; z-index:1; margin-top:1.5rem;
    font-size:11px; color:var(--text-s);
    display:flex; align-items:center; gap:6px;
  }
  .left-footer i { font-size:14px; }

  /* ── right panel ── */
  .login-right {
    background: var(--panel-r); padding: 2.5rem 2.25rem 2rem;
    display: flex; flex-direction: column; justify-content: center;
  }

  .secure-badge {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(45,168,152,0.13); border:1px solid rgba(45,168,152,0.32);
    border-radius:20px; padding:3px 12px;
    font-size:11px; font-weight:700; color:#0A5A52;
    margin-bottom:1rem; width:fit-content;
  }
  .secure-badge i { font-size:13px; }

  .login-heading { font-size:21px; font-weight:700; color:var(--text); margin-bottom:3px; }
  .login-sub     { font-size:12.5px; color:var(--text-m); margin-bottom:1.4rem; }

  /* role cards */
  .role-label {
    font-size:11px; font-weight:700; color:var(--text-s);
    text-transform:uppercase; letter-spacing:0.07em; margin-bottom:8px;
  }
  .role-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:1.4rem; }
  .role-btn {
    display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:10px 6px; background:var(--grey-ll);
    border:1.5px solid var(--border); border-radius:13px;
    cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.17s;
  }
  .role-btn i    { font-size:20px; color:var(--grey); transition:color 0.17s; }
  .role-btn span { font-size:10.5px; font-weight:600; color:var(--text-s); text-align:center; line-height:1.2; transition:color 0.17s; }
  .role-btn:hover       { background:#C8E3EE; border-color:#7AAEC4; }
  .role-btn.active      { background:var(--blue-light); border:1.5px solid var(--blue); }
  .role-btn.active i    { color:var(--blue); }
  .role-btn.active span { color:var(--blue-d); }

  /* floating label fields */
  .field-group { margin-bottom:0.88rem; }
  .field-wrap  { position:relative; }
  .field-icon  {
    position:absolute; left:13px; top:50%; transform:translateY(-50%);
    font-size:18px; color:var(--grey-l); pointer-events:none; transition:color 0.18s; z-index:1;
  }
  .field-wrap:focus-within .field-icon { color:var(--blue); }
  .field-input {
    width:100%; height:52px; padding:18px 14px 6px 44px;
    font-size:13.5px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:500;
    background:var(--inp); border:1.5px solid var(--border);
    border-radius:12px; color:var(--text); outline:none;
    transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .field-input:focus {
    border-color:var(--border-f);
    box-shadow:0 0 0 3px rgba(26,127,160,0.14);
    background:var(--inp-focus);
  }
  .field-input:focus ~ .field-label,
  .field-input:not(:placeholder-shown) ~ .field-label {
    top:8px; font-size:10px; color:var(--blue); font-weight:700; letter-spacing:0.06em;
  }
  .field-label {
    position:absolute; left:44px; top:50%; transform:translateY(-50%);
    font-size:13px; font-weight:500; color:var(--text-ph); pointer-events:none;
    transition:top 0.15s, font-size 0.15s, color 0.15s;
  }
  .pw-toggle {
    position:absolute; right:13px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer;
    color:var(--text-s); font-size:16px; padding:0; line-height:1;
  }

  /* error */
  .error-box {
    display:flex; align-items:center; gap:8px;
    background:var(--err-bg); border:1px solid var(--err-b);
    border-radius:10px; padding:9px 13px;
    font-size:12.5px; color:var(--err-t); margin-bottom:0.85rem;
  }

  /* submit button */
  .submit-btn {
    width:100%; height:52px; background:var(--blue); color:#fff;
    border:2px solid var(--blue-d); border-radius:13px;
    font-size:14.5px; font-weight:700;
    font-family:'Plus Jakarta Sans',sans-serif;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px;
    transition:background 0.15s, transform 0.1s;
    margin-top:1rem; letter-spacing:0.03em;
  }
  .submit-btn i       { font-size:19px; }
  .submit-btn:hover   { background:var(--blue-d); }
  .submit-btn:active  { transform:scale(0.99); }
  .submit-btn:disabled{ background:#7AAEC4; border-color:#5A96B0; cursor:not-allowed; }

  /* divider & footer */
  .divider      { display:flex; align-items:center; gap:8px; margin:1rem 0 0; }
  .divider hr   { flex:1; border:none; border-top:1px solid var(--grey-ll); }
  .divider span { font-size:11px; color:var(--text-ph); white-space:nowrap; }
  .footer-note   { text-align:center; font-size:11.5px; color:var(--text-s); margin-top:0.85rem; }
  .footer-note a { color:var(--blue); text-decoration:none; font-weight:700; }
`;

/* ═══════════════════════════════════════════════════════════════
   LOGIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const { setRole, setUser } = useAuth();

  const [loginType, setLoginType] = useState('superadmin');
  const [form, setForm]           = useState({ email: '', company_code: '', branch_code: '', username: '', password: '' });
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleRoleSwitch = (role) => {
    setLoginType(role);
    setError('');
    setForm({ email: '', company_code: '', branch_code: '', username: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { login_type: loginType, password: form.password };
    if (loginType === 'superadmin' || loginType === 'admin') {
      payload.email = form.email;
    } else {
      payload.company_code = form.company_code;
      payload.username     = form.username;
      if (loginType === 'branch') payload.branch_code = form.branch_code;
    }

    try {
      const { data } = await api.post('/auth/login/', payload);
      saveAuth(data);
      setRole(data.role);
      setUser({ username: data.username, company_id: data.company_id, branch_id: data.branch_id });
      navigate(REDIRECT[data.role] || '/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>

      <div className="login-page">
        <div className="login-card">

          {/* ── Left panel ── */}
          <div className="login-left">
            <div className="deco deco-1" /><div className="deco deco-2" /><div className="deco deco-3" />

            <div className="brand">
              {/* Logo image replaces the icon */}
              <div className="brand-logo">
                <img src="/src/assets/logos/paytho-hero-mark.svg" alt="Paytho logo" />
              </div>
              <div className="brand-name">Paytho<span>.</span></div>
              <div className="brand-tag">Enterprise Resource Platform</div>
            </div>

            <div className="left-mid">
              <p className="left-heading">Everything your business<br />needs, unified.</p>
              {FEATURES.map(({ icon, text }) => (
                <div className="feature" key={icon}>
                  <i className={`ti ${icon}`} /><span>{text}</span>
                </div>
              ))}
            </div>

            <div className="left-footer">
              <i className="ti ti-lock" /><span>256-bit SSL · SOC 2 compliant</span>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="login-right">
            <div className="secure-badge"><i className="ti ti-circle-check" /> Verified secure login</div>
            <p className="login-heading">Welcome back</p>
            <p className="login-sub">Select your role and enter credentials</p>

            {/* Role cards */}
            <p className="role-label">Sign in as</p>
            <div className="role-grid">
              {ROLES.map(({ key, label, icon }) => (
                <button
                  key={key} type="button"
                  className={`role-btn${loginType === key ? ' active' : ''}`}
                  onClick={() => handleRoleSwitch(key)}
                >
                  <i className={`ti ${icon}`} /><span>{label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Dynamic fields per role */}
              {FIELDS[loginType].map((f) => (
                <div className="field-group" key={f.name}>
                  <div className="field-wrap">
                    <i className={`ti ${f.icon} field-icon`} />
                    <input
                      id={`f_${f.name}`} name={f.name} type={f.type}
                      className="field-input" placeholder=" "
                      value={form[f.name]} onChange={handleChange}
                      autoComplete="off" required
                    />
                    <label className="field-label" htmlFor={`f_${f.name}`}>{f.label}</label>
                  </div>
                </div>
              ))}

              <div className="field-group">
                <div className="field-wrap">
                  <i className="ti ti-lock field-icon" />
                  <input
                    id="f_pw" name="password"
                    type={showPw ? 'text' : 'password'}
                    className="field-input" placeholder=" "
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    style={{ paddingRight: '44px' }}
                    required
                  />
                  <label className="field-label" htmlFor="f_pw">Password</label>
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    <i className={`ti ${showPw ? 'ti-eye-off' : 'ti-eye'}`} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <i className="ti ti-alert-circle" /><span>{error}</span>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                <i className={`ti ${loading ? 'ti-loader-2 spin' : 'ti-login'}`} />
                {loading ? 'Verifying…' : 'Sign in to Paytho'}
              </button>
            </form>

            <div className="divider"><hr /><span>end-to-end encrypted</span><hr /></div>
            <p className="footer-note">Need help? <a href="#">Contact support</a></p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;