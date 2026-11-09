import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Brain,
  Bookmark,
  Volume2,
  VolumeX,
  HelpCircle,
  Lightbulb,
  Code2,
  GraduationCap,
  RotateCcw,
  BookOpen,
  Check,
  ChevronDown
} from 'lucide-react';

const TUTOR_MODES = [
  {
    id: 'socratic',
    label: 'Socratic Tutor',
    icon: HelpCircle,
    desc: 'Guides with thoughtful questions and hints'
  },
  {
    id: 'explainer',
    label: 'Intuitive Explainer',
    icon: Lightbulb,
    desc: 'Simple analogies, mental models & ELI5'
  },
  {
    id: 'code_math',
    label: 'Code & Math',
    icon: Code2,
    desc: 'Step-by-step formulas, code & complexity'
  },
  {
    id: 'exam_prep',
    label: 'Exam Prep Coach',
    icon: GraduationCap,
    desc: 'High-yield points & common pitfalls'
  }
];

const SUGGESTED_PROMPTS = [
  'Explain how backpropagation calculates gradients using an analogy',
  'What is the difference between Dijkstra and Bellman-Ford?',
  'Why do we use memoization in Dynamic Programming?',
  'Explain Eigenvalues and Eigenvectors intuitively',
  'What causes the vanishing gradient problem in deep networks?'
];

export default function AITutorPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('explainer');
  const [subject, setSubject] = useState(user?.preferredSubjects?.[0] || 'Artificial Intelligence');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedNoteMsg, setSavedNoteMsg] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello **${user?.name || 'Learner'}**! I am your personal **EDUORA AI Tutor**.

I am tuned to your **${user?.academicLevel || 'Undergraduate'}** level in **${subject}**. 

How would you like to explore today? You can ask me to break down an intimidating concept, write code, derive a formula, or quiz your intuition.`,
      engine: 'Eduora Adaptive Engine',
      mode: 'explainer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiKey = localStorage.getItem('eduora_gemini_key') || '';
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          subject,
          mode,
          apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.text,
          engine: data.engine || 'Eduora AI Tutor',
          mode: data.mode || mode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'I encountered an issue processing your request. Please try again or rephrase your question.',
          engine: 'Eduora Diagnostics',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveToNotes = async (msgText) => {
    try {
      const firstLine = msgText.split('\n')[0].replace(/[#*`]/g, '').trim();
      const title = firstLine.length > 40 ? `${firstLine.slice(0, 37)}...` : firstLine || `${subject} Note`;

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `AI Note: ${title}`,
          subject,
          content: msgText
        })
      });

      if (res.ok) {
        setSavedNoteMsg('Saved to your Notebook!');
        setTimeout(() => setSavedNoteMsg(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[#*`_>]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col h-[82vh] bg-white rounded-3xl border border-purple-100 shadow-soft-lg overflow-hidden">
        {/* 1. TUTOR TOP HEADER & CONTROLS */}
        <div className="p-4 sm:p-5 border-b border-purple-100/90 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Brain className="w-5 h-5 text-white animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">EDUORA AI Tutor</h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized for {user?.name || 'Student'} ({user?.academicLevel || 'Undergraduate'})
              </p>
            </div>
          </div>

          {/* Subject & Mode Selection Dropdown Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Selector */}
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-purple-50/70 border border-purple-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Mathematics">Mathematics & Calculus</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Physics">Physics & Engineering</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Mode Selector Pill Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {TUTOR_MODES.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.desc}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      active
                        ? 'bg-white text-purple-700 font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Saved Note Toast Notification */}
        {savedNoteMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center animate-in fade-in">
            {savedNoteMsg}
          </div>
        )}

        {/* 2. CHAT MESSAGES DISPLAY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FCFBFE]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 space-y-2 shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-purple-100 rounded-tl-none'
                  }`}
                >
                  {/* Header info */}
                  <div className="flex items-center justify-between gap-3 text-[11px] pb-1 border-b border-white/10">
                    <span className={`font-bold flex items-center gap-1 ${isUser ? 'text-purple-100' : 'text-purple-700'}`}>
                      {!isUser && <Sparkles className="w-3.5 h-3.5" />}
                      {isUser ? 'You' : `EDUORA AI (${msg.engine || 'Adaptive'})`}
                    </span>
                    <span className={isUser ? 'text-purple-200' : 'text-slate-400'}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal ${isUser ? 'text-white' : 'text-slate-700'}`}>
                    {msg.text}
                  </div>

                  {/* Actions for AI responses */}
                  {!isUser && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveToNotes(msg.text)}
                          title="Save to My Notes"
                          className="flex items-center gap-1 hover:text-purple-700 p-1 rounded-md hover:bg-purple-50 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Save Note</span>
                        </button>
                        <button
                          onClick={() => handleSpeakText(msg.text)}
                          title="Listen via Text-to-Speech"
                          className="flex items-center gap-1 hover:text-purple-700 p-1 rounded-md hover:bg-purple-50 transition-colors"
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">Audio</span>
                        </button>
                      </div>

                      <button
                        onClick={() => navigate('/quizzes')}
                        className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Quiz Me On This</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-xs text-purple-700 font-medium">
                  EDUORA is formulating your personalized guidance...
                </span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. QUICK STARTERS PILLS */}
        <div className="px-4 py-2 bg-slate-50 border-t border-purple-100/60 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Try asking:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 transition-colors text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 4. CHAT INPUT BAR */}
        <div className="p-4 bg-white border-t border-purple-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask your ${mode === 'socratic' ? 'Socratic Tutor' : 'AI Tutor'} a question in ${subject}...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

