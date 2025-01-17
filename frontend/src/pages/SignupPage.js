import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthPage.css"; // Styles include the updated green background
import { Link, useNavigate } from "react-router-dom";


const Signup = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
  });

    const [loading, setLoading] = useState(false); // Loading state for spinner
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await axios.post("http://localhost:5002/api/auth/signup", formData);
      toast.success("Signup successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="auth-container">
    <div className="auth-card">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          required
        />
        <label>Last Name</label>
        <input
          type="text"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
                <button type="submit" className="btn-primary">
          {loading ? (
            <div className="spinner"></div> // Show the spinner when loading
          ) : (
            "SignUp"
          )}
        </button>
      </form>
      <div className="signup">
        <p>Already have an account?</p>
          <Link to="/login" className="btn-secondary">Sign In</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;

// -- Create the database
// CREATE DATABASE IF NOT EXISTS usersdatabase;
// USE usersdatabase;

// -- Create the products table
// CREATE TABLE IF NOT EXISTS users (
//   UserID char(36) NOT NULL,
//   FirstName varchar(50) NOT NULL,
//   LastName varchar(50) DEFAULT NULL,
//   Email varchar(50) DEFAULT NULL,
//   ProfilePicture varchar(255) DEFAULT NULL,
//   NickName varchar(255) DEFAULT NULL,
//   PasswordHash varchar(255) DEFAULT NULL,
//   ResetCode varchar(255) DEFAULT NULL,
//   PRIMARY KEY (UserID)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;