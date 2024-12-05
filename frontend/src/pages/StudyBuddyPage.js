import React, { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudyBuddyPage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Reference to the file input element

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message, { position: "top-center" });

      // Clear the input and reset the state
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input field
      }
    } catch (error) {
      toast.error("Error uploading file", { position: "top-center" });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Study Buddy</h1>
      <p>Upload your notes and get AI-generated insights.</p>
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef} // Attach ref to the input
        />
        <button type="submit" disabled={!file}>
          Upload File
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StudyBuddyPage;
