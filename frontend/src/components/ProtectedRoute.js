import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header
          },
        });
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <h1>Loading...</h1>; // Show a loader while checking auth
  }

  return authenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
