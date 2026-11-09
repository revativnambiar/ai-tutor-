import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Brain,
  BookOpen,
  Calendar,
  BarChart3,
  Award,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [analyticsRes, quizzesRes, plansRes] = await Promise.all([
          fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/quizzes/history', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/study-plans', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setStats(data.stats);
          setRecommendations(data.recommendations || []);
        }

        if (quizzesRes.ok) {
          const qData = await quizzesRes.json();
          setQuizzes(qData.quizzes || []);
        }

        if (plansRes.ok) {
          const pData = await plansRes.json();
          setPlans(pData.plans || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [token]);

  const activePlan = plans[0] || null;
  const streak = user?.streakDays || 7;
  const dailyGoal = user?.dailyGoalMinutes || 45;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. WELCOME BANNER & STREAK HEADER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>Personalized Learning Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
                Academic Stage: <span className="text-white font-semibold">{user?.academicLevel || 'Undergraduate'}</span> • 
                Target: <span className="text-white font-semibold">{user?.targetGoal || 'Academic Mastery'}</span>
              </p>
            </div>

            {/* Streak & Daily Goal Progress Widget */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-200 font-medium">Daily Streak</p>
                  <p className="text-xl font-extrabold text-white">{streak} Days 🔥</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <p className="text-xs text-purple-200 font-medium">Today's Goal</p>
                <p className="text-xs font-bold text-white mt-0.5">35 / {dailyGoal} mins</p>
                <div className="w-20 bg-white/20 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PROACTIVE AI RECOMMENDATIONS BANNER */}
        {recommendations.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-sky-50 to-indigo-50 border border-purple-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-purple-200/80 text-purple-800 px-2 py-0.5 rounded-full">
                    AI Diagnostic Alert
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {recommendations[0].title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {recommendations[0].description}
                </p>
              </div>
            </div>

            <Link
              to={recommendations[0].route}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <span>{recommendations[0].action}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3. PERFORMANCE SUMMARY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Accuracy</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats?.avgScore || 84}%
            </p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+6% this week</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quizzes Taken</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats?.quizzesTaken || quizzes.length || 12}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {stats?.topicsMastered || 18} Topics Mastered
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Studied</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats?.hoursStudied || 16.5} hrs
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Consistent pace
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weak Areas</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats?.weakAreas?.length || 2} Detected
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Remediation queued
            </p>
          </div>
        </div>

        {/* 4. MAIN WORKSPACE GRID: ACTIVE ROADMAP & QUICK LAUNCH ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Active Study Roadmap & Subject Proficiency */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Study Roadmap Card */}
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Study Roadmap</h3>
                  <p className="text-xs text-slate-500">
                    {activePlan?.title || 'Personalized AI Curriculum'}
                  </p>
                </div>
                <Link
                  to="/study-plan"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Overall Milestone Completion</span>
                  <span className="text-purple-700">{activePlan?.progress || 60}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${activePlan?.progress || 60}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-3 pt-2">
                {activePlan?.milestones?.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                      m.completed ? 'bg-purple-50/50 border-purple-100' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${m.completed ? 'text-purple-950 line-through opacity-80' : 'text-slate-900'}`}>
                        Week {m.week}: {m.title}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quizzes & Performance History */}
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Quiz Diagnostics</h3>
                  <p className="text-xs text-slate-500">Real-time adaptive assessment feedback</p>
                </div>
                <Link
                  to="/quizzes"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>New Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {quizzes.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No quizzes completed yet. Take your first quiz to generate diagnostics!</p>
                ) : (
                  quizzes.slice(0, 3).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-200/80 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900">{quiz.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {quiz.subject} • Difficulty: {quiz.difficulty}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            quiz.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : quiz.percentage >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {quiz.score}/{quiz.maxScore} ({quiz.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Quick AI Launcher & Weak Area Diagnostics */}
          <div className="space-y-6">
            {/* Quick Action Hub */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
                Quick Action Hub
              </h3>

              <div className="space-y-2.5">
                <Link
                  to="/ai-tutor"
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-purple-100/50 border border-purple-100 shadow-sm flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Chat with AI Tutor</p>
                      <p className="text-[11px] text-slate-500">Socratic guidance & help</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/quizzes"
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-sky-50 border border-purple-100 shadow-sm flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700">Generate Smart Quiz</p>
                      <p className="text-[11px] text-slate-500">Adaptive concept test</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/resources"
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-purple-100 shadow-sm flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Notes & Flashcards</p>
                      <p className="text-[11px] text-slate-500">Spaced repetition review</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* Identified Weak Areas Diagnostic */}
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Concept Mastery Alerts</h3>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Adaptive
                </span>
              </div>

              <div className="space-y-3">
                {stats?.weakAreas?.length ? (
                  stats.weakAreas.map((w, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{w.topic}</span>
                        <span className="text-[11px] font-semibold text-rose-600">{w.confidence}% Confidence</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${w.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-500">Subject: {w.subject}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-2">All concepts currently at optimal confidence!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

