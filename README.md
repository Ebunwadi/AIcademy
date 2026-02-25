# AiCademy

AiCademy is a multi-service web app for students and early-career learners.
It combines user management, AI-assisted note processing, and career guidance.

## What the project does

- Auth and profile management (signup, login, password reset, profile updates)
- Study Buddy:
  - Upload study files (`pdf`, `docx`, `pptx`, etc.)
  - Extract text
  - Generate summary (AI when available, fallback preview when AI is unavailable)
  - Save notes and generate quizzes
- Career Advisor:
  - Skill-based job role prediction
  - Personalized career advice

## Services

- `frontend` (React, port `3000`): Main user interface where learners sign in, manage profiles, upload study material, and use Study Buddy/Career Advisor features.
- `backend-core` (Node.js + Express + Prisma + PostgreSQL, port `5000`): Core application API that handles study workflows like file processing, note generation, summaries, and quiz creation.
- `backend-users` (.NET 8 Web API + EF Core + MySQL, port `5005`): User management service that handles authentication and account features like signup, login, password reset, and profile updates.
- `ai-services` (Flask ML service, port `5003`): AI/ML microservice that powers career role prediction and AI-assisted recommendations for learning and career guidance.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- .NET SDK 8+
- MySQL (for `backend-users`)
- PostgreSQL (for `backend-core`)

## Environment setup

### 1) Frontend

From `frontend/`:

- copy `.env.example` to `.env`
- verify values:
  - `REACT_APP_CORE_API_URL=http://localhost:5000`
  - `REACT_APP_USER_API_URL=http://localhost:5005`
  - `REACT_APP_AI_API_URL=http://localhost:5003`

### 2) Backend Core

From `backend-core/`:

- copy `.env.example` to `.env` if needed
- set `USER_SERVICE_URL=http://localhost:5005`
- set `FRONTEND_ORIGINS=http://localhost:3000,https://aicademy-12mi.onrender.com`
- set `OPENAI_API_KEY` if you want AI-generated summaries/quizzes

Notes:
- set `DATABASE_URL` in `backend-core/prisma/.env` (copy from `backend-core/prisma/.env.example`)
- `backend-core/server.js` loads both `.env` and `prisma/.env`

### 3) Backend Users

From `backend-users/backend-users/`:

- edit `appsettings.json`:
  - `ConnectionStrings:DefaultConnection` (MySQL)
  - `JwtSettings:SecretKey`
  - `EmailSettings` (for reset emails)
  - `Cors:AllowedOrigins` as needed

### 4) AI Services

From `ai-services/`:

- copy `.env.example` to `.env` if needed
- set `CORE_API_BASE_URL=http://localhost:5000`
- set `FRONTEND_ORIGINS=http://localhost:3000,https://aicademy-12mi.onrender.com`

## Install dependencies

Run once per service:

```bash
cd frontend && npm install
cd ../backend-core && npm install
cd ../ai-services && pip install -r requirements.txt
```

For .NET:

```bash
cd ../backend-users/backend-users
dotnet restore
```

If `ai-services/requirements.txt` is missing in your local copy, install the packages used by `app.py` manually:
- `flask`
- `flask-cors`
- `pandas`
- `joblib`
- `requests`
- `scikit-learn` (for loading the trained pipeline)

## Run locally

Use separate terminals:

```bash
# 1) backend-users
cd backend-users/backend-users
dotnet run
```

```bash
# 2) backend-core
cd backend-core
node server.js
```

```bash
# 3) ai-services
cd ai-services
python app.py
```

```bash
# 4) frontend
cd frontend
npm start
```

Open `http://localhost:3000`.

