# The WoodWise

The WoodWise is a full-stack furniture e-commerce web application built with React, Node.js, Express, and MongoDB. It lets users browse furniture products, manage wishlist and cart items, place demo orders, update profile details, reset passwords with OTP, and delete their account.

## Features

- User signup with email OTP verification
- Login and logout with session-token authentication
- Forgot password and reset password using OTP
- Product listing, search, filters, sorting, pagination, and product details
- Similar product suggestions
- Wishlist management
- Cart management with quantity updates
- Checkout and order history
- Profile section with name update
- Account deletion
- Responsive React UI

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Axios
- CSS

**Backend**

- Node.js
- Express.js
- MongoDB native driver
- bcrypt
- nodemailer
- dotenv
- Node.js crypto module

**Database**

- MongoDB

## Project Structure

```txt
TheWoodWise copy/
├── backend/
│   ├── data/
│   │   └── products.json
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
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Environment Variables

Create your own local `.env` files when running the project. These files are ignored by Git and should not be uploaded to GitHub.

Backend variables used by the project:

```txt
MONGO_URI=your_mongodb_connection_string
DB_NAME=thewoodwise
PORT=5000
SMTP_USER=your_email_address
SMTP_PASS=your_email_app_password
SMTP_FROM=TheWoodWise <your_email_address>
```

Frontend variable:

```txt
VITE_API_URL=/api
```

In development, Vite proxies `/api` requests to the backend server.

## Run The Project

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Build Frontend

```bash
cd frontend
npm run build
```

## Authentication

This project does not use JWT. It uses a database-backed session token system.

When a user logs in, the backend creates a random token using Node.js `crypto.randomBytes`, stores it in the MongoDB `sessions` collection, and sends it to the frontend. The frontend stores the token locally and sends it in the `Authorization` header for protected API requests.

Protected routes use the custom `requireUser` middleware in `backend/server.js`.

## Middleware Used

- `express.json()` parses JSON request bodies.
- `express.static()` serves image files.
- `api()` is a custom async error wrapper.
- `requireUser` is a custom authentication middleware.
- Final error-handling middleware returns a clean server error response.

## CRUD Coverage

- **Create:** signup, OTP records, orders, sessions
- **Read:** products, product details, account data, orders
- **Update:** profile name, cart quantity, account order data, password reset
- **Delete:** logout session, account deletion

## Important Notes

- Passwords are hashed using `bcrypt`.
- OTPs are hashed before storing in MongoDB.
- Session tokens expire automatically through a MongoDB TTL index.
- `.env` and `.env.example` files are ignored and should not be pushed to GitHub.

