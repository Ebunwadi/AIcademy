const { generateCareerAdvice } = require("../helpers/openAIHelper")

const careerAdvisor = async (req, res) => {
try {
    const {experience_level, education_level, industry, job_role} = req.body;
    
    const careerAdvice = await generateCareerAdvice(experience_level, education_level, industry, job_role)
    return res.status(200).json({ career_advice: careerAdvice });
} catch (error) {
    console.error("Error generating jobs:", error);
    res.status(500).json({ message: "Error generating career advise.", error: error.message });
}
}

module.exports = {careerAdvisor}
