# EDUORA – Your Personal AI Learning Companion

> **College Micro-Project:** "AI Tutoring Assistant for Personalized Learning"  
> **Industry:** EdTech & Artificial Intelligence  
> **Tagline:** *"Your Learning. Your Pace. Your Future."*

---

## 🌟 Executive Summary

**EDUORA** is a modern, premium, full-stack AI-powered EdTech web application engineered to solve the "one-size-fits-all" limitation of traditional learning platforms. By dynamically adapting to each student's academic level, learning pace, subject proficiency, and cognitive style, EDUORA delivers an individualized educational experience powered by conversational AI tutoring, adaptive diagnostics, and automated curriculum planning.

---

## 🚀 Live Access & Quick Start

The platform is running live on:
**[http://localhost:8080](http://localhost:8080)**

### Instant Evaluation (1-Click Demo)
- You can test the platform instantly by clicking **"1-Click Student Demo"** on the Homepage or Login page.
- **Pre-seeded Demo Student Profile:**
  - **Name:** Alex Rivera
  - **Email:** `alex.rivera@eduora.ai`
  - **Password:** `password123`
  - **Academic Stage:** Undergraduate (Computer Science & AI)
  - **Streak:** 7 Days 🔥 | **Avg Accuracy:** 84%

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **Routing & State:** React Router DOM v6, React Context API (`AuthContext`).
- **Backend API:** Node.js, Express.js (RESTful API).
- **Security & Session:** JSON Web Tokens (JWT), BCrypt password hashing.
- **Database:** Persistent structured database engine (`server/data/eduora_db.json`) with automated seeding and isolation per student.
- **AI Intelligence Layer:** Dual-Engine Architecture:
  1. **Eduora Built-in Adaptive Knowledge Engine:** Works 100% offline with zero dependencies or API keys needed. Supports Socratic dialogue, intuitive analogies (ELI5), code & math derivations, and exam prep summaries across 100+ topics.
  2. **Google Gemini Live AI Integration:** Supports optional student/evaluator Gemini API keys configured via the Settings panel or `GEMINI_API_KEY` environment variable.

---

## 📚 Core Modules & Features

### 1. Brand Identity & Design
- Premium SaaS design language tailored for modern EdTech.
- Elegant soft lavender (`#FAF7FD`, `#F4F0FF`), light blue (`#E0F2FE`), and deep navy text (`#0F172A`).
- Original EDUORA geometric logo representing intelligence, growth, and knowledge.
- Subtle hover animations, rounded cards (`rounded-3xl`), and soft shadows.

### 2. Comprehensive Landing Page
- **Navigation Bar:** Brand wordmark, navigation links (Home, Features, How It Works, About), Student Login, and Get Started CTA.
- **Hero Section:** "Learn Smarter. Grow Faster." heading, value proposition, CTA buttons, and an interactive simulated AI tutor preview card.
- **How It Works:** 3-step pedagogical process (1. Tell us your goals, 2. Learn with your AI tutor, 3. Track progress and improve).
- **Core Feature Highlights:** AI Personal Tutor, Adaptive Learning, Smart Quiz Generator, Personalized Study Plans, Performance Analytics, and Intelligent Recommendations.
- **Why Choose EDUORA?:** Direct comparison between traditional static platforms and EDUORA's adaptive AI tutoring.
- **Demonstrated Learning Statistics:** Illustrative demo figures (94% retention, 2.4x faster mastery, 50k+ quizzes solved, 4.9/5 rating).
- **Sample Student Testimonials:** Realistically framed student reviews from CS, Pre-Med, and Engineering majors.
- **Call-to-Action:** Direct registration link and 1-click evaluation access.
- **Professional Footer:** Attribution, domain links, micro-project note, and contact email.

### 3. Authentication & Security
- Complete registration page with academic level selector and multi-subject interest tags.
- Secure login with JWT issuance, "Remember Me" extended sessions, password visibility toggles, and simulated forgot-password recovery.
- Strict password hashing with `bcryptjs`.
- Protected client-side routes with graceful redirection.

### 4. Student Onboarding Wizard
- 3-step interactive onboarding flow:
  1. Academic Stage & Specific Term Target.
  2. Subject Selection & Baseline Knowledge Depth (Beginner, Intermediate, Advanced).
  3. Preferred Cognitive Learning Style & Daily Study Time Target (15, 30, 45, 60+ mins).
- Automatic synthesis of an initial personalized 4-week study plan upon completion!

### 5. Personalized Student Dashboard
- Dynamic welcome banner with personalized greeting, academic level, and goal.
- Real-time **Learning Streak** widget (7 days 🔥) and daily study minute tracker.
- **AI Diagnostic Alert Banner:** Flags weak concepts with 1-click remediation actions.
- KPI summary cards (Average accuracy, quizzes taken, hours studied, weak areas).
- Active study roadmap preview with interactive completion percentage.
- Recent quiz diagnostics table and quick-action hub.

### 6. Interactive AI Personal Tutor
- **4 Dedicated Tutoring Modes:**
  - **Socratic Tutor:** Employs first-principles questioning and subtle hints to develop critical thinking.
  - **Intuitive Explainer:** Delivers relatable everyday analogies and structured ELI5 breakdowns.
  - **Code & Math:** Provides algorithmic code templates, Big-O complexity bounds, and step-by-step mathematical formulas.
  - **Exam Prep Coach:** Highlights scoring criteria, common exam pitfalls, and rapid memory mnemonics.
- Quick starter prompt pills for instant exploration.
- **Speech Audio Readout:** Text-to-Speech playback for audible learners.
- **Save to Notebook:** 1-click action saving any explanation directly into the student's personal notes.

### 7. Smart Adaptive Quiz Generator
- Generates dynamic 5-question quizzes for any subject, topic, and difficulty.
- Real-time countdown timer per question.
- Instant pedagogical rationale explaining why the correct choice is right and why distractors are wrong.
- Automatic calculation of score, accuracy rate, and weak area logging.
- Celebratory confetti on high scores (>= 80%).
- Complete quiz history review table.

### 8. Personalized Study Planner & Roadmaps
- Multi-week structured roadmaps with actionable weekly milestones.
- Interactive checkboxes that allow students to check off completed milestones.
- Dynamic roadmap generator for custom exams and timelines.

### 9. Performance Analytics & Diagnostic Matrix
- Subject proficiency breakdown with animated progress bars (AI, DSA, Linear Algebra, Web Engineering).
- Weak Area Diagnostic Matrix showing concept-level confidence percentages and direct remediation buttons.
- Earned academic milestone badges (Streak Champion, Socratic Thinker, Perfect 100%).

### 10. Student Resource Library & Flashcards
- Spaced-repetition flip cards with smooth flip animations and "Mark as Mastered" tracking.
- Create custom flashcards for any subject.
- Integrated Student Notebook for managing personal notes.

---

## 💻 Commands Reference

- `npm run start` - Launches the production server serving both API and React frontend on port 5000.
- `npm run dev` - Runs Express backend and Vite development server concurrently with hot reloading.
- `npm run build` - Builds production bundle using Vite and Tailwind CSS.
- `npm run server` - Runs the backend API server independently.

---
*Created as an advanced college micro-project under the EdTech & Applied AI domain.*

