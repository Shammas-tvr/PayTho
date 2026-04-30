import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.username || !form.password) {
      setErrorMsg("Enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/superadmin-login/",
        {
          username: form.username,
          password: form.password
        }
      );

      console.log("LOGIN RESPONSE:", res.data); // 🔥 debug

      const accessToken = res.data.access;

      if (!accessToken) {
        setErrorMsg("No token received from server");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", accessToken);

      // (optional) store user
      localStorage.setItem("username", res.data.username);

      // ✅ Navigate after storing
      navigate("/dashboard");

    } catch (err) {

      console.log("LOGIN ERROR:", err);

      if (err.response) {
        setErrorMsg(err.response.data.error || "Invalid credentials");
      } else if (err.request) {
        setErrorMsg("Server not responding");
      } else {
        setErrorMsg("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>PayTho Admin</h1>
        <p style={styles.subtitle}>Super Admin Login</p>

        {errorMsg && (
          <div style={styles.errorBox}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default SuperAdminLogin;