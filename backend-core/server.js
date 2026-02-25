require("dotenv").config();
require("dotenv").config({ path: "prisma/.env", override: false });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const careerRoutes = require("./routes/careerRoutes");

const app = express();
// Allow requests from local dev and production frontends.
// Override with FRONTEND_ORIGINS="http://localhost:3000,https://example.com"
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:3000,https://aicademy-12mi.onrender.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no origin header) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
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
app.use("/api/career", careerRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
