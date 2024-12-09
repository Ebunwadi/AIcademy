import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css"; // Add styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">
          <Link to="/">Academic Assistant</Link>
        </h1>
        <div className="navbar-links">
          <Link to="/study-buddy">Study Buddy</Link>
          <Link to="/career-advisor">Career Advisor</Link>
          <Link to="/update-profile">Update Profile</Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
