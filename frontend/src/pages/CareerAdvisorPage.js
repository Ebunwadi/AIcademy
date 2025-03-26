import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import "../styles/JobRecommendationForm.css";

const JobRecommendationForm = () => {
  const [skills, setSkills] = useState([]); // User's selected skills
  const [experienceLevel, setExperienceLevel] = useState(""); // Experience level
  const [educationLevel, setEducationLevel] = useState(""); // Education level
  const [industry, setIndustry] = useState(""); // Industry
  const [predictedJobRole, setPredictedJobRole] = useState(""); // Predicted job role
  const [careerAdvice, setCareerAdvice] = useState(""); // Career advice
  const [allSkills, setAllSkills] = useState([]); // All available skills
  const [loading, setLoading] = useState(false); // Loading state for spinner

  // Fetch the unique skills from the backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/skills");
        setAllSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!skills.length || !experienceLevel || !educationLevel || !industry) {
      toast.error("Please fill in all the fields before submitting."); // Show error toast
      return; // Prevent form submission if fields are empty
    }

    setLoading(true); // Start the spinner

    const data = {
      skills: skills.map((skill) => skill.value), // skills are passed as an array of strings
      experience_level: experienceLevel,
      education_level: educationLevel,
      industry,
    };

    try {
      // Make a single API request to Flask, which handles both the job role prediction and career advice
      const response = await axios.post(
        "http://localhost:5003/api/career/predict-job-role",
        data
      );

      setPredictedJobRole(response.data.predicted_job_role);
      setCareerAdvice(response.data.career_advice); // Set the career advice from the Flask response
      setAllSkills("");
      setCareerAdvice("");
      setEducationLevel("");
      setExperienceLevel("");
      setIndustry("");
    } catch (error) {
      console.error(
        "Error predicting job role or fetching career advice:",
        error
      );
      toast.error(
        "An error occurred while fetching the job role or career advice."
      ); // Show error toast
    } finally {
      setLoading(false); // Stop the spinner after the response is received
    }
  };

  return (
    <div>
      <div className="career-advisor-container">
        <h1>Smart Career Advisor</h1>
        <p>
          Let us recommend a career path for you based on your skills,
          experience, and education.
        </p>

        {/* Toast container for displaying error or success messages */}
        <ToastContainer />

        <form onSubmit={handleSubmit} className="career-advisor-form">
          <label>Skills</label>
          <Select
            isMulti
            options={allSkills}
            value={skills}
            onChange={setSkills}
            placeholder="Select your skills"
          />

          <label>Experience Level</label>
          <Select
            options={[
              { label: "Junior", value: "Junior" },
              { label: "Mid-level", value: "Mid-level" },
              { label: "Senior", value: "Senior" },
            ]}
            value={
              experienceLevel
                ? { label: experienceLevel, value: experienceLevel }
                : null
            } // If no value, set to null
            onChange={(selected) =>
              setExperienceLevel(selected ? selected.value : "")
            } // Properly handle null
            placeholder="Select your experience level" // Placeholder for experience level
          />

          <label>Education Level</label>
          <Select
            options={[
              { label: "Bachelor's", value: "Bachelor's" },
              { label: "Master's", value: "Master's" },
              { label: "PhD", value: "PhD" },
            ]}
            value={
              educationLevel
                ? { label: educationLevel, value: educationLevel }
                : null
            } // If no value, set to null
            onChange={(selected) =>
              setEducationLevel(selected ? selected.value : "")
            } // Properly handle null
            placeholder="Select your education level" // Placeholder for education level
          />

          <label>Industry</label>
          <Select
            options={[
              { label: "Tech", value: "Tech" },
              { label: "Finance", value: "Finance" },
              { label: "Healthcare", value: "Healthcare" },
              { label: "Education", value: "Education" },
            ]}
            value={industry ? { label: industry, value: industry } : null} // If no value, set to null
            onChange={(selected) => setIndustry(selected ? selected.value : "")} // Properly handle null
            placeholder="Select your industry" // Placeholder for industry
          />

          <button type="submit" className="btn-primary">
            {loading ? (
              <div className="spinner"></div> // Show the spinner when loading
            ) : (
              "Get Job Role Prediction and Career Advice"
            )}
          </button>
        </form>

        {predictedJobRole && (
          <div className="results-section">
            <h3>Your Predicted Job Role: {predictedJobRole}</h3>
            {careerAdvice && (
              <p>
                <strong>Career Advice:</strong> {careerAdvice}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendationForm;
