import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
  ArrowRight,
  RotateCcw,
  Award,
  Brain,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizzesPage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  // Generator Config
  const [selectedSubject, setSelectedSubject] = useState(
    user?.preferredSubjects?.[0] || 'Artificial Intelligence'
  );
  const [topic, setTopic] = useState('Core Fundamentals');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showRationale, setShowRationale] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // History State
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/quizzes/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.quizzes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setActiveQuiz(null);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setShowRationale(false);
    setQuizFinished(false);

    try {
      const res = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic,
          difficulty
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveQuiz(data);
        setTimeLeft(60);
      } else {
        throw new Error('API quiz response not ok');
      }
    } catch (err) {
      console.warn('API quiz generation fallback:', err);
      setActiveQuiz({
        title: `${topic || selectedSubject} Diagnostic Assessment`,
        subject: selectedSubject,
        topic: topic || 'Core Fundamentals',
        difficulty,
        questions: [
          {
            question: 'What is the primary role of the activation function in a neural network?',
            options: [
              'To ensure the weights remain between 0 and 1',
              'To introduce non-linearity, allowing the network to learn complex patterns',
              'To speed up CPU clock cycles',
              'To normalize the dataset'
            ],
            correctIndex: 1,
            explanation: 'Activation functions introduce non-linear properties to the network. Without them, stacking layers simply collapses into a single linear regression model.'
          },
          {
            question: 'Which technique randomly sets a fraction of input units to 0 to prevent overfitting?',
            options: ['Gradient Clipping', 'Batch Normalization', 'Dropout', 'Softmax Temperature'],
            correctIndex: 2,
            explanation: 'Dropout randomly deactivates neurons during training, preventing them from co-adapting too strongly.'
          },
          {
            question: 'What is the average time complexity of searching in a balanced BST?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correctIndex: 1,
            explanation: 'In balanced BSTs (like AVL or Red-Black trees), tree height is strictly bounded by log2(N).'
          },
          {
            question: 'What does a zero determinant in a square matrix signify?',
            options: [
              'The matrix is invertible and unique',
              'The matrix is singular and has linearly dependent vectors',
              'All eigenvalues must be 1',
              'The matrix is an orthogonal rotation'
            ],
            correctIndex: 1,
            explanation: 'A zero determinant means the matrix squashes space into a lower dimension, making inversion impossible.'
          },
          {
            question: 'Which graph traversal algorithm uses a FIFO Queue?',
            options: ['DFS', 'BFS', 'Topological Sort', 'Tarjan’s Algorithm'],
            correctIndex: 1,
            explanation: 'BFS explores vertices level by level using a First-In, First-Out (FIFO) queue.'
          }
        ]
      });
      setTimeLeft(60);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || quizFinished || showRationale) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizFinished, showRationale, currentQIndex]);

  const handleTimeExpire = () => {
    // If time runs out, mark unselected and show rationale
    setShowRationale(true);
  };

  const handleSelectOption = (optionIndex) => {
    if (showRationale) return; // already revealed
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optionIndex
    });
    setShowRationale(true);
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < activeQuiz.questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setShowRationale(false);
      setTimeLeft(60);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);

    // Calculate score
    let calculatedScore = 0;
    const weakAreas = [];

    activeQuiz.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === q.correctIndex) {
        calculatedScore++;
      } else {
        weakAreas.push(topic || activeQuiz.subject);
      }
    });

    setQuizScore(calculatedScore);

    const percentage = Math.round((calculatedScore / activeQuiz.questions.length) * 100);

    // Trigger celebration if high score
    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    // Submit result to backend to update student diagnostics and database
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: activeQuiz.title,
          subject: activeQuiz.subject,
          difficulty: activeQuiz.difficulty,
          score: calculatedScore,
          totalQuestions: activeQuiz.questions.length,
          answers: selectedAnswers,
          weakAreasIdentified: weakAreas
        })
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        fetchHistory();
      }
    } catch (err) {
      console.error('Failed to record quiz results:', err);
    }
  };

  const currentQuestion = activeQuiz?.questions?.[currentQIndex] || null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF7FD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Knowledge Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Quiz Generator
            </h1>
            <p className="text-xs text-slate-500">
              Generate real-time conceptual tests with in-depth rationales and instant weak-area detection.
            </p>
          </div>
        </div>

        {/* 1. QUIZ GENERATOR CONTROL PANEL */}
        {!activeQuiz && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Configure Your Assessment</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Topic Focus</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Neural Networks, Trees, Calculus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Adaptive Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Conceptual)</option>
                  <option value="Advanced">Advanced (Rigorous)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateQuiz}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Generate 5-Question Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. ACTIVE QUIZ INTERFACE */}
        {activeQuiz && !quizFinished && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-soft-lg space-y-6">
            {/* Quiz Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  {activeQuiz.subject} • {activeQuiz.difficulty}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Question {currentQIndex + 1} of {activeQuiz.questions.length}
                </h3>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
                <Timer className="w-4 h-4 text-purple-600" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion?.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion?.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;
                const isCorrect = optIdx === currentQuestion.correctIndex;

                let btnStyle = 'border-slate-200 bg-white hover:border-purple-200 hover:bg-slate-50 text-slate-800';

                if (showRationale) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-semibold';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={showRationale}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-4 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showRationale && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showRationale && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* In-depth Answer Rationale Box */}
            {showRationale && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Brain className="w-4 h-4 text-purple-700" />
                  <span>Educational Rationale:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentQuestion?.explanation}
                </p>
              </div>
            )}

            {/* Next / Finish Controls */}
            {showRationale && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all"
                >
                  <span>
                    {currentQIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'View Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. QUIZ FINISHED RESULTS SCREEN */}
        {quizFinished && (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-soft-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Assessment Completed!</h2>
              <p className="text-xs text-slate-500">
                Here is your performance breakdown for {activeQuiz?.title}
              </p>
            </div>

            <div className="max-w-xs mx-auto p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <p className="text-xs text-purple-700 font-bold uppercase tracking-wider">Your Score</p>
              <p className="text-4xl font-extrabold text-purple-950">
                {quizScore} / {activeQuiz.questions.length}
              </p>
              <p className="text-xs font-semibold text-purple-800">
                Accuracy: {Math.round((quizScore / activeQuiz.questions.length) * 100)}%
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/ai-tutor')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                <Brain className="w-4 h-4" />
                <span>Discuss Questions with AI Tutor</span>
              </button>

              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setQuizFinished(false);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Quiz</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. PAST QUIZZES RECORD TABLE */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900">Quiz History & Analytics</h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">No past quizzes found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Title & Subject</th>
                    <th className="py-2.5 px-3">Difficulty</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {q.title}
                        <span className="block text-[10px] text-slate-500 font-normal">{q.subject}</span>
                      </td>
                      <td className="py-3 px-3">{q.difficulty}</td>
                      <td className="py-3 px-3 font-bold">{q.score} / {q.maxScore}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          q.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(q.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

