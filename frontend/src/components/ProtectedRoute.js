import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../config/api";
import { clearToken, getAuthHeaders, getToken, isAuthError } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setAuthenticated(false);
          return;
        }

        await axios.get(`${API.core}/api/user/me`, {
          headers: getAuthHeaders(),
        });
        setAuthenticated(true);
      } catch (error) {
        // Clear stale/invalid tokens so app does not repeatedly send bad auth headers.
        if (isAuthError(error)) {
          clearToken();
        }
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
