import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import { API } from "../config/api";
import { clearToken, getAuthHeaders, getToken, isAuthError } from "../utils/auth";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`${API.core}/api/user/me`, {
          headers: getAuthHeaders(),
        }); // Fetch user data
        setUser(response.data);
      } catch (error) {
        if (isAuthError(error)) {
          clearToken();
        }
        navigate("/login"); // Redirect to login if unauthenticated
      }
    };
    fetchUser();
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="home-container">
      {user ? (
        <>
          <h1>{`${getGreeting()}, ${user.nickname || user.firstName}!`}</h1>
          <p>Welcome back to your AiCademy Dashboard.</p>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default HomePage;
