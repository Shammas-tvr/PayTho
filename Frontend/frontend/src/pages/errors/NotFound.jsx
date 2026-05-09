import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const ringTickRef = useRef(null);
  const textTickRef = useRef(null);

  useEffect(() => {
    let count = 10;
    const interval = setInterval(() => {
      count--;
      if (ringTickRef.current) ringTickRef.current.textContent = count;
      if (textTickRef.current) textTickRef.current.textContent = count;
      if (count === 0) {
        clearInterval(interval);
        navigate('/login');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={s.root}>
      {/* Background grid */}
      <div style={s.grid} />
      <div style={s.orb1} />
      <div style={s.orb2} />

      {/* Brand */}
      <div style={s.brand} onClick={() => navigate('/login')}>
        Paytho<span style={{ color: 'var(--blue)' }}>.</span>
      </div>

      {/* Card */}
      <div style={s.card}>

        {/* 404 */}
        <div style={s.numWrap}>
          <div style={s.num}>404</div>
          <div style={s.badge}>Not Found</div>
        </div>

        {/* Icon — ti already loaded by index.html */}
        <div style={s.iconWrap}>
          <i className="ti ti-map-search" style={{ fontSize: 26, color: 'var(--blue)' }} />
        </div>

        {/* Text */}
        <div style={s.title}>Page doesn't exist</div>
        <div style={s.desc}>
          The page you're looking for may have been moved, renamed,
          or doesn't exist in Paytho ERP.
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => navigate(-1)}>
            <i className="ti ti-arrow-left" /> Go Back
          </button>
          <button style={{ ...s.btn, ...s.btnSecondary }} onClick={() => navigate('/login')}>
            <i className="ti ti-home" /> Home
          </button>
        </div>

        {/* Quick links */}
        <div style={s.divider}><span>Quick Links</span></div>
        <div style={s.chips}>
          {[
            { icon: 'ti-login',            label: 'Login',     path: '/login' },
            { icon: 'ti-layout-dashboard', label: 'Dashboard', path: '/superadmin/dashboard' },
            { icon: 'ti-headset',          label: 'Support',   path: '/support' },
          ].map(({ icon, label, path }) => (
            <button key={label} style={s.chip} onClick={() => navigate(path)}>
              <i className={`ti ${icon}`} /> {label}
            </button>
          ))}
        </div>

        {/* Countdown */}
        <div style={s.countdown}>
          <div style={s.ring}>
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="14" cy="14" r="11" fill="none" stroke="var(--grey-ll)" strokeWidth="2.5" />
              <circle
                cx="14" cy="14" r="11"
                fill="none" stroke="var(--blue)" strokeWidth="2.5"
                strokeDasharray="69" strokeDashoffset="0" strokeLinecap="round"
                style={{ animation: 'nfDrain 10s linear forwards' }}
              />
            </svg>
            <span ref={ringTickRef} style={s.ringTick}>10</span>
          </div>
          Redirecting to login in&nbsp;<strong ref={textTickRef}>10</strong>&nbsp;seconds
        </div>
      </div>

      {/* Only 2 keyframes — everything else is in index.html */}
      <style>{`
        @keyframes nfDrain {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 69; }
        }
        @keyframes nfFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


const s = {
  root: {
    minHeight: '100vh',
    width: '100%',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 24,
    animation: 'nfFadeUp 0.5s ease both',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(26,127,160,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,127,160,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  orb1: {
    position: 'absolute', top: -80, right: -60,
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,127,160,0.10) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: -40, left: -40,
    width: 200, height: 200, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(45,168,152,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  brand: {
    position: 'absolute', top: 28, left: 36,
    fontFamily: "'Sora', sans-serif",
    fontSize: 20, fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
    cursor: 'pointer', zIndex: 2,
  },
  card: {
    position: 'relative', zIndex: 2,
    background: 'var(--panel-r)',
    border: '1px solid var(--border)',
    borderRadius: 22,
    padding: '48px 44px 40px',
    maxWidth: 500, width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(14,42,54,0.04), 0 20px 60px rgba(26,127,160,0.10)',
  },
  numWrap: { marginBottom: 20 },
  num: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 'clamp(80px, 18vw, 110px)',
    fontWeight: 700, lineHeight: 1,
    letterSpacing: '-6px',
    background: 'linear-gradient(135deg, var(--blue) 0%, var(--teal) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    userSelect: 'none',
  },
  badge: {
    display: 'inline-block',
    background: 'var(--err-bg)',
    border: '1px solid var(--err-b)',
    color: 'var(--err-t)',
    fontSize: 10, fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '3px 10px', borderRadius: 99,
    textTransform: 'uppercase',
  },
  iconWrap: {
    width: 60, height: 60,
    background: 'var(--blue-light)',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    border: '1px solid var(--border)',
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 21, fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 10, letterSpacing: '-0.3px',
  },
  desc: {
    fontSize: 14,
    color: 'var(--text-s)',
    lineHeight: 1.7, marginBottom: 28,
    maxWidth: 340, marginLeft: 'auto', marginRight: 'auto',
  },
  actions: {
    display: 'flex', gap: 12,
    justifyContent: 'center', flexWrap: 'wrap',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '11px 22px', borderRadius: 10,
    fontSize: 14, fontWeight: 600,
    border: 'none', cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, var(--blue), var(--blue-d))',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(26,127,160,0.28)',
  },
  btnSecondary: {
    background: 'var(--inp)',
    color: 'var(--text-m)',
    border: '1px solid var(--border)',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0 16px',
    fontSize: 11, color: 'var(--grey-l)',
    letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
  },
  chips: {
    display: 'flex', gap: 8,
    justifyContent: 'center', flexWrap: 'wrap',
  },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 8,
    fontSize: 12, fontWeight: 500,
    color: 'var(--text-m)',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
  },
  countdown: {
    marginTop: 24,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    fontSize: 12, color: 'var(--text-ph)', fontWeight: 500,
  },
  ring: {
    width: 28, height: 28,
    position: 'relative', flexShrink: 0,
  },
  ringTick: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, color: 'var(--blue)',
  },
};