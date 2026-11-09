import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function StudyPlanPage() {
  const { user, token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Plan Modal / Form
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState(user?.preferredSubjects?.[0] || 'Artificial Intelligence');
  const [newGoal, setNewGoal] = useState('');
  const [targetWeeks, setTargetWeeks] = useState(4);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/study-plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
          return;
        }
      }
      // Fallback initial plan
      setPlans([
        {
          id: 'plan-ai-mastery',
          title: 'AI & Deep Learning Mastery Roadmap',
          subject: 'Artificial Intelligence',
          goal: 'Understand core neural architectures and implement transformers',
          durationWeeks: 4,
          progress: 65,
          milestones: [
            { id: 'm1', week: 1, title: 'Foundations of Perceptrons & Loss Functions', description: 'Master forward pass, MSE, Cross-Entropy, and activation functions.', completed: true },
            { id: 'm2', week: 2, title: 'Backpropagation & Optimization Algorithms', description: 'Deep dive into computational graphs, SGD, Adam, and momentum.', completed: true },
            { id: 'm3', week: 3, title: 'Convolutional & Recurrent Networks (CNN & RNN)', description: 'Feature maps, kernel convolution, pooling, LSTM and GRU gates.', completed: false },
            { id: 'm4', week: 4, title: 'Attention Mechanism & Transformer Encoders', description: 'Self-attention mathematics, query/key/value projections, multi-head attention.', completed: false }
          ]
        }
      ]);
    } catch (err) {
      console.warn('Study plans fetch fallback:', err);
      setPlans([
        {
          id: 'plan-ai-mastery',
          title: 'AI & Deep Learning Mastery Roadmap',
          subject: 'Artificial Intelligence',
          goal: 'Understand core neural architectures and implement transformers',
          durationWeeks: 4,
          progress: 65,
          milestones: [
            { id: 'm1', week: 1, title: 'Foundations of Perceptrons & Loss Functions', description: 'Master forward pass, MSE, Cross-Entropy, and activation functions.', completed: true },
            { id: 'm2', week: 2, title: 'Backpropagation & Optimization Algorithms', description: 'Deep dive into computational graphs, SGD, Adam, and momentum.', completed: true },
            { id: 'm3', week: 3, title: 'Convolutional & Recurrent Networks (CNN & RNN)', description: 'Feature maps, kernel convolution, pooling, LSTM and GRU gates.', completed: false }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = async (planId, milestoneId) => {
    try {
      const res = await fetch(`/api/study-plans/${planId}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setPlans(plans.map(p => (p.id === planId ? data.plan : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!newGoal) return;

    setGenerating(true);
    try {
      const res = await fetch('/api/study-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newSubject,
          goal: newGoal,
          targetWeeks
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPlans([data.plan, ...plans]);
        setShowModal(false);
        setNewGoal('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Personalized AI Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Study Roadmaps & Milestones
            </h1>
            <p className="text-xs text-slate-500">
              Structured week-by-week learning pathways tailored to your pace and exam deadlines.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Study Plan</span>
          </button>
        </div>

        {/* List of Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-6"
            >
              {/* Plan Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                    {plan.subject}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">{plan.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    <span>Goal: {plan.goal}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs font-bold text-slate-700">Duration: {plan.durationWeeks} Weeks</p>
                  <p className="text-xl font-extrabold text-purple-700">{plan.progress}% Complete</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Weekly Curriculum & Actionable Checkpoints:
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {plan.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(plan.id, m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        m.completed
                          ? 'bg-purple-50/60 border-purple-200'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-purple-50/20 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {m.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs sm:text-sm font-bold ${m.completed ? 'text-purple-950 line-through opacity-75' : 'text-slate-900'}`}>
                            Week {m.week}: {m.title}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                        {m.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GENERATE PLAN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Generate AI Study Plan</h3>
              <p className="text-xs text-slate-500">
                Let EDUORA design a structured milestone schedule based on your target.
              </p>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Linear Algebra & Probability">Linear Algebra & Probability</option>
                  <option value="Full-Stack Web Engineering">Full-Stack Web Engineering</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Specific Target or Exam</label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g. Master Graph Theory & DP before midterms"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Duration (Weeks)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 6].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTargetWeeks(w)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        targetWeeks === w
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-slate-200 hover:border-purple-200 text-slate-700'
                      }`}
                    >
                      {w} Weeks
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating || !newGoal}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
                >
                  {generating ? 'Synthesizing...' : 'Create Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

