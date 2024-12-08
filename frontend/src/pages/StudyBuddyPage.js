import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/FileUploadForm.css"; // Import spinner styles

const StudyBuddyPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // Clear previous results on new file selection
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setResult(null); // Clear previous results
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("File processed successfully!", { position: "top-center" });
      setResult(response.data.summary); // Display AI processing result
    } catch (error) {
      toast.error("Error uploading and processing file", { position: "top-center" });
    } finally {
      // Clear the form and reset states
      setFile(null);
      setLoading(false); // Stop loading state
      e.target.reset(); // Reset the form field
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
        />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <button type="submit" disabled={!file || loading}>
            {loading ? "Processing..." : "Upload File"}
          </button>
          {loading && <div className="spinner"></div>} {/* Spinner next to button */}
        </div>
      </form>
      <ToastContainer />
      {result && (
        <div style={{ marginTop: "2rem", textAlign: "left", border: "1px solid #ccc", padding: "1rem" }}>
          <h2>AI Summary</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default StudyBuddyPage;
