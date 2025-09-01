# XPense

**A personal finance manager to track expenses, manage budgets, and gain insights into your spending.**

> Built with Node.js, TypeScript, MongoDB, React (Vite + TailwindCSS).

---

## Table of contents

* [About](#about)
* [Features](#features)
* [Tech stack](#tech-stack)
* [Project structure](#project-structure)
* [Getting started (local development)](#getting-started-local-development)
* [Environment variables](#environment-variables)
* [API examples](#api-examples)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [Roadmap](#roadmap)
* [License](#license)
* [Contact](#contact)

---

## About

XPense is a full‑stack personal finance application that helps users:

* Record and categorize expenses.
* Track budgets and savings goals.
* View analytics/dashboards to understand financial habits.

---

## Features

* 🔐 **Authentication**: JWT-based signup/login with bcrypt password hashing.
* 💸 **Expense management**: Add, edit, delete, and categorize transactions.
* 🎯 **Goals & budgets**: Create and track savings or spending goals.
* 📊 **Analytics dashboard**: Visualize expenses by category and time using Recharts.
* 📱 **Modern UI**: Responsive frontend built with React + TailwindCSS.

---

## Tech stack

* **Backend:** Node.js, Express, TypeScript, Mongoose
* **Frontend:** React (Vite), TailwindCSS, React Router, Recharts
* **Database:** MongoDB
* **Auth:** JSON Web Tokens (JWT), bcryptjs
* **Validation:** express-validator

---

## Project structure

```
Xpense/
├─ backend/         # Express + TypeScript API
│  ├─ src/
│  │  ├─ routes/   # auth.ts, transactions.ts, dashboard.ts, etc.
│  │  ├─ models/   # Mongoose schemas
│  │  ├─ controllers/
│  │  └─ index.ts  # app entry point
│  └─ package.json
│
├─ frontend/        # React + Vite app (UI)
│  ├─ src/
│  └─ package.json
│
├─ README.md
```

---

## Getting started (local development)

### Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB (local instance or Atlas)

### Steps

1. Clone the repo

```bash
git clone https://github.com/bhavyayay/Xpense.git
cd Xpense
```

2. Start the backend

```bash
cd backend
npm install
# create a .env file (see Environment variables)
npm run dev
```

3. Start the frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

4. Open the app

* Frontend: `http://localhost:5173` (Vite default)
* Backend API: `http://localhost:5000`

---

## Environment variables

Create a `.env` file in `backend/` with:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/xpense
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For the frontend (`frontend/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

---

## API examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane","email":"jane@example.com","password":"pass123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"pass123"}'
```

### Create an expense

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"category":"Food","date":"2025-06-01","notes":"Lunch"}'
```

---

## Deployment

* **Frontend:** Deploy on Vercel/Netlify.
* **Backend:** Deploy on Render/Heroku/AWS, connected to MongoDB Atlas.
* Update `VITE_API_URL` in frontend `.env` with your production backend URL.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/some-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push branch and open a Pull Request

---

## Roadmap

* 📅 Recurring transactions
* 📈 Predictive analytics (monthly spend forecast)
* 🌍 Multi-currency support
* 📑 Export reports (CSV, PDF)
* 📱 PWA support for mobile

---

## License

This project currently does not declare a license. 

---

## Contact

**Author:** Bhavya
GitHub: [@bhavyayay](https://github.com/bhavyayay)

---
