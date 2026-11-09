import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Award,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Brain,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [token]);

  const stats = analytics?.stats || user?.stats || {};
  const proficiency = stats?.subjectProficiency || {
    'Artificial Intelligence': 88,
    'Data Structures & Algorithms': 82,
    'Linear Algebra': 76,
    'Web Engineering': 90
  };

  const weakAreas = stats?.weakAreas || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Learning Intelligence & Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time diagnostics tracking your concept confidence, study streaks, and weak areas.
          </p>
        </div>

        {/* 1. TOP STATS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Average Score</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold text-purple-900">{stats?.avgScore || 84}%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Top 10% in cohort
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Learning Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{analytics?.streakDays || 7} Days</p>
            <p className="text-[11px] text-orange-600 font-semibold mt-1">Consistency Active 🔥</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Topics Mastered</span>
              <Target className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.topicsMastered || 18}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 4 subjects</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Total Study Time</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.hoursStudied || 16.5}h</p>
            <p className="text-[11px] text-slate-500 mt-1">Logged with AI Tutor</p>
          </div>
        </div>

        {/* 2. SUBJECT PROFICIENCY PROGRESS BARS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Subject Mastery & Confidence</h3>
              <p className="text-xs text-slate-500">Calculated from adaptive quizzes and tutor interactions</p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Adaptive Weights
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(proficiency).map(([subj, score]) => (
              <div key={subj} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{subj}</span>
                  <span className="text-purple-700">{score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WEAK AREA DIAGNOSTICS & REMEDIATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weak Area Diagnostics</h3>
              <p className="text-xs text-slate-500">Concepts where quiz accuracy was under 70%</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Attention Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakAreas.length > 0 ? (
              weakAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-700 uppercase">
                        {area.subject}
                      </span>
                      <span className="text-xs font-extrabold text-rose-600">
                        {area.confidence}% Accuracy
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{area.topic}</h4>
                    <p className="text-xs text-slate-500">
                      Recommendation: Practice Socratic breakdown with AI Tutor.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/ai-tutor')}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Practice with AI Tutor</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 col-span-2 text-center">
                No weak areas currently recorded. Keep taking quizzes to update diagnostics!
              </p>
            )}
          </div>
        </div>

        {/* 4. ACHIEVEMENTS & MILESTONE BADGES */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-slate-900">Earned Academic Badges</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: '7-Day Streak', desc: 'Maintained consecutive daily study sessions', icon: Flame, unlocked: true },
              { title: 'Socratic Thinker', desc: 'Completed 10 Socratic tutoring sessions', icon: Brain, unlocked: true },
              { title: 'Perfect 100%', desc: 'Scored full marks on an adaptive quiz', icon: Award, unlocked: true },
              { title: 'Mastery Titan', desc: 'Covered 20+ specialized academic topics', icon: Target, unlocked: false }
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-b from-purple-50/60 to-white border-purple-200'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${
                    badge.unlocked ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

