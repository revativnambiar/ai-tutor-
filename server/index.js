import express from 'express';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import {
  askAITutor,
  generateQuizForTopic,
  generateStudyPlan,
  generateRecommendations
} from './aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'eduora-super-secret-jwt-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ----------------------------------------------------

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, confirmPassword, academicLevel, preferredSubjects } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    academicLevel: academicLevel || 'Undergraduate',
    preferredSubjects: preferredSubjects || ['Computer Science'],
    targetGoal: '',
    knowledgeLevel: 'Beginner',
    learningStyle: 'Step-by-step with practical challenges',
    dailyGoalMinutes: 30,
    streakDays: 1,
    totalStudyMinutes: 0,
    createdAt: new Date().toISOString(),
    onboarded: false,
    stats: {
      quizzesTaken: 0,
      avgScore: 0,
      topicsMastered: 0,
      hoursStudied: 0,
      accuracyRate: 0,
      subjectProficiency: {},
      weakAreas: []
    }
  };

  db.createUser(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  // Exclude password from response
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: 'Registration successful',
    token,
    user: userWithoutPassword
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const expiresIn = rememberMe ? '30d' : '7d';
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn });

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
});

// Demo Login (One-click instant login for evaluators / testing)
app.post('/api/auth/demo-login', (req, res) => {
  const user = db.findUserByEmail('alex.rivera@eduora.ai');
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found in database' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Logged in as Demo Student: Alex Rivera',
    token,
    user: userWithoutPassword
  });
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// Forgot Password simulation
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }
  res.json({
    message: 'Password reset link sent! Check your inbox (or use "password123" for demo accounts).'
  });
});

// ----------------------------------------------------
// 2. STUDENT ONBOARDING ROUTE
// ----------------------------------------------------
app.post('/api/onboarding', authenticateToken, (req, res) => {
  const {
    academicLevel,
    targetGoal,
    preferredSubjects,
    knowledgeLevel,
    learningStyle,
    dailyGoalMinutes
  } = req.body;

  const updates = {
    academicLevel: academicLevel || req.user.academicLevel,
    targetGoal: targetGoal || 'Excel in academics and build mastery',
    preferredSubjects: preferredSubjects || req.user.preferredSubjects,
    knowledgeLevel: knowledgeLevel || 'Intermediate',
    learningStyle: learningStyle || 'Conceptual with practice',
    dailyGoalMinutes: parseInt(dailyGoalMinutes) || 30,
    onboarded: true
  };

  const updatedUser = db.updateUser(req.user.id, updates);

  // Generate an initial personalized study roadmap for the user's top subject
  const mainSubject = updates.preferredSubjects[0] || 'Computer Science';
  const initialPlan = generateStudyPlan({
    subject: mainSubject,
    goal: updates.targetGoal,
    targetWeeks: 4,
    knowledgeLevel: updates.knowledgeLevel
  });
  initialPlan.userId = req.user.id;
  db.saveStudyPlan(initialPlan);

  const { password: _, ...cleanUser } = updatedUser;
  res.json({
    message: 'Onboarding completed successfully!',
    user: cleanUser,
    initialPlan
  });
});

// ----------------------------------------------------
// 3. AI PERSONAL TUTOR CHAT ROUTE
// ----------------------------------------------------
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, subject, mode, apiKey } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const aiResponse = await askAITutor({
      message,
      subject: subject || req.user.preferredSubjects?.[0] || 'Academics',
      mode: mode || 'explainer',
      studentContext: req.user,
      apiKey: apiKey || ''
    });

    res.json(aiResponse);
  } catch (err) {
    console.error('AI Tutor error:', err);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// ----------------------------------------------------
// 4. QUIZZES & ADAPTIVE ASSESSMENT ROUTES
// ----------------------------------------------------

// Generate dynamic quiz
app.post('/api/quizzes/generate', authenticateToken, (req, res) => {
  const { subject, topic, difficulty } = req.body;
  const quiz = generateQuizForTopic({
    subject: subject || req.user.preferredSubjects?.[0] || 'Artificial Intelligence',
    topic: topic || 'Core Fundamentals',
    difficulty: difficulty || 'Intermediate'
  });
  res.json(quiz);
});

// Submit quiz result
app.post('/api/quizzes/submit', authenticateToken, (req, res) => {
  const { title, subject, difficulty, score, totalQuestions, answers, weakAreasIdentified } = req.body;

  const percentage = Math.round((score / totalQuestions) * 100);

  const quizRecord = {
    id: `quiz-${Date.now()}`,
    userId: req.user.id,
    title: title || `${subject} Quiz`,
    subject: subject || 'General',
    difficulty: difficulty || 'Intermediate',
    totalQuestions,
    score,
    maxScore: totalQuestions,
    percentage,
    completedAt: new Date().toISOString(),
    answers: answers || [],
    weakAreasIdentified: weakAreasIdentified || []
  };

  const savedQuiz = db.saveQuiz(quizRecord);
  const updatedUser = db.findUserById(req.user.id);
  const { password: _, ...cleanUser } = updatedUser;

  res.json({
    message: 'Quiz result submitted successfully',
    quiz: savedQuiz,
    user: cleanUser
  });
});

// Get user quiz history
app.get('/api/quizzes/history', authenticateToken, (req, res) => {
  const quizzes = db.getQuizzesByUser(req.user.id);
  res.json({ quizzes });
});

// ----------------------------------------------------
// 5. STUDY PLANS & ROADMAPS
// ----------------------------------------------------
app.get('/api/study-plans', authenticateToken, (req, res) => {
  const plans = db.getStudyPlansByUser(req.user.id);
  res.json({ plans });
});

app.post('/api/study-plans/generate', authenticateToken, (req, res) => {
  const { subject, goal, targetWeeks } = req.body;
  const plan = generateStudyPlan({
    subject: subject || 'Computer Science',
    goal: goal || 'Achieve conceptual mastery',
    targetWeeks: targetWeeks || 4,
    knowledgeLevel: req.user.knowledgeLevel || 'Intermediate'
  });
  plan.userId = req.user.id;
  db.saveStudyPlan(plan);
  res.status(201).json({ message: 'Study plan generated', plan });
});

app.put('/api/study-plans/:id/milestones/:milestoneId', authenticateToken, (req, res) => {
  const { id, milestoneId } = req.params;
  const plans = db.getStudyPlansByUser(req.user.id);
  const plan = plans.find(p => p.id === id);

  if (!plan) {
    return res.status(404).json({ error: 'Study plan not found' });
  }

  const milestone = plan.milestones.find(m => m.id === milestoneId);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  milestone.completed = !milestone.completed;
  const completedCount = plan.milestones.filter(m => m.completed).length;
  plan.progress = Math.round((completedCount / plan.milestones.length) * 100);

  db.updateStudyPlan(id, plan);
  res.json({ message: 'Milestone updated', plan });
});

// ----------------------------------------------------
// 6. PERFORMANCE ANALYTICS & RECOMMENDATIONS
// ----------------------------------------------------
app.get('/api/analytics', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  const quizzes = db.getQuizzesByUser(req.user.id);
  const recommendations = generateRecommendations(user);

  res.json({
    stats: user.stats,
    streakDays: user.streakDays,
    dailyGoalMinutes: user.dailyGoalMinutes,
    totalStudyMinutes: user.totalStudyMinutes,
    recentQuizzes: quizzes.slice(0, 5),
    recommendations
  });
});

// ----------------------------------------------------
// 7. STUDENT NOTES & FLASHCARDS
// ----------------------------------------------------
app.get('/api/notes', authenticateToken, (req, res) => {
  const notes = db.getNotesByUser(req.user.id);
  res.json({ notes });
});

app.post('/api/notes', authenticateToken, (req, res) => {
  const { title, subject, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    userId: req.user.id,
    title,
    subject: subject || 'General',
    content,
    updatedAt: new Date().toISOString()
  };

  db.saveNote(newNote);
  res.status(201).json({ message: 'Note saved', note: newNote });
});

app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  const success = db.deleteNote(req.params.id, req.user.id);
  if (!success) {
    return res.status(404).json({ error: 'Note not found or unauthorized' });
  }
  res.json({ message: 'Note deleted' });
});

app.get('/api/flashcards', authenticateToken, (req, res) => {
  const { subject } = req.query;
  const flashcards = db.getFlashcardsByUser(req.user.id, subject);
  res.json({ flashcards });
});

app.post('/api/flashcards', authenticateToken, (req, res) => {
  const { subject, question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  const newCard = {
    id: `fc-${Date.now()}`,
    userId: req.user.id,
    subject: subject || 'General',
    question,
    answer,
    mastered: false
  };

  db.saveFlashcard(newCard);
  res.status(201).json({ message: 'Flashcard created', flashcard: newCard });
});

app.post('/api/flashcards/:id/toggle', authenticateToken, (req, res) => {
  const updated = db.toggleFlashcardMastery(req.params.id, req.user.id);
  if (!updated) {
    return res.status(404).json({ error: 'Flashcard not found' });
  }
  res.json({ message: 'Flashcard status updated', flashcard: updated });
});

// ----------------------------------------------------
// 8. STATIC ASSETS & PRODUCTION SERVING
// ----------------------------------------------------
const distPath = path.join(__dirname, '..', 'dist');
const rootPath = path.join(__dirname, '..');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(rootPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(rootPath, 'index.html');
  res.sendFile(indexPath);
});

// Start Server in non-serverless environments
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 EDUORA Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  });
}

export default app;
export { app };

