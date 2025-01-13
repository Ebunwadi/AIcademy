import pandas as pd
import random

# Define job roles, skills, industries, and career paths
job_roles = [
    "Software Engineer", "Data Scientist", "Marketing Manager", "Financial Analyst",
    "Product Manager", "Business Analyst", "UX/UI Designer", "DevOps Engineer", "HR Manager"
]

skills = {
    "Software Engineer": ["Java", "Python", "SQL", "Problem-Solving", "Algorithms", "Data Structures"],
    "Data Scientist": ["Python", "Machine Learning", "Data Analysis", "SQL", "Statistical Analysis"],
    "Marketing Manager": ["SEO", "Content Strategy", "Analytics", "Communication", "Digital Marketing"],
    "Financial Analyst": ["Excel", "Financial Modelling", "Accounting", "Budgeting", "Data Analysis"],
    "Product Manager": ["Project Management", "Agile", "Business Strategy", "Product Roadmap"],
    "Business Analyst": ["Business Analysis", "Data Analysis", "Process Optimization", "SQL", "Project Management"],
    "UX/UI Designer": ["UX Research", "Wireframing", "Prototyping", "Figma", "User-Centered Design"],
    "DevOps Engineer": ["AWS", "Docker", "CI/CD", "Linux", "Automation", "Scripting"],
    "HR Manager": ["Recruitment", "Employee Relations", "HR Policies", "Performance Management", "Training"]
}

industries = ["Tech", "Marketing", "Finance", "Healthcare", "Education"]
experience_levels = ["Junior", "Mid-level", "Senior"]
education_levels = ["Bachelor's", "Master's", "PhD"]
salary_ranges = {
    "Tech": ["50k-70k USD", "70k-100k USD", "100k-150k USD"],
    "Marketing": ["40k-60k USD", "60k-90k USD", "90k-120k USD"],
    "Finance": ["45k-65k USD", "65k-95k USD", "95k-130k USD"],
    "Healthcare": ["50k-70k USD", "70k-100k USD", "100k-150k USD"],
    "Education": ["40k-60k USD", "60k-85k USD", "85k-110k USD"]
}
career_paths = {
    "Software Engineer": "Junior Developer → Senior Developer → Lead Developer",
    "Data Scientist": "Data Analyst → Data Scientist → Lead Data Scientist",
    "Marketing Manager": "Marketing Specialist → Marketing Manager → Marketing Director",
    "Financial Analyst": "Junior Analyst → Financial Analyst → Senior Analyst",
    "Product Manager": "Product Manager → Senior Product Manager → Product Director",
    "Business Analyst": "Junior Analyst → Business Analyst → Senior Business Analyst",
    "UX/UI Designer": "Junior Designer → UX/UI Designer → Lead Designer",
    "DevOps Engineer": "Junior DevOps → DevOps Engineer → Senior DevOps Engineer",
    "HR Manager": "HR Specialist → HR Manager → Senior HR Manager"
}

# Generate 1000 rows of data with random missing values
num_rows = 1000
data = []
for _ in range(num_rows):
    job = random.choice(job_roles)
    job_skills = skills[job]
    industry = random.choice(industries)
    experience = random.choice(experience_levels)
    education = random.choice(education_levels)
    salary = random.choice(salary_ranges[industry])
    career_path = career_paths.get(job, "No defined career path")
    
    # Randomly introduce missing values in skills, salary, or career path
    if random.random() < 0.1:  # 10% chance of missing data in skills
        job_skills = []
    if random.random() < 0.1:  # 10% chance of missing data in salary
        salary = None
    if random.random() < 0.1:  # 10% chance of missing data in career path
        career_path = None

    data.append({
        "Job Role": job,
        "Required Skills": ", ".join(job_skills) if job_skills else None,
        "Experience Level": experience,
        "Education Level": education,
        "Industry": industry,
        "Salary Range": salary,
        "Career Path": career_path
    })

# Create the dataframe
comprehensive_career_guidance_df = pd.DataFrame(data)

# Save the dataset as a CSV file
comprehensive_career_guidance_df.to_csv("comprehensive_career_guidance_dataset_1000.csv", index=False)

print("Dataset saved as 'comprehensive_career_guidance_dataset_1000.csv'")
