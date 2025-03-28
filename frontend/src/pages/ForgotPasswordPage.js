import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ResetPassword.css"; // Use the same styles

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      await axios.post("http://localhost:5005/api/users/send-reset-code", {
        email,
      });
      toast.success(
        "Reset code sent to your email. Redirecting to reset password page..."
      );
      // Clear form
      setEmail("");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset code.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="form-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSendResetCode}>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Send Reset Code"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
