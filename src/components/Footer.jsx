import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, Globe, BookOpen, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-sky-400 text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                EDU<span className="text-purple-400">ORA</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              "Your Learning. Your Pace. Your Future."
            </p>
            <p className="text-xs text-slate-400">
              AI Tutoring Assistant for Personalized Learning. An intelligent EdTech platform delivering adaptive curricula, real-time Socratic guidance, and data-driven mastery.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>College Micro-Project Edition</span>
            </div>
          </div>

          {/* Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/ai-tutor" className="hover:text-purple-300 transition-colors">AI Personal Tutor</Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-purple-300 transition-colors">Smart Quiz Generator</Link>
              </li>
              <li>
                <Link to="/study-plan" className="hover:text-purple-300 transition-colors">Personalized Study Plans</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-purple-300 transition-colors">Performance Analytics</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-purple-300 transition-colors">Library & Flashcards</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/#features" className="hover:text-purple-300 transition-colors">Core Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#why-choose" className="hover:text-purple-300 transition-colors">Why Choose EDUORA</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-300 transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-purple-300 transition-colors">Get Started Free</Link>
              </li>
            </ul>
          </div>

          {/* Academic Domain & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developed as an advanced college micro-project in EdTech & Applied AI.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>support@eduora.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Micro-Project: AI Tutoring Assistant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EDUORA Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for personalized student success.
          </p>
        </div>
      </div>
    </footer>
  );
}
