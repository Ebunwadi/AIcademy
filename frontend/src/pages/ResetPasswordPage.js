import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ResetPassword.css"; // Ensure to include your custom styles

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true); // Start loading spinner

    try {
      await axios.post(
        "https://backend-users20250313164401.azurewebsites.net/api/users/reset-password",
        {
          email,
          resetCode,
          newPassword,
        }
      );

      toast.success("Password reset successfully. Redirecting to login...");
      // Clear form
      setEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="form-container">
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label>Reset Code</label>
        <input
          type="text"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          placeholder="Enter the reset code"
          required
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Reset Password"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
