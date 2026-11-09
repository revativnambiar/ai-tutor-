import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, GraduationCap, BookOpen, ArrowRight, AlertCircle, Check } from 'lucide-react';

const ACADEMIC_LEVELS = [
  'High School',
  'Undergraduate',
  'Postgraduate',
  'Professional',
  'Lifelong Learner'
];

const AVAILABLE_SUBJECTS = [
  'Computer Science & AI',
  'Data Structures & Algorithms',
  'Mathematics & Calculus',
  'Linear Algebra',
  'Physics & Quantum Mechanics',
  'Data Science & Analytics',
  'Web Engineering',
  'Biology & Pre-Med'
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Undergraduate');
  const [preferredSubjects, setPreferredSubjects] = useState(['Computer Science & AI', 'Data Structures & Algorithms']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSubject = (subj) => {
    if (preferredSubjects.includes(subj)) {
      if (preferredSubjects.length > 1) {
        setPreferredSubjects(preferredSubjects.filter(s => s !== subj));
      }
    } else {
      setPreferredSubjects([...preferredSubjects, subj]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (preferredSubjects.length === 0) {
      setError('Please select at least one preferred subject.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: fullName,
        email,
        password,
        confirmPassword,
        academicLevel,
        preferredSubjects
      });
      // Guide student directly to personalized onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7FD]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              EDU<span className="text-purple-600">ORA</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 pt-2">
            Create Your Student Account
          </h2>
          <p className="text-xs text-slate-500">
            Join EDUORA and unlock your personal AI learning companion
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl bg-white shadow-soft-lg border border-purple-100 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Level */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Academic Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none cursor-pointer"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Subjects (Multi-select pills) */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Preferred Subjects to Master</span>
                <span className="text-[11px] text-purple-600 font-normal">
                  ({preferredSubjects.length} selected)
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SUBJECTS.map((subj) => {
                  const selected = preferredSubjects.includes(subj);
                  return (
                    <button
                      type="button"
                      key={subj}
                      onClick={() => toggleSubject(subj)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        selected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Continue to Personalization'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

