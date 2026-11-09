import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  GraduationCap,
  Target,
  Brain,
  Clock,
  ArrowRight,
  Check,
  ChevronLeft,
  CheckCircle2,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel || 'Undergraduate');
  const [targetGoal, setTargetGoal] = useState('Master core subjects & ace exams with top grades');
  const [preferredSubjects, setPreferredSubjects] = useState(
    user?.preferredSubjects || ['Computer Science & AI', 'Data Structures & Algorithms']
  );
  const [knowledgeLevel, setKnowledgeLevel] = useState('Intermediate');
  const [learningStyle, setLearningStyle] = useState('Step-by-step with practical challenges');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(45);
  const [isGenerating, setIsGenerating] = useState(false);

  const ALL_SUBJECTS = [
    'Computer Science & AI',
    'Data Structures & Algorithms',
    'Mathematics & Calculus',
    'Linear Algebra & Probability',
    'Machine Learning & Deep Learning',
    'Physics & Quantum Mechanics',
    'Full-Stack Web Engineering',
    'Data Science & Analytics',
    'Biology & Bio-Informatics'
  ];

  const toggleSubject = (s) => {
    if (preferredSubjects.includes(s)) {
      if (preferredSubjects.length > 1) {
        setPreferredSubjects(preferredSubjects.filter(item => item !== s));
      }
    } else {
      setPreferredSubjects([...preferredSubjects, s]);
    }
  };

  const handleFinish = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          academicLevel,
          targetGoal,
          preferredSubjects,
          knowledgeLevel,
          learningStyle,
          dailyGoalMinutes
        })
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);

        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress Bar Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Step {step} of 3</span>
            <span className="text-purple-700 font-bold">
              {step === 1 ? 'Academic Ambition' : step === 2 ? 'Subjects & Knowledge Depth' : 'Learning Style & Pace'}
            </span>
          </div>
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Wizard Container */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white shadow-soft-lg border border-purple-100 relative">
          {/* STEP 1: Academic Level & Target Goal */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Academic Foundations</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  What is your current academic stage?
                </h2>
                <p className="text-xs text-slate-500">
                  EDUORA customizes technical depth and mathematical rigor based on your stage.
                </p>
              </div>

              {/* Academic Stage Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'High School', label: 'High School / Senior Secondary', desc: 'Focus on board exams & STEM fundamentals' },
                  { id: 'Undergraduate', label: 'Undergraduate College Student', desc: 'Engineering, CS, Sciences, or Pre-Med' },
                  { id: 'Postgraduate', label: 'Postgraduate / Master’s Candidate', desc: 'Specialized research, thesis & advanced math' },
                  { id: 'Professional', label: 'Professional / Career Pivot', desc: 'Practical industry skills & interview prep' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAcademicLevel(item.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      academicLevel === item.id
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900">{item.label}</span>
                      {academicLevel === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Target Goal Input */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>What is your primary academic goal this term?</span>
                </label>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="e.g. Master AI algorithms, score 90%+ in exams, ace placement coding rounds"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
                >
                  Continue to Subjects
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Subjects & Knowledge Depth */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>Subject Focus</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Choose your focus subjects & current baseline
                </h2>
                <p className="text-xs text-slate-500">
                  Select the subjects you want to master. We will build tailored knowledge paths for each.
                </p>
              </div>

              {/* Multi-select Subjects */}
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map((subj) => {
                  const isSelected = preferredSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>

              {/* Current Knowledge Level */}
              <div className="space-y-2 pt-3">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span>How would you rate your current overall baseline?</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Beginner', title: 'Beginner', desc: 'Starting from scratch' },
                    { id: 'Intermediate', title: 'Intermediate', desc: 'Know fundamentals, need mastery' },
                    { id: 'Advanced', title: 'Advanced', desc: 'Optimizing high-order concepts' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setKnowledgeLevel(lvl.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        knowledgeLevel === lvl.id
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-purple-200 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{lvl.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
                >
                  Continue to Learning Style
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Learning Style & Daily Goal */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>Personalized Cadence</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  How do you learn best?
                </h2>
                <p className="text-xs text-slate-500">
                  EDUORA's AI Tutor will adopt this tone and instructional structure in every explanation.
                </p>
              </div>

              {/* Learning Style Selection */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'Socratic questioning & thought experiments',
                    label: 'Socratic Dialogue & Guiding Questions',
                    desc: 'Prompt me to think through hints rather than just spoonfeeding answers.'
                  },
                  {
                    id: 'Intuitive analogies & visual mental models',
                    label: 'Intuitive Analogies & Mental Models',
                    desc: 'Translate complex equations and abstractions into everyday physical metaphors.'
                  },
                  {
                    id: 'Step-by-step with practical challenges',
                    label: 'Step-by-step with Code & Math Breakdown',
                    desc: 'Systematic derivations, code templates, edge cases, and algorithmic rigor.'
                  },
                  {
                    id: 'High-yield exam summaries & memory retention',
                    label: 'High-Yield Exam Prep & Fast Retention',
                    desc: 'Cut straight to scoring criteria, common exam traps, and flashcard mnemonics.'
                  }
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setLearningStyle(style.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      learningStyle === style.id
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{style.label}</span>
                      {learningStyle === style.id && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{style.desc}</p>
                  </button>
                ))}
              </div>

              {/* Daily Study Commitment */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Daily Study Target
                  </span>
                  <span className="text-purple-700 font-extrabold text-sm">{dailyGoalMinutes} minutes / day</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyGoalMinutes(mins)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        dailyGoalMinutes === mins
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-slate-200 hover:border-purple-200 text-slate-700'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Actions */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Synthesizing AI Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch My EDUORA Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

