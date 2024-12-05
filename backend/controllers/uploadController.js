const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 5); // Generate 3 unique characters
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

// File upload handler
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ 
    message: "File uploaded successfully", 
    filePath: req.file.path, 
    fileName: req.file.filename 
  });
};

module.exports = { upload, uploadFile };
