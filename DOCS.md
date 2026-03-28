# FinPilot AI — Technical Documentation

> Full technical reference for developers working on or integrating with FinPilot AI.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Repository Structure](#2-repository-structure)
3. [Client (Frontend)](#3-client-frontend)
4. [Server (Backend)](#4-server-backend)
5. [Environment Configuration](#5-environment-configuration)
6. [Local Development Setup](#6-local-development-setup)
7. [Deployment](#7-deployment)
8. [API Reference](#8-api-reference)
9. [Feature Breakdown](#9-feature-breakdown)
10. [Development Checklist & Known TODOs](#10-development-checklist--known-todos)
11. [Contribution Guide](#11-contribution-guide)

---

## 1. Architecture Overview

FinPilot AI follows a classic **client-server** architecture:

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Client      │ ──────► │   Node.js Server     │
│  (Vercel, Static)   │  HTTP   │  (Express API)       │
│                     │ ◄────── │                      │
└─────────────────────┘         └──────────┬───────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   AI / LLM API  │
                                  │  (3rd Party)    │
                                  └─────────────────┘
```

- The **React frontend** provides the user interface — chat window, goal tracker, and financial dashboard.
- The **Node.js/Express backend** handles all API requests, processes user messages, and forwards them to the AI language model.
- The **AI provider** (configured via API key) generates intelligent, contextual financial responses.
- The entire stack is written in **JavaScript (99.5%)**, keeping the codebase consistent across both ends.

---

## 2. Repository Structure

```
FinPilot-AI/
├── client/                  # React frontend application
│   ├── public/              # Static assets (index.html, favicon, etc.)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper/utility functions
│   │   ├── App.js           # Root component with routing
│   │   └── index.js         # Entry point
│   └── package.json
│
├── server/                  # Node.js backend API
│   ├── routes/              # Express route handlers
│   ├── controllers/         # Business logic for each route
│   ├── middleware/          # Auth, validation, error handling
│   ├── index.js             # Express app entry point
│   └── package.json
│
├── .gitignore               # Ignores node_modules, .env, dist/
├── Checklist.txt            # Developer TODO tracker
└── README.md
```

> **Note:** The exact subdirectory structure within `client/src/` and `server/` is inferred from common patterns in similar full-stack projects. Actual file layout may vary.

---

## 3. Client (Frontend)

### Technology

- **React** — Component-based UI
- **JavaScript (ES6+)** — No TypeScript
- **CSS / Tailwind / Styled Components** — Styling (exact library TBD from source)
- **Vercel** — Hosting and CI/CD

### Key Responsibilities

- Render the chat interface for user interaction
- Display finance goals and their completion status
- Send user messages to the backend via `fetch` or `axios`
- Handle real-time or streamed AI responses
- Adapt responsively to mobile and desktop viewports

### Running the Client

```bash
cd client
npm install
npm start        # Development server at http://localhost:3000
npm run build    # Production build → /dist or /build
```

### Key Scripts (`client/package.json`)

| Script          | Description                            |
|-----------------|----------------------------------------|
| `npm start`     | Start local dev server (hot reload)    |
| `npm run build` | Build optimized production bundle      |
| `npm test`      | Run client-side tests (if configured)  |

---

## 4. Server (Backend)

### Technology

- **Node.js** — Runtime
- **Express.js** — HTTP framework and routing
- **dotenv** — Environment variable management
- **AI SDK / fetch** — Communication with the AI provider

### Key Responsibilities

- Validate and sanitize inputs
- Forward prompts to the AI model with appropriate system context
- Return AI-generated responses to the client
- Manage finance goal state (create, retrieve, update)

### Running the Server

```bash
cd server
npm install
cp .env.example .env   # Configure your keys
npm start              # Starts at http://localhost:5000 (or PORT in .env)
```

### Key Scripts (`server/package.json`)

| Script       | Description                         |
|--------------|-------------------------------------|
| `npm start`  | Start the Express server            |
| `npm run dev`| Start with nodemon (auto-reload)    |

---

## 5. Environment Configuration

All sensitive credentials are managed via environment variables. A `.env` file is required in the `server/` directory. This file is excluded from version control via `.gitignore`.

### `.gitignore` Exclusions

```
node_modules/
.env
npm-debug.log*
dist/
```

### Required Environment Variables

| Variable        | Description                              | Example                  |
|-----------------|------------------------------------------|--------------------------|
| `AI_API_KEY`    | API key for the AI language model        | `sk-...`                 |
| `PORT`          | Port for the Express server              | `5000`                   |
| `CLIENT_URL`    | Allowed CORS origin (frontend URL)       | `http://localhost:3000`  |

### `.env` Template

```env
AI_API_KEY=your_ai_api_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## 6. Local Development Setup

### Step-by-Step

```bash
# 1. Clone the repo
git clone https://github.com/SHAC55/FinPilot-AI.git
cd FinPilot-AI

# 2. Set up and start the server
cd server
npm install
cp .env.example .env        # Edit this file with your API key
npm start

# 3. In a new terminal, set up and start the client
cd ../client
npm install
npm start
```

### Accessing the App

| Service | URL                        |
|---------|----------------------------|
| Client  | http://localhost:3000       |
| Server  | http://localhost:5000       |

### Common Issues

| Issue                        | Fix                                                         |
|------------------------------|-------------------------------------------------------------|
| `Cannot find module`         | Run `npm install` in both `client/` and `server/`           |
| `CORS error` in browser      | Ensure `CLIENT_URL` in `.env` matches your client port      |
| AI API not responding        | Verify `AI_API_KEY` is set correctly in `.env`              |
| Port conflict                | Change `PORT` in `.env` or kill the process using the port  |

---

## 7. Deployment

### Vercel (Live)

The project is live at **[finpilotai.vercel.app](https://finpilotai.vercel.app)**.

Vercel handles:
- Automatic builds on push to `main`
- Static hosting for the React client
- Serverless function support for the API (if configured as an API route)

### Deploying Your Own Instance

1. Fork the repository on GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Set the **root directory** to `client` for the frontend deployment
4. Add environment variables in the Vercel project settings (Settings → Environment Variables)
5. Trigger a deployment — Vercel auto-detects React and builds it

For the server, you can deploy to:
- **Vercel** (as a serverless API route)
- **Railway**, **Render**, or **Fly.io** (as a persistent Node.js server)
- **AWS Lambda / GCP Cloud Run** (container-based)

---

## 8. API Reference

> The following API endpoints are inferred from the project structure and common patterns. Verify against actual server route files.

### Base URL

```
http://localhost:5000/api        (local)
https://finpilotai.vercel.app/api (production)
```

### Endpoints

#### `POST /api/chat`

Send a user message and receive an AI-generated financial response.

**Request Body:**
```json
{
  "message": "How much should I save each month to reach $10,000 in a year?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "reply": "To save $10,000 in 12 months, you'd need to set aside approximately $834 per month..."
}
```

---

#### `GET /api/goals`

Retrieve all saved financial goals.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Emergency Fund",
    "targetAmount": 5000,
    "currentAmount": 1200,
    "completed": false
  }
]
```

---

#### `POST /api/goals`

Create a new financial goal.

**Request Body:**
```json
{
  "title": "Vacation Fund",
  "targetAmount": 3000
}
```

---

#### `PATCH /api/goals/:id`

Update progress or mark a goal as complete.

**Request Body:**
```json
{
  "currentAmount": 3000,
  "completed": true
}
```

---

## 9. Feature Breakdown

### AI Chat

The core feature. Users type financial questions in plain English and receive intelligent, personalized responses. The conversation history is maintained during the session to allow contextual follow-ups.

**Data flow:**
```
User types message
  → Client sends POST /api/chat with message + history
    → Server constructs prompt with system context
      → AI API returns response
        → Server returns reply to client
          → Client renders response in chat window
```

---

### Goal Tracker

Users can define personal finance goals (e.g., "Save $5,000 for emergency fund") and track progress toward them.

**Planned improvements (from Checklist.txt):**
- Add a "Completed" section to separate finished goals
- Split view between active and completed goals
- Improved UI and mobile responsiveness

---

### Responsive UI

The frontend is designed to work across screen sizes. Ongoing improvement of responsiveness is noted in the project's development checklist.

---

## 10. Development Checklist & Known TODOs

From the project's `Checklist.txt`:

| Task                                          | Status      |
|-----------------------------------------------|-------------|
| Add completed section in goal tracker         | 🔲 Pending  |
| Improve UI & responsiveness                   | 🔲 Pending  |
| Split completed goals view                    | 🔲 Pending  |

---

## 11. Contribution Guide

### Branching Strategy

```
main              → Production-ready code
feature/<name>    → New features
fix/<name>        → Bug fixes
chore/<name>      → Refactors, dependency updates
```

### Workflow

```bash
# 1. Create a branch
git checkout -b feature/goal-completed-section

# 2. Make changes, then commit
git add .
git commit -m "feat: add completed goals section"

# 3. Push and open a PR
git push origin feature/goal-completed-section
```

### Code Style

- JavaScript ES6+ (no TypeScript)
- Consistent use of `const`/`let` (avoid `var`)
- `async/await` preferred over `.then()` chains
- Env vars for all secrets — never hardcode keys

---

*Documentation generated from analysis of the [SHAC55/FinPilot-AI](https://github.com/SHAC55/FinPilot-AI) repository and deployed application at [finpilotai.vercel.app](https://finpilotai.vercel.app).*
