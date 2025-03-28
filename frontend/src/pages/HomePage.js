import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header
          },
        }); // Fetch user data
        setUser(response.data);
      } catch (error) {
        console.log(error);
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
          <p>Welcome back to your Academic Assistant Dashboard.</p>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default HomePage;
