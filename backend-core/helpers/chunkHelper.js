/**
 * Splits a large text into smaller chunks of specified max length.
 * @param {string} text - The input text to be split.
 * @param {number} maxLength - The maximum length of each chunk (in characters).
 * @returns {string[]} - An array of text chunks.
 */
const chunkText = (text, maxLength) => {
    const words = text.split(" ");
    let chunks = [];
    let chunk = [];
  
    words.forEach((word) => {
      // Check if adding the word exceeds the max length
      if ((chunk.join(" ").length + word.length + 1) <= maxLength) {
        chunk.push(word);
      } else {
        chunks.push(chunk.join(" "));
        chunk = [word];
      }
    });
  
    // Add the last chunk
    if (chunk.length > 0) chunks.push(chunk.join(" "));
    return chunks;
  };
  
  module.exports = chunkText;
  