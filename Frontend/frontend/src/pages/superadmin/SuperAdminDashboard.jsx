// src/pages/superadmin/SuperAdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    axiosInstance.get("dashboard/superadmin/")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div style={s.page}>

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>P</div>
          <div>
            <div style={s.logoName}>PayTho</div>
            <div style={s.logoSub}>Super Admin</div>
          </div>
        </div>

        <nav style={s.nav}>
          <div style={s.navActive}>Dashboard</div>
          <div style={s.navItem}>Companies</div>
          <div style={s.navItem}>Employees</div>
          <div style={s.navItem}>Settings</div>
        </nav>

        <button onClick={handleLogout} style={s.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={s.main}>

        {/* Top bar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Dashboard</div>
            <div style={s.pageSub}>Welcome back, {username || "Admin"}</div>
          </div>
          <div style={s.userPill}>{username || "superadmin"}</div>
        </div>

        {/* Content */}
        <div style={s.content}>

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statLabel}>Total companies</div>
              <div style={s.statValue}>{data?.total_companies ?? "—"}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Total employees</div>
              <div style={s.statValue}>{data?.total_employees ?? "—"}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Active users</div>
              <div style={s.statValue}>{data?.active_users ?? "—"}</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Revenue</div>
              <div style={s.statValue}>{data?.total_revenue ?? "—"}</div>
            </div>
          </div>

          {/* Companies table */}
          <div style={s.card}>
            <div style={s.cardTitle}>Companies</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Company</th>
                  <th style={s.th}>Employees</th>
                  <th style={s.th}>Joined</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.companies || []).map((c) => (
                  <tr key={c.id}>
                    <td style={s.td}>{c.name}</td>
                    <td style={s.td}>{c.employee_count}</td>
                    <td style={s.td}>{c.joined}</td>
                    <td style={s.td}>
                      <span style={c.is_active ? s.badgeGreen : s.badgeOrange}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

// ✅ All styles in one place
const s = {
  page:       { display:"flex", minHeight:"100vh", background:"#f5f5f3", fontFamily:"Arial, sans-serif" },
  sidebar:    { width:"200px", background:"#fff", borderRight:"1px solid #eee", display:"flex", flexDirection:"column", padding:"0" },
  logo:       { display:"flex", alignItems:"center", gap:"10px", padding:"20px 16px", borderBottom:"1px solid #eee" },
  logoIcon:   { width:"32px", height:"32px", background:"#042C53", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"700", fontSize:"16px" },
  logoName:   { fontSize:"15px", fontWeight:"700", color:"#111" },
  logoSub:    { fontSize:"11px", color:"#aaa" },
  nav:        { flex:1, padding:"12px 0" },
  navActive:  { padding:"9px 16px", fontSize:"13px", background:"#E6F1FB", color:"#185FA5", fontWeight:"600", cursor:"pointer" },
  navItem:    { padding:"9px 16px", fontSize:"13px", color:"#555", cursor:"pointer" },
  logoutBtn:  { margin:"12px 16px", padding:"8px", background:"none", border:"1px solid #eee", borderRadius:"8px", fontSize:"13px", color:"#b91c1c", cursor:"pointer" },
  main:       { flex:1, display:"flex", flexDirection:"column" },
  topbar:     { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", background:"#fff", borderBottom:"1px solid #eee" },
  pageTitle:  { fontSize:"16px", fontWeight:"700", color:"#111" },
  pageSub:    { fontSize:"12px", color:"#888", marginTop:"2px" },
  userPill:   { padding:"6px 14px", background:"#f5f5f3", border:"1px solid #eee", borderRadius:"20px", fontSize:"13px", color:"#555" },
  content:    { padding:"20px" },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"16px" },
  statCard:   { background:"#fff", border:"1px solid #eee", borderRadius:"10px", padding:"16px" },
  statLabel:  { fontSize:"12px", color:"#888", marginBottom:"6px" },
  statValue:  { fontSize:"24px", fontWeight:"700", color:"#111" },
  card:       { background:"#fff", border:"1px solid #eee", borderRadius:"10px", padding:"16px" },
  cardTitle:  { fontSize:"14px", fontWeight:"700", color:"#111", marginBottom:"14px" },
  table:      { width:"100%", borderCollapse:"collapse", fontSize:"13px" },
  th:         { textAlign:"left", color:"#888", fontWeight:"500", paddingBottom:"10px", borderBottom:"1px solid #eee" },
  td:         { padding:"10px 0", color:"#111", borderBottom:"1px solid #f5f5f3" },
  badgeGreen: { background:"#f0fdf4", color:"#166534", fontSize:"11px", padding:"2px 8px", borderRadius:"6px" },
  badgeOrange:{ background:"#fffbeb", color:"#92400e", fontSize:"11px", padding:"2px 8px", borderRadius:"6px" },
};

export default SuperAdminDashboard;