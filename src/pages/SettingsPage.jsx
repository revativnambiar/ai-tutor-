import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Key, User, Check, Sparkles, Shield, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel || 'Undergraduate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 45);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('eduora_gemini_key') || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();

    if (apiKey) {
      localStorage.setItem('eduora_gemini_key', apiKey.trim());
    } else {
      localStorage.removeItem('eduora_gemini_key');
    }

    if (updateUser) {
      updateUser({
        ...user,
        name,
        academicLevel,
        dailyGoalMinutes: parseInt(dailyGoalMinutes) || 45
      });
    }

    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Learning Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & AI Tutor Settings
          </h1>
          <p className="text-xs text-slate-500">
            Customize your learning profile, study targets, and optional AI model keys.
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              <span>Student Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Academic Stage</label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Daily Study Target (Minutes)</label>
              <input
                type="number"
                min="15"
                max="180"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(e.target.value)}
                className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* AI Engine & API Key Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Intelligence Engine Configuration</span>
            </h3>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-700" />
                Dual-Engine Reliability Architecture
              </p>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                By default, EDUORA runs its high-fidelity built-in Knowledge Engine offline without needing any API key. If you wish to use Google Gemini 1.5 live, paste your Gemini API Key below.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-600" />
                <span>Google Gemini API Key (Optional)</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-400">
                Key is stored securely in your browser's local storage and used only to communicate with Google's API.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

