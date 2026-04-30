import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    const token = localStorage.getItem("token");

    // 🔴 If no token → go login
    if (!token) {
      navigate("/");
      return;
    }

    try {

      const res = await axios.get(
          "http://127.0.0.1:8000/api/dashboard/superadmin/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);

    } catch (err) {

      console.log(err);

      // 🔴 Token invalid → logout
      localStorage.removeItem("token");
      navigate("/");

    }

  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dashboard</h1>

      {data ? (
        <>
          <p>{data.message}</p>
          <p>User: {data.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}

export default Dashboard;