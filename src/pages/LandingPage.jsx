import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Brain,
  Target,
  Zap,
  BarChart3,
  Calendar,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  Users,
  Award,
  Clock,
  ChevronRight,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tutor');
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoAccess = async () => {
    try {
      setLoadingDemo(true);
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FD]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Next-Generation AI Personalized Tutoring</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Learn Smarter. <br />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                  Grow Faster.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Experience a new way of learning with EDUORA. Your personal AI tutor understands your learning needs, adapts to your pace, and helps you achieve your academic goals.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl shadow-md hover:shadow-purple-500/25 transition-all duration-200"
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="#features"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200"
                    >
                      Explore Features
                    </a>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-md transition-all duration-200"
                  >
                    Go to Your Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {/* 1-Click Demo Evaluation Button */}
                {!isAuthenticated && (
                  <button
                    onClick={handleDemoAccess}
                    disabled={loadingDemo}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-2xl transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    {loadingDemo ? 'Launching Demo...' : '1-Click Student Demo'}
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Adaptive Socratic Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Generic Answers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Diagnostics</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Dashboard & AI Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow ring */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400 opacity-30 blur-xl"></div>

                {/* Main Card Container */}
                <div className="relative rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-500 flex items-center justify-center text-white shadow-sm">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">EDUORA AI Tutor</h3>
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Adaptive Session Active
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                      Socratic Mode
                    </span>
                  </div>

                  {/* Simulated AI Conversation Snippet */}
                  <div className="space-y-3 text-xs">
                    {/* Student Query Bubble */}
                    <div className="flex justify-end">
                      <div className="bg-purple-50 text-purple-950 p-3 rounded-2xl rounded-tr-none max-w-[85%] border border-purple-100">
                        <p className="font-semibold text-slate-700 mb-0.5">Alex Rivera (Undergraduate)</p>
                        "I understand forward pass, but how does backpropagation actually adjust the weights?"
                      </div>
                    </div>

                    {/* AI Tutor Response Bubble */}
                    <div className="flex justify-start">
                      <div className="bg-slate-50 text-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-[90%] border border-slate-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Eduora Tutor</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          Think of it like tuning a musical instrument: by calculating the partial derivative of error with respect to each weight via the Chain Rule:
                        </p>
                        <div className="bg-white p-2 rounded-lg border border-purple-100 text-[11px] font-mono text-purple-900">
                          w_new = w_old - η * (∂Loss / ∂w)
                        </div>
                        <p className="text-slate-600 italic text-[11px]">
                          "Would you like to calculate one layer manually together or see a visual analogy?"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Micro Progress Bar & Streak Stat */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>DSA Mastery</span>
                        <span className="font-bold text-purple-700">84%</span>
                      </div>
                      <div className="w-full bg-purple-200/60 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full w-[84%]"></div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 font-medium">Daily Streak</p>
                        <p className="text-sm font-extrabold text-sky-800">7 Days 🔥</p>
                      </div>
                      <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                        Top 5%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-STEP PROCESS) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Simple & Intuitive
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How EDUORA Works
            </h2>
            <p className="text-base text-slate-600">
              From day one, EDUORA adapts to your personal learning curve in three structured steps.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-[#FAF7FD] border border-purple-100/90 hover:border-purple-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Tell us about your learning goals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your academic level, current subjects, knowledge baseline, and weekly target hours during our 60-second onboarding.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-700">
                <Target className="w-4 h-4" />
                <span>Personalized curriculum baseline</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-[#FAF7FD] border border-purple-100/90 hover:border-purple-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Learn with your personal AI tutor
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Engage in interactive Socratic conversations, break down tricky theorems with analogies, and receive instant answers 24/7.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <Brain className="w-4 h-4" />
                <span>Adaptive Socratic reasoning</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-[#FAF7FD] border border-purple-100/90 hover:border-purple-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Track your progress and improve
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take adaptive diagnostic quizzes, discover weak concepts automatically, and watch your subject mastery percentage climb.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-sky-700">
                <BarChart3 className="w-4 h-4" />
                <span>Weak area diagnostics & mastery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURE HIGHLIGHTS */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Genuine Academic Growth
            </h2>
            <p className="text-base text-slate-600">
              Six synchronized AI learning modules designed to transform passive memorization into deep conceptual mastery.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. AI Personal Tutor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Available around the clock with specialized Socratic, Explainer, Code & Math, and Exam Prep modes to fit your preferred study workflow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Adaptive Learning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                EDUORA dynamically gauges your knowledge depth and recalibrates explanations, ensuring you never feel overwhelmed or bored.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Smart Quiz Generator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instant tailored quizzes on any topic with timed evaluations, comprehensive answer rationales, and automatic knowledge-gap tagging.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Personalized Study Plans</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI synthesizes your exam dates and syllabi into weekly milestone roadmaps with manageable daily checklists and progress bars.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">5. Performance Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visual diagnostic metrics showing subject mastery percentages, weak area alerts, quiz trends, and study streak statistics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">6. Intelligent Recommendations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Proactive suggestions pinpointing exactly which sub-topics you should review next to guarantee maximum score improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE EDUORA (COMPARISON) */}
      <section id="why-choose" className="py-20 bg-white border-y border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              The Pedagogical Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose EDUORA?
            </h2>
            <p className="text-base text-slate-600">
              Standard online courses give everyone the same lecture. EDUORA constructs an individualized learning path tailored to your unique mind.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Platforms */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                  VS
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Traditional Learning Platforms</h3>
                  <p className="text-xs text-slate-500">Rigid, one-size-fits-all model</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Static pre-recorded videos that cannot answer your specific confusion.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Generic quiz questions that do not adjust when you struggle.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>No diagnosis of weak foundational concepts until after you fail an exam.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Disjointed notes, external flashcard apps, and lack of accountability.</span>
                </li>
              </ul>
            </div>

            {/* EDUORA Solution */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-sky-50 border-2 border-purple-300 shadow-soft-lg space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200">
                  Recommended
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-950">EDUORA Intelligent Learning</h3>
                  <p className="text-xs text-purple-600 font-medium">Adaptive, responsive, continuous</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Personalized AI Tutor:</strong> Explains any concept with custom analogies until it clicks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Adaptive Diagnostics:</strong> Automatically tags weak topics and serves targeted remediation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Built-in Spaced Repetition:</strong> AI flashcards and organized student notes in one place.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Measurable Results:</strong> Transparent tracking of study time, streaks, and subject proficiency.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEARNING STATISTICS (CLEARLY LABELLED SAMPLE FIGURES) */}
      <section className="py-20 bg-[#FAF7FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-700">
                Demonstrated Academic Metrics (Illustrative Demo Figures)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
                Proven by Numbers, Powered by AI
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-purple-300">94%</p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Concept Retention Rate</p>
                <p className="text-[11px] text-slate-400">vs 52% passive reading</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-sky-300">2.4x</p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Faster Topic Mastery</p>
                <p className="text-[11px] text-slate-400">using Socratic guidance</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-indigo-300">50K+</p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Quizzes Solved</p>
                <p className="text-[11px] text-slate-400">with real-time rationale</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300">4.9 / 5</p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Student Satisfaction</p>
                <p className="text-[11px] text-slate-400">across college evaluations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SAMPLE STUDENT TESTIMONIALS */}
      <section className="py-20 bg-white border-b border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Sample Student Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Early Students Are Saying
            </h2>
            <p className="text-sm text-slate-500 italic">
              *The following reviews are sample testimonials collected during micro-project pilot trials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "Dynamic Programming was impossible for me until EDUORA broke it down using Socratic questioning. Instead of memorizing code, I now instinctively recognize the subproblems."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alex Rivera</h4>
                  <p className="text-[11px] text-slate-500">Undergraduate, CS & AI</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "The adaptive quiz generator is unmatched. It doesn't just tell me I'm wrong; it explains why every distractor option is incorrect and saves weak concepts directly to my study plan."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-800 font-bold flex items-center justify-center text-xs">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sophia Kim</h4>
                  <p className="text-[11px] text-slate-500">Data Science Major</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "Having an AI tutor that adapts to my exam dates with weekly roadmaps gave me the discipline to maintain a 21-day study streak. My grades jumped from a B- to an A."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  MJ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Marcus Johnson</h4>
                  <p className="text-[11px] text-slate-500">Electrical Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-purple-700 via-indigo-700 to-sky-700 p-10 sm:p-14 text-white text-center shadow-2xl overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Start Your Personalized Journey
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Experience AI-Powered Learning?
              </h2>

              <p className="text-base text-purple-100 leading-relaxed">
                Join EDUORA today. Set your academic targets, learn with your 24/7 AI tutor, and conquer your college micro-projects and exams.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-purple-900 bg-white hover:bg-purple-50 rounded-2xl shadow-lg transition-all"
                >
                  Create Free Account
                </Link>
                <button
                  onClick={handleDemoAccess}
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl transition-all"
                >
                  Explore Demo Student (Alex)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

