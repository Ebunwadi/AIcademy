import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://aicademy-core-backend.onrender.com/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the header
            },
          }
        ); // Fetch user data
        setUser(response.data);
      } catch (error) {
        console.log(error);
        navigate("/login"); // Redirect to login if unauthenticated
      }
    };
    fetchUser();
  }, [navigate]);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("NickName", nickname);
      formData.append("ProfilePicture", profilePicture);
      formData.append("UserID", user.userID);

      await axios.put("http://localhost:5005/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully.");

      // Reset form fields
      setNickname("");
      setProfilePicture(null);
      e.target.reset();

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.log(error);

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
        <button type="submit" className="btn-primary">
          Update Profile
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
