import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthPage.css"; // Styles include the updated green background

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false); // Loading state for spinner
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the spinner
    try {
      await axios.post("http://localhost:5002/api/auth/login", formData, { withCredentials: true });
      toast.success("Login successful!");
      navigate("/"); // Redirect to home/dashboard
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <button type="submit" disabled={loading}  className="btn-primary">Log In</button>
          {loading && <div className="spinner"></div>}
        </form>

        <div className="auth-actions">
          <Link to="/signup" className="btn-secondary">Sign Up</Link>
          <Link to="/forgot-password" className="btn-secondary">Forgot Password?</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
