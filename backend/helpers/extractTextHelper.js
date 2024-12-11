const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const textract = require("textract");

/**
 * Extract text from a file based on its type.
 * @param {string} filePath - The path to the file.
 * @param {string} fileType - The file extension (e.g., .pdf, .docx).
 * @returns {Promise<string>} - Extracted text.
 */
const extractText = async (filePath, fileType) => {
  try {
    if (fileType === ".pdf") {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } else if ([".ppt", ".pptx", ".doc", ".docx"].includes(fileType)) {
      return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) return reject(error);
          resolve(text);
        });
      });
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};

module.exports = extractText;
