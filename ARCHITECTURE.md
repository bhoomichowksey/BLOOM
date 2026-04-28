# 🏗️ Bloom — System Architecture

## Overview

Bloom is a client-side React application deployed on Vercel, using Google Gemini for AI-powered wellness conversations and Supabase for authentication and data storage.

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│              USER (Browser)             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Bloom Frontend (React)          │
│         Deployed on Vercel              │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Cycle       │  │  Mood Tracker    │  │
│  │ Tracker     │  │  + Journal       │  │
│  └─────────────┘  └──────────────────┘  │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ AI Wellness │  │  User Auth &     │  │
│  │ Chat (Bloom)│  │  Profile         │  │
│  └──────┬──────┘  └────────┬─────────┘  │
└─────────┼───────────────────┼───────────┘
          │                   │
          ▼                   ▼
┌─────────────────┐  ┌────────────────────┐
│  Google Gemini  │  │     Supabase       │
│  API            │  │  (Auth + Database) │
│                 │  │                    │
│  - Empathetic   │  │  - User profiles   │
│    responses    │  │  - Cycle logs      │
│  - Health Q&A   │  │  - Mood entries    │
│  - Symptom      │  │  - Chat history    │
│    guidance     │  │                    │
└─────────────────┘  └────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Next.js | UI and routing |
| Styling | Tailwind CSS | Responsive design |
| AI Engine | Google Gemini API | Wellness chat companion |
| Auth | Supabase Auth | Secure user login |
| Database | Supabase (PostgreSQL) | Health data storage |
| Deployment | Vercel | Hosting and CI/CD |

---

## Google Technologies Used

| Technology | How Bloom Uses It |
|-----------|-------------------|
| **Google Gemini API** | Powers the AI wellness chat companion with empathetic, evidence-based responses |
| **Google Cloud Run** | Scalable serverless backend (planned for v2) |
| **Google Firebase** | Push notifications for cycle reminders (planned for v2) |

---

## Data Flow

1. User logs in via Supabase Auth
2. User inputs cycle/mood data → stored in Supabase DB
3. User sends message to Bloom AI → request sent to Gemini API
4. Gemini returns health guidance → displayed in chat UI
5. All personal data stays encrypted in Supabase

---

## SDG Alignment

- **SDG 3** — Good Health: AI-powered preventive health guidance
- **SDG 5** — Gender Equality: Built specifically for women's health needs  
- **SDG 10** — Reduced Inequalities: Free access to health information

---

*Team ALVORA | Google Solution Challenge 2026*
