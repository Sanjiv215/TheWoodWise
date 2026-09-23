# 🛋️ The WoodWise: Furniture E-Commerce Platform

[![React](https://img.shields.io/badge/React-18-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Native_Driver-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

The WoodWise is a modern full-stack furniture e-commerce web application built with **React**, **Node.js**, **Express**, and **MongoDB**. It delivers an end-to-end shopping experience featuring OTP-based email authentication, session-token security, search with multi-criteria filtering, wishlist management, cart checkout, and order history.

---

## ✨ Features

- 🔐 **Authentication & Security**:
  - Email signup and login with hashed OTP verification.
  - Database-backed session token management with MongoDB TTL automatic expiration.
  - Password reset with secure OTP verification and `bcrypt` hashing.
- 🛍️ **E-Commerce Core**:
  - Interactive catalog with real-time text search, category filters, price sorting, and pagination.
  - Detailed product views with dynamic similar product recommendations.
  - Full-featured shopping cart (quantity adjustments, price calculation) and wishlist.
  - Order creation and order history tracking.
- 👤 **Account Management**:
  - User profile updates and account deletion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Routing**: React Router
- **Networking**: Axios
- **Styling**: Modular CSS

### Backend & Database
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Native Driver with TTL Indexes)
- **Security**: `bcrypt`, Node `crypto` module
- **Mailing**: `nodemailer`
- **Environment**: `dotenv`

---

## 📂 Project Structure

```text
TheWoodWise/
├── backend/
│   ├── data/
│   │   └── products.json
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── LICENSE
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Sanjiv215/TheWoodWise.git
cd TheWoodWise
```

### 2. Backend Configuration & Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and SMTP credentials
npm start
```
*Backend runs at `http://localhost:5000`.*

### 3. Frontend Configuration & Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔒 Security Architecture

- **Session Tokens**: Created via `crypto.randomBytes(32)` stored in MongoDB `sessions` with TTL expiration indexes.
- **Password Protection**: Passwords and OTPs are hashed with salt rounds using `bcrypt`.
- **Protected Middleware**: Express `requireUser` guard validates session headers on restricted endpoints.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 Sanjiv Prasad.
