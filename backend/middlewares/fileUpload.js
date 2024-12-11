const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files are saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 5);
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${extension}`);
  },
});

// Multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});

// Custom error-handling middleware for file uploads
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (e.g., file too large)
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    // Other errors (e.g., unsupported file type)
    return res.status(400).json({ message: `Error: ${err.message}` });
  }
  next();
};

module.exports = { upload, uploadErrorHandler };
