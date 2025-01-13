import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
file_path = 'comprehensive_career_guidance_dataset_1000.csv'
dataset = pd.read_csv(file_path)

# Handle missing values
# Fill missing skills with a placeholder
dataset['Required Skills'] = dataset['Required Skills'].fillna('No skills provided')

# For categorical columns (Experience Level, Education Level, Industry), use SimpleImputer to fill missing values
categorical_columns = ['Experience Level', 'Education Level', 'Industry']

# Define the preprocessing steps for the pipeline
vectorizer = TfidfVectorizer(stop_words='english')
encoder = OneHotEncoder(handle_unknown='ignore')  # OneHotEncoder for categorical features
imputer = SimpleImputer(strategy='most_frequent')  # Imputer for missing categorical data

# Combine all transformers into a ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('skills', vectorizer, 'Required Skills'),
        ('categorical', Pipeline(steps=[
            ('imputer', imputer),
            ('encoder', encoder)
        ]), categorical_columns)
    ])

# Build the Random Forest pipeline
rf_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Split the dataset into training and testing sets (80% train, 20% test)
X = dataset[['Required Skills', 'Experience Level', 'Education Level', 'Industry']]
y = dataset['Job Role']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
rf_pipeline.fit(X_train, y_train)

# Predict the job roles on the test set
y_pred = rf_pipeline.predict(X_test)

# Evaluate the model's accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy}")

# Save the Random Forest model to a file
model_filename = 'random_forest_career_model.pkl'
joblib.dump(rf_pipeline, model_filename)

print(f"Model saved as {model_filename}")
