 FinPilot – Smart Finance Management Platform
 
-> Overview
FinPilot is a full-stack finance management application that helps users track expenses, manage wallets, split bills, and gain AI-powered financial insights. It provides a modern dashboard with analytics, goal tracking, and transaction management.

✨ Features
📊 Interactive dashboard with charts & analytics
💸 Expense & income tracking
👛 Multi-wallet management system
🤝 Split bills with friends
🎯 Financial goal tracking
🧠 AI-powered financial insights
🔔 Reminder system for payments
📒 Ledger system for transaction history


🛠️ Tech Stack

-> Frontend
React.js
Tailwind CSS
Chart libraries (Recharts / Chart.js)

-> Backend
Node.js
Express.js

-> Database
MongoDB

-> Authentication
JWT (JSON Web Token)

-> Deployment
Frontend: Vercel
Backend: Render

🧠 System Architecture
Client (React)
      ↓
API Server (Express)
      ↓
Database (MongoDB)

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/finpilot.git
2. cd finpilot
3. Install dependencies

-> Frontend
cd client
npm install
npm run dev

-> Backend
cd server
npm install
npm run server

🔐 Environment Variables

Create a .env file in backend:

PORT = PORT.NO
MONGO_URI= YOUR_MONGO_URI
JWT_SECRET= YOUR_JWT_SECRET
GEMINI_API_KEY= YOUR_GEMINI_KEY
EMAIL_USER= YOUR_EMAILJS_GMAIL
EMAIL_PASS= YOUR_EMAILJS_PASS
SESSION_SECRET= YOUR_SECRET
FRONTEND_URL= YOUR_FE_URL


Frontend .env:

VITE_API_BASE_URL=http://localhost:5000/api

1. Auth Routes

POST /api/auth/register → Register user
POST /api/auth/login → Login user
GET /api/auth/searchuser → Search user (Protected)
POST /api/auth/verify-otp → Verify OTP
POST /api/auth/forgot-password → Forgot password
POST /api/auth/reset-password/ → Reset password

2. AI Routes

POST /api/ai/analyze-expenses → Analyze expenses (Protected)
POST /api/ai/goal → Analyze goal (Protected)

3. Transaction Routes

POST /api/transaction/add-transaction → Add transaction (Protected)
GET /api/transaction/get-expenses → Get all transactions (Protected)
DELETE /api/transaction/delete-expense/ → Delete transaction (Protected)

4. Wallet Routes

POST /api/wallet/create → Create wallet (Protected)
GET /api/wallet/allwallets → Get wallets (Protected)
GET /api/wallet/ → Get wallet by ID (Protected)
PUT /api/wallet/ → Update wallet (Protected)
DELETE /api/wallet/ → Delete wallet (Protected)
GET /api/wallet/transactions/ → Get wallet transactions (Protected)

5. Goals Routes

POST /api/goals/add-goal → Create financial goal (Protected)
GET /api/goals/getallgoals → Fetch goals (Protected)
DELETE /api/goals/delete-goal/ → Delete goal (Protected)
PATCH /api/goals/addfund/ → Add funds to goal (Protected)

6. Ledger Routes

POST /api/ledger/add → Add ledger entry (Protected)
GET /api/ledger → Get ledger (Protected)
DELETE /api/ledger/delete/ → Delete ledger entry (Protected)
PATCH /api/ledger/complete/ → Mark as completed (Protected)

7. Split Bill Routes

POST /api/splitbill/create → Create bill (Protected)
POST /api/splitbill/settle → Settle payment (Protected)
GET /api/splitbill → Get all bills (Protected)
PUT /api/splitbill/update/ → Update bill (Protected)
DELETE /api/splitbill/ → Delete bill (Protected)

🔐 Auth Note

All protected routes require:
Authorization: Bearer

🌐 Live Demo: https://finpilotai.vercel.app/

📈 Future Improvements
 Manage trip & travel  finance
 Mobile app version
 Real-time notifications
 Advanced AI analytics
 Multi-currency support


LinkedIn: linkedin.com/in/shac55
