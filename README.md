⭐ Store Rating Web Application

A full-stack web application where Users can rate stores, Owners can manage their stores, and Admins can manage users and stores.

🚀 Tech Stack

Frontend: React JS
Backend: Node.js + Express
Database: SQLite 
Auth: JWT (JSON Web Token)

🔗 Project Links
Frontend GitHub Repo: https://github.com/yashwanth843/store-frontend

Backend GitHub Repo: https://github.com/yashwanth843/StoreProject-Backend

Live Frontend Deployment: https://store-rating-rating-project.netlify.app

✅ Default Admin Login

Use the following credentials to log in as the admin:


  Email: "admin@example.com",
  Password: "Admin@123"


✅ Features
👤 User

Login / Signup

View all stores

Submit & update ratings (1–5)

Update password

🏪 Store Owner

Dashboard to manage own stores

View ratings

🛠 Admin

Add stores

Add users

View all stores

View all users

Delete entries

📦 Folder Structure
root/
│
├── frontend/    # React App
├── backend/     # Node/Express API
└── README.md

⚙️ Backend Setup (Local)
cd backend
npm install
npm start


Server runs on: http://localhost:3000

Make sure your database is configured SQLite.

🖥 Frontend Setup (Local)
cd frontend
npm install
npm start




🔐 Authentication

JWT stored in cookies (token, role)

Role-based rendering in App.js

📌 API Endpoints (Sample)
Auth
POST /api/auth/signup
POST /api/auth/login

Stores
GET /api/stores
POST /api/stores      (Admin/Owner)

Ratings
POST /api/ratings

Users
GET /api/users             (Admin)
POST /api/users/update-password

