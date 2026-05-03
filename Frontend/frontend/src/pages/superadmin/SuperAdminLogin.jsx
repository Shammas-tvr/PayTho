// src/pages/superadmin/SuperAdminLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.username || !form.password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/superadmin-login/",
        { username: form.username, password: form.password }
      );

      // ✅ Save token — use "token" everywhere
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", res.data.username);

      navigate("/dashboard");

    } catch (err) {
      if (err.response) {
        setErrorMsg(err.response.data.error || "Invalid credentials");
      } else if (err.request) {
        setErrorMsg("Server not responding. Is Django running?");
      } else {
        setErrorMsg("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🛡️</div>
          <div>
            <div style={styles.brandName}>PayTho ERP</div>
            <div style={styles.brandSub}>Admin Portal</div>
          </div>
        </div>

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.tagline}>Sign in to your super admin account</p>

        {/* Error */}
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <hr style={styles.divider} />
        <p style={styles.footer}>
          Super Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f3",
    padding: "2rem 1rem",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "400px",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" },
  brandIcon: { fontSize: "28px" },
  brandName: { fontSize: "16px", fontWeight: "600", color: "#111" },
  brandSub: { fontSize: "12px", color: "#888" },
  title: { fontSize: "20px", fontWeight: "600", color: "#111", marginBottom: "4px" },
  tagline: { fontSize: "13px", color: "#888", marginBottom: "1.75rem" },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    marginBottom: "1rem",
  },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "13px", color: "#555", marginBottom: "6px" },
  input: {
    width: "100%",
    padding: "0 12px",
    height: "38px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111",
  },
  button: {
    width: "100%",
    height: "40px",
    background: "#042C53",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  divider: { border: "none", borderTop: "1px solid #eee", margin: "1.5rem 0 1rem" },
  footer: { fontSize: "12px", color: "#aaa", textAlign: "center" },
};

export default SuperAdminLogin;