import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/StudyBuddyPage.css"; // Add styles for the page

const StudyBuddyPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes", { withCredentials: true });
      setNotes(response.data.notes);
    } catch (error) {
      toast.error("Error fetching notes. Please try again.", { position: "top-center" });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("File uploaded successfully!", { position: "top-center" });
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      toast.error("Error uploading file. Please try again.", { position: "top-center" });
    } finally {
      setFile(null);
      setLoading(false);
      e.target.reset();
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, { withCredentials: true });
      toast.success("Note deleted successfully!", { position: "top-center" });
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      toast.error("Error deleting note. Please try again.", { position: "top-center" });
    }
  };

  const handleGenerateQuiz = async (noteId) => {
    setLoading(true);
    setQuiz([]);
    try {
      const response = await axios.post(`http://localhost:5000/api/notes/${noteId}/quiz`, {}, { withCredentials: true });
      const quizContent = response.data.quiz.split("\n").map((line) => line.trim()).filter(Boolean); // Parse the quiz
      setQuiz(quizContent);
    } catch (error) {
      toast.error("Error generating quiz. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="study-buddy-container">
      <h1>Study Buddy</h1>
      <p>Upload your notes, view summaries, and generate quizzes.</p>

      {/* File Upload Section */}
      <form onSubmit={handleFileUpload} className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <div className="upload-actions">
          <button type="submit" disabled={!file || loading} className="btn-primary">
            {loading ? "Processing..." : "Upload File"}
          </button>
          {loading && <div className="spinner"></div>}
        </div>
      </form>

      {/* Notes List Section */}
      <div className="notes-section">
        <h2>Your Notes:</h2>
        {notes.length === 0 ? (
          <p>You haven't uploaded any notes yet.</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note-item">
                <div>
                  <a href="#!" onClick={() => setSelectedNote(note)}>
                    {note.title}
                  </a>
                  <span className="note-date">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handleDeleteNote(note.id)} className="delete-btn">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Note Section */}
      {selectedNote && (
        <div className="note-details">
          <h2>{selectedNote.title}</h2>
          <p><strong>AI Summary:</strong> {selectedNote.aiSummary}</p>
          <div className="upload-actions">
            <button onClick={() => handleGenerateQuiz(selectedNote.id)} disabled={loading} className="btn-primary">
              {loading ? "Generating Quiz..." : "Generate Quiz"}
            </button>
            {loading && <div className="spinner"></div>}
          </div>
          {quiz.length > 0 && (
            <div className="quiz-section">
              <h3>Quiz</h3>
              <ul>
                {quiz.map((q, index) => (
                  <li key={index}>
                    <p>{q}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setSelectedNote(null)} className="btn-primary" disabled={loading}>
            Back to Notes
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StudyBuddyPage;
