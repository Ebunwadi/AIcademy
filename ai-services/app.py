import os
import joblib
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import requests


# Load the trained Random Forest model
rf_pipeline = joblib.load('random_forest_career_model.pkl')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the dataset (adjust the path to your dataset)
file_path = 'comprehensive_career_guidance_dataset_1000.csv'
dataset = pd.read_csv(file_path)

# Extract unique skills from the dataset (assuming skills are in the 'Required Skills' column)
def extract_skills():
    all_skills = []
    for skills in dataset['Required Skills']:
        if isinstance(skills, str):  # Check if skills is a string
            # Split the skills by commas, and add each skill to the list
            all_skills.extend(skills.split(', '))
        else:
            continue  # Skip if the value is not a valid string
    
    # Remove duplicates by converting the list to a set and then back to a list
    unique_skills = list(set(all_skills))
    return unique_skills

# API endpoint to fetch skills
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = extract_skills()
    skills_list = [{'label': skill, 'value': skill} for skill in skills]
    return jsonify(skills_list)

# API endpoint for job role prediction
@app.route('/api/career/predict-job-role', methods=['POST'])
def predict_job_role():
    data = request.get_json()  # Get user input from the request body
    user_skills = data.get('skills', '')
    experience_level = data.get('experience_level', '')
    education_level = data.get('education_level', '')
    industry = data.get('industry', '')

    # Ensure that skills are passed as a string, even if multiple skills are selected
    if isinstance(user_skills, list):
        user_skills = ', '.join(user_skills)

    # Ensure that experience, education, and industry are strings
    experience_level = str(experience_level)
    education_level = str(education_level)
    industry = str(industry)

    # Prepare input data to match the format used by the trained Random Forest model
    input_data = pd.DataFrame([{
        'Required Skills': user_skills,
        'Experience Level': experience_level,
        'Education Level': education_level,
        'Industry': industry
    }])

    # Predict job role using the Random Forest model
    try:
        predicted_job_role = rf_pipeline.predict(input_data)[0]
    except Exception as e:
        return jsonify({'error': f"Prediction failed: {str(e)}"}), 500
    
        # Call the Express backend to get career advice based on education, experience, and industry
    try:
        career_advice_data = {
            'education_level': education_level,
            'experience_level': experience_level,
            'industry': industry,
            'predicted_job_role': predicted_job_role
        }
        # Send POST request to Express app to get career advice
        response = requests.post('https://aicademy-core-backend.onrender.com/api/career/generate-career-advice', json=career_advice_data)
        if response.status_code == 200:
            career_advice = response.json().get('career_advice', 'No career advice available.')
        else:
            career_advice = 'Error: Unable to retrieve career advice.'
    
    except Exception as e:
        return jsonify({'error': f"Error fetching career advice: {str(e)}"}), 500

    # Return the predicted job role and career advice as a response
    return jsonify({
        'predicted_job_role': predicted_job_role,
        'career_advice': career_advice
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

