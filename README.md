# 🚀 AI SEO Analyzer & Rank Tracker

An AI-powered full-stack SEO platform that combines website auditing, keyword rank tracking, competitor analysis, and automated SEO recommendations into a single dashboard.

The application analyzes websites using web scraping techniques, tracks keyword rankings through Google search results, and leverages Google Gemini AI to generate actionable SEO insights and recommendations.

---

## 🌟 Features

### 🔍 AI-Powered SEO Analysis

* Analyze any public website URL
* Extract SEO metadata including:

  * Page title
  * Meta description
  * Canonical URLs
  * Open Graph tags
  * Twitter tags
  * Robots directives
* Analyze heading structure (H1–H6)
* Evaluate internal and external links
* Detect missing image alt attributes
* Calculate word count and page size
* Generate AI-driven SEO recommendations using Google Gemini

### 📈 Keyword Rank Tracking

* Track Google keyword rankings
* Monitor position changes over time
* View ranking history
* Analyze competitor domains
* Manual ranking refresh
* Automated daily updates using cron jobs

### 📊 Interactive Dashboard

* Overall SEO score
* Category-wise SEO scoring
* Historical ranking data
* SEO issue detection
* Competitor monitoring
* Detailed analysis reports

### 🔐 Authentication & Security

* JWT-based authentication
* Protected API routes
* Secure user-specific data storage
* Environment-based configuration

---

## 🏗️ System Architecture

```text
Frontend (React + TypeScript)
           │
           ▼
     Express API
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼
MongoDB  SerpAPI  Gemini AI
           │
           ▼
     Google Rankings

Scraper Service
(Axios + Cheerio)
           │
           ▼
     Website Analysis
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Node-Cron

### APIs & Services

* Google Gemini AI
* SerpAPI
* Axios
* Cheerio

---

## 📂 Project Structure

```text
SEO_RANK_TRACKER
│
├── backend_server
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── rankController.js
│   │   └── analysisController.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── KeywordTracking.js
│   │   └── Analysis.js
│   │
│   ├── services
│   │   ├── scraperService.js
│   │   ├── rankTrackerService.js
│   │   ├── keywordTrackingService.js
│   │   └── geminiService.js
│   │
│   ├── routes
│   ├── middleware
│   ├── cron
│   └── server.js
│
└── client
    ├── src
    │   ├── pages
    │   ├── components
    │   ├── context
    │   └── services
    └── ...
```

---

## ⚡ SEO Analysis Workflow

1. User submits a website URL.
2. Backend creates a processing record.
3. Axios fetches website HTML.
4. Cheerio extracts SEO-related data.
5. Gemini AI evaluates SEO quality.
6. Scores, issues, and recommendations are generated.
7. Results are stored in MongoDB.
8. Frontend polls the backend and displays the final report.

---

## 📈 Rank Tracking Workflow

1. User submits a keyword and target domain.
2. Backend creates a tracking record.
3. SerpAPI fetches Google search results.
4. Ranking position is identified.
5. Competitor domains are extracted.
6. Ranking history is stored.
7. Scheduled cron jobs update rankings daily.

---

## 📊 Scoring Categories

| Category       | Description                                  |
| -------------- | -------------------------------------------- |
| SEO            | Meta tags, headings, image alt attributes    |
| Performance    | Page load performance and optimization       |
| Accessibility  | Accessibility-related best practices         |
| Best Practices | Canonical tags, Open Graph, internal linking |

Overall Score = Average of all category scores (0–100)

---

## 🔗 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Rank Tracking

* POST `/api/rank/add`
* GET `/api/rank/list`
* POST `/api/rank/:id/refresh`
* DELETE `/api/rank/:id`

### SEO Analysis

* POST `/api/analysis/analyze`
* GET `/api/analysis/:id`
* GET `/api/analysis/list`
* DELETE `/api/analysis/:id`

---

## 🚀 Local Setup

### Backend

```bash
cd backend_server
npm install
npm run server
```

Create `.env`

```env
MONGO_URI=
JWT_SECRET=
SERPAPI_KEY=
GEMINI_API_KEY=
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 💡 Challenges Solved

* Implemented asynchronous SEO analysis workflow
* Integrated AI-generated SEO recommendations
* Built keyword ranking tracking with competitor analysis
* Designed polling mechanism for long-running processes
* Automated ranking updates using scheduled cron jobs
* Structured MongoDB schemas for scalable reporting

---

## 🎯 Future Improvements

* PDF report generation
* Email notifications for ranking changes
* Backlink analysis
* Multi-location rank tracking
* Team collaboration features
* SEO trend forecasting

---

## 👨‍💻 Author

Praveen Kumar

Built using React, Node.js, MongoDB, SerpAPI, and Google Gemini AI.
