const fs = require("fs").promises;
const path = require("path");
const pdfParse = require("pdf-parse");
const textract = require("textract");
const { OpenAI } = require("openai"); 
const multer = require("multer");
const chunkText = require("../helpers/chunkHelper");


// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File upload logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 5);
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

// Helper: Extract text based on file type
const extractText = async (filePath, fileType) => {
  if (fileType === ".pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } else if (fileType === ".ppt" || fileType === ".docx" || fileType === ".doc" || fileType === ".pptx") {
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(filePath, (error, text) => {
        if (error) return reject(error);
        resolve(text);
      });
    });
  } else {
    throw new Error("Unsupported file type");
  }
};

// Upload and process file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.filename);

    // Extract text from the file
    const extractedText = await extractText(filePath, fileType);
    const textChunks = chunkText(extractedText, 2000); // Split text into manageable chunks
    const summaries = [];
    

    // Process text with OpenAI
    for (const chunk of textChunks) {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": `
                You are a helpful assistant that generates summarized content, flashcards, and quizzes for efficient learning based on the text given. Note that the text is gotten from student's lecture note uploaded to our server, so the content is extracted and given as the prompt
              `
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Summarize the following text:\n\n${chunk}`
            }
          ]
        }
      ],
      max_tokens: 1000,
    });
    // Extract the content from the AI response
    summaries.push(aiResponse.choices[0].message.content.trim());
  }
      // Combine all summaries into a single output
      const finalSummary = summaries.join("\n\n");

    res.status(200).json({
      message: "File uploaded and processed successfully",
      fileName: req.file.filename,
      summary: finalSummary,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
};

module.exports = { upload, uploadFile };
