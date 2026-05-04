// src/pages/superadmin/SuperAdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company_code: "",
    admin_username: "",
    admin_password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.company_code || !form.admin_username || !form.admin_password || !form.email) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("company/create/", form);
      setSuccess(res.data.message || "Company created successfully!");
      setForm({ name: "", company_code: "", admin_username: "", admin_password: "", email: "" });
      setTimeout(() => { setShowModal(false); setSuccess(""); }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
    setSuccess("");
    setForm({ name: "", company_code: "", admin_username: "", admin_password: "", email: "" });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f4f4f4" }}>

      {/* Navbar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>Super Admin</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowModal(true)} style={btn.primary}>
            + Create Company
          </button>
          <button onClick={handleLogout} style={btn.danger}>
            Logout
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "24px" }}>
        <p style={{ color: "#888", fontSize: "14px" }}>Welcome to the dashboard.</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99 }}>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", width: "400px", maxHeight: "90vh", overflowY: "auto" }}>

            <h3 style={{ margin: "0 0 20px", fontSize: "16px" }}>Create Company</h3>

            {/* Company Info */}
            <p style={sectionLabel}>Company Info</p>

            <label style={lbl}>Company Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Acme Corp"
              style={input}
            />

            <label style={lbl}>Company Code *</label>
            <input
              name="company_code"
              value={form.company_code}
              onChange={handleChange}
              placeholder="ACME-001"
              style={input}
            />

            <label style={lbl}>Company Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@acme.com"
              style={input}
            />

            {/* Admin User */}
            <p style={{ ...sectionLabel, marginTop: "16px" }}>Admin User</p>

            <label style={lbl}>Admin Username *</label>
            <input
              name="admin_username"
              value={form.admin_username}
              onChange={handleChange}
              placeholder="acme_admin"
              style={input}
            />

            <label style={lbl}>Admin Password *</label>
            <input
              name="admin_password"
              type="password"
              value={form.admin_password}
              onChange={handleChange}
              placeholder="••••••••"
              style={input}
            />

            {error   && <p style={{ color: "#e02424", fontSize: "12px", margin: "8px 0 0" }}>{error}</p>}
            {success && <p style={{ color: "#057a55", fontSize: "12px", margin: "8px 0 0" }}>{success}</p>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }}>
              <button onClick={closeModal} style={btn.cancel}>Cancel</button>
              <button onClick={handleCreate} disabled={loading} style={btn.primary}>
                {loading ? "Creating…" : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Reusable styles
const lbl = { display: "block", fontSize: "12px", color: "#555", marginBottom: "4px", marginTop: "10px" };
const input = { display: "block", width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", outline: "none" };
const sectionLabel = { fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" };

const btn = {
  primary: { padding: "8px 16px", background: "#1a56db", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  danger:  { padding: "8px 16px", background: "#fff", color: "#e02424", border: "1px solid #e02424", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  cancel:  { padding: "8px 16px", background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
};

export default SuperAdminDashboard;