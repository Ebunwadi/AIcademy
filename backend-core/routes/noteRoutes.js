const express = require("express");
const {
  uploadAndSummarize,
  getAllNotes,
  getSingleNote,
  deleteNote,
  generateQuizForNote,
} = require("../controllers/notesController");
const protectRoute = require("../middlewares/authMiddleware");
const { upload, uploadErrorHandler } = require("../middlewares/fileUpload");

const router = express.Router();

// POST: Upload and summarize a file
router.post(
  "/upload",
  protectRoute,
  upload.single("file"),
  uploadErrorHandler,
  uploadAndSummarize
);

// GET: Get all notes for the logged-in user
router.get("/", protectRoute, getAllNotes);

// GET: Get a single note by ID
router.get("/:noteId", protectRoute, getSingleNote);

// DELETE: Delete a note by ID
router.delete("/:noteId", protectRoute, deleteNote);

// POST: Generate quiz for a note
router.post("/:noteId/quiz", generateQuizForNote);

module.exports = router;
