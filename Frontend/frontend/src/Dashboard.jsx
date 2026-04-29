import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {

    try {

      await axios.get(
        "http://127.0.0.1:8000/api/accounts/check-auth/",
        {
          withCredentials: true
        }
      );

    } catch (error) {

      navigate("/");

    }

  };

  return <h1>Dashboard</h1>;
}

export default Dashboard;