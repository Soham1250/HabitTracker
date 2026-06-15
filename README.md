<div align="center">

# ⚔️ Daily Execution Protocol

**A mobile-first, zero-friction habit tracker built for relentless execution.**

[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

</div>

---

## 🔥 Overview

This isn't just a habit tracker—it's a system designed to keep you accountable. With a dark, utilitarian interface, it strips away the noise and focuses entirely on the daily grind. Built for cross-platform usage, your streak and history sync instantly across your phone and PC via MongoDB.

### 🌟 Key Features

*   **📱 Mobile-First Design**: Looks and feels like a native app.
*   **☁️ Cross-Platform Sync**: Backed by an Express API and MongoDB Atlas, meaning your data follows you anywhere.
*   **⏳ The Death Clock**: A visceral countdown to midnight that shifts from green to pulsing red as time runs out.
*   **🏅 Milestone Badges**: Unlock exclusive badges as your streak grows (7, 30, 100 days, etc.).
*   **🔥 GitHub-Style Heatmap**: Visualize your long-term consistency at a glance.
*   **📜 Quote of the Day**: Start your day with curated wisdom from history's greatest minds.
*   **💾 Offline Resiliency**: Instantly falls back to local storage if the database is unreachable, and provides JSON backup exports.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS v4
*   **Backend**: Node.js, Express
*   **Database**: MongoDB
*   **State Management**: Custom React Hooks

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Soham1250/HabitTracker.git
cd HabitTracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=habit-tracker
```

### 4. Run the application
Start both the Vite frontend and the Express backend simultaneously:
```bash
npm run dev
```

Your app will be live at `http://localhost:5173`.

---

<div align="center">
  <p><i>"Hold the line. The streak doesn't build itself."</i></p>
</div>
