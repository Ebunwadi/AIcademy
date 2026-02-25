const path = require("path");
const fs = require("fs");
const chunkText = require("../helpers/chunkHelper");
const extractText = require("../helpers/extractTextHelper");
const { generateSummary, generateQuiz } = require("../helpers/openAIHelper");
const prismaClient = require("../db/prismaClient");

const buildFallbackSummary = (text) => {
  if (!text || !text.trim()) {
    return "No readable content was extracted from the uploaded file.";
  }

  const compactText = text.replace(/\s+/g, " ").trim();
  const maxLength = 1200;
  const preview =
    compactText.length > maxLength
      ? `${compactText.slice(0, maxLength)}...`
      : compactText;

  return `AI summary is currently unavailable. Here is a content preview:\n\n${preview}`;
};

/**
 * Upload a file, generate an AI summary, and save it in the database.
 */
const uploadAndSummarize = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.filename);
    const userId = req.user.userID;

    // Extract text from the file
    const extractedText = await extractText(filePath, fileType);
    const textChunks = chunkText(extractedText, 2000);

    // Generate AI summary; if OpenAI is unavailable/quota-limited, fall back
    // to a local preview summary so upload still succeeds.
    let finalSummary;
    let usedFallbackSummary = false;
    try {
      finalSummary = await generateSummary(textChunks);
    } catch (error) {
      console.warn(
        "AI summary generation failed, using fallback summary:",
        error?.message || error
      );
      finalSummary = buildFallbackSummary(extractedText);
      usedFallbackSummary = true;
    }

    // Save note and summary to the database
    const note = await prismaClient.note.create({
      data: {
        userId,
        title: req.file.originalname,
        filePath: req.file.filename,
        aiSummary: finalSummary,
      },
    });

    res.status(201).json({
      message: "File uploaded and processed successfully",
      note,
      usedFallbackSummary,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
};

/**
 * Get all notes for the logged-in user.
 */
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.userID;

    const notes = await prismaClient.note.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        aiSummary: true,
        createdAt: true,
      },
    });

    // if (notes.length === 0) {
    //   return res.status(204).json({ message: "No notes found for this user." });
    // }

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res
      .status(500)
      .json({ message: "Error fetching notes.", error: error.message });
  }
};

/**
 * Get a single note by ID.
 */
const getSingleNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await prismaClient.note.findUnique({
      where: { id: noteId },
      select: {
        id: true,
        title: true,
        aiSummary: true,
        createdAt: true,
        filePath: true,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error("Error fetching the note:", error);
    res
      .status(500)
      .json({ message: "Error fetching the note.", error: error.message });
  }
};

/**
 * Delete a note by ID.
 */
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await prismaClient.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Ensure the user owns the note
    if (note.userId !== req.user.userID) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this note." });
    }

    // Delete the file from the filesystem
    // const filePath = path.join(__dirname, "..", "uploads", note.filePath);
    // await fs.unlink(filePath);

    // Delete the note from the database
    await prismaClient.note.delete({
      where: { id: noteId },
    });

    res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("Error deleting the note:", error);
    res
      .status(500)
      .json({ message: "Error deleting the note.", error: error.message });
  }
};

/**
 * Generate a quiz based on a note's AI summary.
 */
const generateQuizForNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await prismaClient.note.findUnique({
      where: { id: noteId },
      select: { aiSummary: true },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    const quiz = await generateQuiz(note.aiSummary);

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res
      .status(500)
      .json({ message: "Error generating quiz.", error: error.message });
  }
};

module.exports = {
  uploadAndSummarize,
  getAllNotes,
  getSingleNote,
  deleteNote,
  generateQuizForNote,
};
