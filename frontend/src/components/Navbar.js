import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config/api";
import "../styles/Navbar.css";
import { clearToken, getAuthHeaders, getToken, isAuthError } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`${API.core}/api/user/me`, {
          headers: getAuthHeaders(),
        });
        setUserProfilePic(response.data.profilePicture || null);
      } catch (error) {
        if (isAuthError(error)) {
          clearToken();
          navigate("/login");
          return;
        }
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      clearToken();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo and Profile Picture */}
        <div className="navbar-brand">
          {userProfilePic && (
            <img
              src={`${API.user}/${userProfilePic}`}
              alt="Profile"
              className="navbar-profile-pic"
            />
          )}
          <Link to="/">AiCademy</Link>
        </div>

        {/* Links and Logout */}
        <div className="navbar-right">
          <div className="navbar-links">
            <Link to="/study-buddy">Study Buddy</Link>
            <Link to="/career-advisor">Career Advisor</Link>
            <Link to="/update-profile">Update Profile</Link>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
