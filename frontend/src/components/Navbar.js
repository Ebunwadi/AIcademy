import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log("token from navbar: ", token);
        
        const response = await axios.get(
          "https://aicademy-core-backend.onrender.com/api/user/me", {
            headers: {
              'Authorization': `Bearer ${token}`  // Send the token in the header
          }
          }
        )
        setUserProfilePic(response.data.profilePicture || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
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
              src={`https://backend-users20250313221512.azurewebsites.net/${userProfilePic}`}
              alt="Profile"
              className="navbar-profile-pic"
            />
          )}
          <Link to="/">Academic Assistant</Link>
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
