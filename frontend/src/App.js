import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudyBuddyPage from "./pages/StudyBuddyPage";
import CareerAdvisorPage from "./pages/CareerAdvisorPage";
// import UserProfilePage from "./pages/UserProfilePage";
import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
      {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
{/* Protected Routes */}
<Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-buddy"
          element={
            <ProtectedRoute>
              <StudyBuddyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-advisor"
          element={
            <ProtectedRoute>
              <CareerAdvisorPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfilePage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
};

export default App;
