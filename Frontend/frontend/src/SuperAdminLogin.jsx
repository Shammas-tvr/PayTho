import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Please enter username and password");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/superadmin-login/",
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );

      if (res.status === 200) {
        navigate("/dashboard");
      }

    } catch (error) {

      if (error.response) {
        setErrorMsg(error.response.data.error);
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
        <p style={styles.subTitle}>Super Admin Login</p>

        {errorMsg && (
          <div style={styles.errorBox}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );

}

const styles = {

  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    fontFamily: "Arial"
  },

  card: {
    width: "380px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  title: {
    margin: 0,
    textAlign: "center",
    color: "#111827"
  },

  subTitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px"
  }

};

export default SuperAdminLogin;