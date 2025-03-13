import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          "https://aicademy-core-backend.onrender.com/api/user/me",
          {
            withCredentials: true,
          }
        );
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
