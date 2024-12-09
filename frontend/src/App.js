import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudyBuddyPage from "./pages/StudyBuddyPage";
import CareerAdvisorPage from "./pages/CareerAdvisorPage";
import UserProfilePage from "./pages/UserProfilePage";
import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study-buddy" element={<StudyBuddyPage />} />
        <Route path="/career-advisor" element={<CareerAdvisorPage />} />
        <Route path="/update-profile" element={<UserProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
    </>
  );
};

export default App;
