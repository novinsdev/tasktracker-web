# Task & Time Tracker — Frontend

A lightweight, engineer-oriented web interface designed to interact with the Task & Time Tracker backend service.  
Built with modern frontend technologies, this UI provides a clean and structured experience for managing projects, tasks, and time entries.

---

## 📝 Overview

This frontend application serves as the presentation layer for the Task & Time Tracker system.  
It allows users to:

- Create and manage **projects**
- Add and track **tasks** within each project
- Log **time entries** against tasks including dates and hours
- Interact seamlessly with REST API endpoints exposed by the backend

Designed with clarity, maintainability, and developer-first workflow in mind.

---

## 🚀 Tech Stack

| Category        | Technology |
|----------------|------------|
| Framework      | Next.js (App Router) |
| Language       | TypeScript |
| UI Styling     | TailwindCSS v4 |
| Design Approach | Component-based UI (Card + Button + Layout Shell) |
| Deployment Target | Vercel (recommended) |

---

## 📂 Project Structure

src/

 ├── app/

 │   ├── page.tsx                 # Overview / Landing

 │   ├── projects/                # Projects list + detail pages

 │   ├── tasks/                   # Task + time entry flows

 │   └── layout.tsx               # Global layout shell

 │
 
 ├── components/
 │   └── ui/
 │       ├── button.tsx
 │       ├── card.tsx
 │       └── page-shell.tsx
 │
 ├── lib/
 │   ├── api.ts                   # REST fetch wrapper
 │   └── types.ts                 # Shared interfaces
 │
 ├── app/globals.css              # Tailwind & global styles
 └── tailwind.config.js           # Tailwind v4 config

---

## 🏃 Running the Application

Install dependencies:
npm install

Start development:
npm run dev

Build for production:
npm run build

Run production:
npm start

App will be available at:
http://localhost:3000

---

## 📌 What This Project Demonstrates

✔ Modern Next.js App Router architecture  
✔ TailwindCSS v4 global theming + component styling  
✔ Clean UI with reusable Button, Card, and PageShell components  
✔ Integration with REST API (Projects → Tasks → Time Entries)  
✔ Practical frontend for real workflow + portfolio display  

---

## 🔐 License & Usage Notice

This project is shared publicly to showcase learning, craftsmanship, and technical capabilities.

While the repository is accessible, the source code and all associated materials remain the intellectual property of the author.

To maintain the integrity of this work, please refrain from reusing the code directly in other projects or redistributing it in any form.
If you wish to reference the project, linking to the repository is warmly appreciated.

Thank you for respecting the spirit in which this work is made available.

---
