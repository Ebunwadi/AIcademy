import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("profilePicture", profilePicture);

      await axios.put("http://localhost:5000/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully.");

      // Reset form fields
      setNickname("");
      setProfilePicture(null);
      e.target.reset();

      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  return (
    <div className="user-profile-container">
      <h1>Update Profile</h1>
      <form onSubmit={handleUpdateProfile} className="user-profile-form">
        <label>Nickname</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
        />
        <label>Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit" className="btn-primary">Update Profile</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
