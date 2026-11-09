import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Sparkles,
  Layers,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCw,
  Search,
  Check
} from 'lucide-react';

export default function ResourcesPage() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('flashcards'); // 'flashcards' | 'notes'

  // Flashcards state
  const [flashcards, setFlashcards] = useState([]);
  const [activeSubject, setActiveSubject] = useState('All');
  const [flippedCards, setFlippedCards] = useState({});
  const [newCardSubject, setNewCardSubject] = useState('Artificial Intelligence');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    fetchFlashcards();
    fetchNotes();
  }, [activeSubject]);

  const fetchFlashcards = async () => {
    try {
      const url = activeSubject === 'All' ? '/api/flashcards' : `/api/flashcards?subject=${encodeURIComponent(activeSubject)}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setFlashcards(data.flashcards || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastery = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/flashcards/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchFlashcards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newCardSubject,
          question: newQuestion,
          answer: newAnswer
        })
      });

      if (res.ok) {
        setNewQuestion('');
        setNewAnswer('');
        setShowAddCard(false);
        fetchFlashcards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteTitle,
          subject: 'Personal Notes',
          content: noteContent
        })
      });

      if (res.ok) {
        setNoteTitle('');
        setNoteContent('');
        setShowAddNote(false);
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Retention & Reference Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Library, Flashcards & Notes
            </h1>
            <p className="text-xs text-slate-500">
              Spaced repetition flashcards and notes saved directly from your AI Tutor sessions.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-white border border-purple-100 rounded-2xl shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setTab('flashcards')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'flashcards'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Flashcards ({flashcards.length})
            </button>
            <button
              onClick={() => setTab('notes')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'notes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Notebook ({notes.length})
            </button>
          </div>
        </div>

        {/* 1. FLASHCARDS TAB */}
        {tab === 'flashcards' && (
          <div className="space-y-6">
            {/* Filter and Add Card button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['All', 'Artificial Intelligence', 'Data Structures & Algorithms', 'Linear Algebra'].map(
                  (subj) => (
                    <button
                      key={subj}
                      onClick={() => setActiveSubject(subj)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        activeSubject === subj
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setShowAddCard(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Flashcard</span>
              </button>
            </div>

            {/* Flashcard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card) => {
                const isFlipped = !!flippedCards[card.id];
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleFlip(card.id)}
                    className="cursor-pointer min-h-[220px] rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg p-6 flex flex-col justify-between transition-all relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                        <span className="font-bold text-purple-700">{card.subject}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-purple-400 group-hover:rotate-45 transition-transform" />
                          {isFlipped ? 'Answer' : 'Question'} (Click to flip)
                        </span>
                      </div>

                      <div className="pt-4">
                        {!isFlipped ? (
                          <p className="text-sm font-bold text-slate-900 leading-snug">
                            {card.question}
                          </p>
                        ) : (
                          <div className="space-y-2 animate-in fade-in">
                            <span className="text-[10px] font-bold uppercase text-purple-600 tracking-wider">
                              Key Concept Rationale:
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {card.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Spaced Repetition Active</span>
                      <button
                        onClick={(e) => toggleMastery(card.id, e)}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                          card.mastered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {card.mastered && <Check className="w-3 h-3" />}
                        <span>{card.mastered ? 'Mastered' : 'Mark as Mastered'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. NOTES TAB */}
        {tab === 'notes' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddNote(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Note</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                        {note.subject}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{note.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD FLASHCARD MODAL */}
        {showAddCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-purple-100">
              <h3 className="text-lg font-bold text-slate-900">Create Spaced Flashcard</h3>

              <form onSubmit={handleCreateFlashcard} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Subject</label>
                  <select
                    value={newCardSubject}
                    onChange={(e) => setNewCardSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                    <option value="Linear Algebra">Linear Algebra</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Prompt / Question</label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. What is the Bellman equation in RL?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Core Answer / Insight</label>
                  <textarea
                    rows={3}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="e.g. Breaks down the value function into immediate reward plus discounted future value..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Save Flashcard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD NOTE MODAL */}
        {showAddNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-purple-100">
              <h3 className="text-lg font-bold text-slate-900">Add Study Note</h3>

              <form onSubmit={handleCreateNote} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Title</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Key take-aways from Graph Traversals"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Content</label>
                  <textarea
                    rows={5}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Type or paste your study notes here..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1 font-mono text-[11px]"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

