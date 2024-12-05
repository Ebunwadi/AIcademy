import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudyBuddyPage from "./pages/StudyBuddyPage";
import CareerAdvisorPage from "./pages/CareerAdvisorPage";
import ResearchReviewerPage from "./pages/ResearchReviewerPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study-buddy" element={<StudyBuddyPage />} />
        <Route path="/career-advisor" element={<CareerAdvisorPage />} />
        <Route path="/research-reviewer" element={<ResearchReviewerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
