import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCode, setResetCode] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("profilePicture", profilePicture);

      await axios.put("http://localhost:5000/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  const handleSendResetCode = async () => {
    try {
      await axios.post("/api/user/send-reset-code", { email: resetEmail });
      toast.success("Reset code sent to email.");
    } catch (error) {
      toast.error("Error sending reset code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/user/reset-password", {
        email: resetEmail,
        newPassword,
        resetCode,
      });
      toast.success("Password reset successfully.");
    } catch (error) {
      toast.error("Error resetting password.");
    }
  };

  return (
    <div>
      <h1>Update Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <label>Nickname</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <label>Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Update Profile</button>
      </form>

      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <label>Email</label>
        <input
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
        <label>Reset Code</label>
        <input
          type="text"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      <button onClick={handleSendResetCode}>Send Reset Code</button>

      <ToastContainer />
    </div>
  );
};

export default UserProfile;
