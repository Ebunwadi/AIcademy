require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
// Allow requests from the frontend 
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies and credentials
  };
// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
