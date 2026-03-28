# FinPilot AI 🚀

> An AI-powered personal finance assistant — your intelligent co-pilot for money management.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-finpilotai.vercel.app-brightgreen)](https://finpilotai.vercel.app)
[![Tech](https://img.shields.io/badge/Stack-JavaScript%20%7C%20Node.js%20%7C%20React-blue)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

---

## 📖 Overview

**FinPilot AI** is a full-stack web application that brings the power of AI to personal finance. Through a clean, conversational chat interface, users can ask questions about budgeting, investments, savings goals, and more — and receive intelligent, contextual responses in real time.

The project is deployed on [Vercel](https://finpilotai.vercel.app) and structured as a monorepo with separate `client` and `server` directories.

---

## ✨ Features

- 💬 **AI Chat Interface** — Conversational UI for natural language finance queries
- 🎯 **Goal Tracking** — Set and monitor personal finance goals (savings, debt payoff, investments)
- 📊 **Financial Insights** — Get actionable suggestions powered by AI
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile
- ⚡ **Real-time Responses** — Fast, streamed AI replies
- 🔒 **Secure Config** — Environment-based secrets management (`.env`)

---

## 🗂️ Project Structure

```
FinPilot-AI/
├── client/          # Frontend — React application (deployed on Vercel)
│   └── src/
├── server/          # Backend — Node.js/Express API server
│   └── index.js
├── .gitignore
├── Checklist.txt    # Development task tracker
└── README.md
```

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, JavaScript, CSS              |
| Backend   | Node.js, Express                    |
| AI        | LLM API integration (server-side)   |
| Deployment| Vercel (client + serverless)        |
| Config    | `.env` for secrets management       |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- An AI API key (configured via `.env`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SHAC55/FinPilot-AI.git
cd FinPilot-AI
```

#### Start the Backend Server

```bash
cd server
npm install
# Create your environment file
cp .env.example .env   # then fill in your API keys
npm start
```

#### Start the Frontend Client

```bash
cd client
npm install
npm start
```

The app will be available at `http://localhost:3000` (client) and the API server at `http://localhost:5000` (or whichever port is configured).

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
# AI Provider API Key
AI_API_KEY=your_api_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🌐 Deployment

The project is deployed on **Vercel**. The frontend client is served as a static/SPA build, and the server runs as a serverless function or separate service.

To deploy your own instance:

1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Set your environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects the project and builds it

---

## 📋 Roadmap

- [x] AI chat interface
- [x] Finance goal creation
- [ ] Completed goals section
- [ ] Improved UI & responsiveness
- [ ] Split view for completed vs active goals

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for details.

---

## 🔗 Links

- **Live App:** [finpilotai.vercel.app](https://finpilotai.vercel.app)
- **Repository:** [github.com/SHAC55/FinPilot-AI](https://github.com/SHAC55/FinPilot-AI)
