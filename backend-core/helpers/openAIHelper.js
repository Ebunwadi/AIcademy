const { OpenAI } = require("openai");
const puppeteer = require('puppeteer');

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

/**
 * Generate AI summaries for text chunks.
 * @param {string[]} textChunks - Array of text chunks.
 * @returns {Promise<string>} - Combined AI summary.
 */
const generateSummary = async (textChunks) => {
  try {
    const summaries = [];

    for (const chunk of textChunks) {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates summarized content from the provided text.",
          },
          { role: "user", content: `Summarize the following text:\n\n${chunk}` },
        ],
        max_tokens: 500,
      });

      summaries.push(aiResponse.choices[0].message.content.trim());
    }

    return summaries.join("\n\n");
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw new Error("Failed to generate AI summary.");
  }
};

/**
 * Generate quiz questions based on AI summary.
 * @param {string} aiSummary - AI summary text.
 * @returns {Promise<string>} - Generated quiz content.
 */
const generateQuiz = async (aiSummary) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that creates 7 multiple-choice questions with 4 options each, based on the given text. Include the correct answer.",
        },
        { role: "user", content: `Generate a quiz from the following text:\n\n${aiSummary}` },
      ],
      max_tokens: 800,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz.");
  }
};

/**
 * Generate quiz questions based on AI summary.
 * @param {string} aiSummary - AI summary text.
 * @returns {Promise<string>} - Generated quiz content.
 */
const generateCareerAdvice = async (educationLevel, experienceLevel, industry, jobRole) => {
  try { 
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career advisor",
        },
        { role: "user", content: `Based on a person with the following profile: Education Level: ${educationLevel} Experience Level: ${experienceLevel} Industry: ${industry} Please provide personalized career advice for someone pursuing the job role of ${jobRole} in 150 words or less.` },
      ],
      max_tokens: 300,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz.");
  }
};


module.exports = { generateSummary, generateQuiz, generateCareerAdvice };
