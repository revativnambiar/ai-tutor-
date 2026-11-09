/**
 * EDUORA – AI-Powered Personalized Learning Platform
 * Core Application Engine & State Manager
 * Fully compatible with file:// protocol and http:// server environments
 */

// 1. INITIAL SEED DATA & STATE MANAGEMENT
const DEFAULT_STUDENT = {
  id: 'student-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@eduora.ai',
  academicLevel: 'Undergraduate',
  targetGoal: 'Master AI & Ace Placement Interviews',
  preferredSubjects: ['Artificial Intelligence', 'Data Structures & Algorithms', 'Linear Algebra', 'Web Engineering'],
  knowledgeLevel: 'Intermediate',
  learningStyle: 'Step-by-step with practical challenges',
  dailyGoalMinutes: 45,
  streakDays: 7,
  totalStudyMinutes: 480,
  onboarded: true,
  stats: {
    quizzesTaken: 12,
    avgScore: 84,
    topicsMastered: 18,
    hoursStudied: 16.5,
    accuracyRate: 86,
    subjectProficiency: {
      'Artificial Intelligence': 88,
      'Data Structures & Algorithms': 82,
      'Linear Algebra': 76,
      'Web Engineering': 90
    },
    weakAreas: [
      { subject: 'Data Structures', topic: 'Dynamic Programming (Memoization)', confidence: 48 },
      { subject: 'Linear Algebra', topic: 'Eigenvalues & Diagonalization', confidence: 54 },
      { subject: 'AI', topic: 'Backpropagation Gradient Derivation', confidence: 62 }
    ]
  }
};

const DEFAULT_QUIZZES = [
  {
    id: 'q-1',
    title: 'Neural Networks & Gradient Descent Fundamentals',
    subject: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    score: 4,
    maxScore: 5,
    percentage: 80,
    date: 'Yesterday'
  },
  {
    id: 'q-2',
    title: 'Binary Search Trees & Graph Traversals (BFS/DFS)',
    subject: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    score: 5,
    maxScore: 5,
    percentage: 100,
    date: '3 days ago'
  }
];

const DEFAULT_PLANS = [
  {
    id: 'plan-1',
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
  },
  {
    id: 'plan-2',
    title: 'DSA Competitive & Interview Prep',
    subject: 'Data Structures & Algorithms',
    goal: 'Conquer tree traversals, graphs, and dynamic programming patterns',
    durationWeeks: 3,
    progress: 40,
    milestones: [
      { id: 'd1', week: 1, title: 'Arrays, Two Pointers & Sliding Window', description: 'Subarray sum, two-sum variations, fast and slow pointers.', completed: true },
      { id: 'd2', week: 2, title: 'Binary Trees, Tries & Priority Queues', description: 'Lowest Common Ancestor, Trie autocomplete, Min/Max Heaps.', completed: false },
      { id: 'd3', week: 3, title: 'Dynamic Programming & Memoization Patterns', description: 'Knapsack 0/1, Longest Common Subsequence, Grid paths.', completed: false }
    ]
  }
];

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Socratic Summary: Why Overfitting Happens in Deep Models',
    subject: 'Artificial Intelligence',
    content: `Overfitting occurs when a model learns the training noise rather than the underlying pattern.\n\nKey regularizers to prevent overfitting:\n1. Dropout (randomly deactivating units during training)\n2. Weight Decay / L2 Regularization (penalizing large weight norms)\n3. Data Augmentation (synthesizing transformations)\n4. Early Stopping (monitoring validation loss plateau)\n\nRule of thumb: High training accuracy + low validation accuracy = High Variance (Overfitting).`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 'note-2',
    title: 'Mastering Dijkstra’s Shortest Path Algorithm',
    subject: 'Data Structures & Algorithms',
    content: `Dijkstra finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.\n\nTime Complexity: O((V + E) log V) with a Min-Priority Queue / Binary Heap.\nSpace Complexity: O(V) to store distance array and priority queue.\n\nNote: Cannot handle negative cycles! For negative edges, use Bellman-Ford algorithm.`,
    updatedAt: new Date(Date.now() - 86400000).toLocaleDateString()
  }
];

const DEFAULT_FLASHCARDS = [
  {
    id: 'fc-1',
    subject: 'Artificial Intelligence',
    question: 'What is the vanishing gradient problem, and which activation function mitigates it?',
    answer: 'In deep neural networks with Sigmoid or Tanh activations, gradients become exponentially tiny during backpropagation through many layers. ReLU (Rectified Linear Unit) mitigates this by having a constant gradient of 1 for positive inputs.',
    mastered: true
  },
  {
    id: 'fc-2',
    subject: 'Artificial Intelligence',
    question: 'What is the role of the Softmax function in multi-class classification?',
    answer: 'Softmax exponentiates raw logits and normalizes them into a probability distribution summing to 1.0, enabling the model to output calibrated class likelihoods.',
    mastered: false
  },
  {
    id: 'fc-3',
    subject: 'Data Structures & Algorithms',
    question: 'What is the average and worst-case time complexity of QuickSort?',
    answer: 'Average time complexity is O(N log N). Worst case is O(N^2), which occurs when the chosen pivot is always the smallest or largest element (e.g. already sorted array with naive pivot selection).',
    mastered: true
  },
  {
    id: 'fc-4',
    subject: 'Linear Algebra',
    question: 'What does an Eigenvector geometrically represent when a matrix acts on it?',
    answer: 'An eigenvector is a vector whose direction does not change when transformed by a linear matrix; it is only scaled by a factor called the corresponding Eigenvalue (A * v = lambda * v).',
    mastered: false
  }
];

// App Store
const EduoraStore = {
  getStudent() {
    try {
      const data = localStorage.getItem('eduora_student');
      return data ? JSON.parse(data) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  },
  saveStudent(student) {
    localStorage.setItem('eduora_student', JSON.stringify(student));
  },
  getQuizzes() {
    try {
      const data = localStorage.getItem('eduora_quizzes');
      return data ? JSON.parse(data) : DEFAULT_QUIZZES;
    } catch {
      return DEFAULT_QUIZZES;
    }
  },
  saveQuizzes(quizzes) {
    localStorage.setItem('eduora_quizzes', JSON.stringify(quizzes));
  },
  getPlans() {
    try {
      const data = localStorage.getItem('eduora_plans');
      return data ? JSON.parse(data) : DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  },
  savePlans(plans) {
    localStorage.setItem('eduora_plans', JSON.stringify(plans));
  },
  getNotes() {
    try {
      const data = localStorage.getItem('eduora_notes');
      return data ? JSON.parse(data) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  },
  saveNotes(notes) {
    localStorage.setItem('eduora_notes', JSON.stringify(notes));
  },
  getFlashcards() {
    try {
      const data = localStorage.getItem('eduora_flashcards');
      return data ? JSON.parse(data) : DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  },
  saveFlashcards(flashcards) {
    localStorage.setItem('eduora_flashcards', JSON.stringify(flashcards));
  },
  isAuthenticated() {
    return localStorage.getItem('eduora_logged_in') === 'true';
  },
  setAuthenticated(val) {
    localStorage.setItem('eduora_logged_in', val ? 'true' : 'false');
  }
};

// 2. KNOWLEDGE BASE & AI TUTOR ENGINE
const AI_KNOWLEDGE_BANK = {
  'neural networks': {
    title: 'Neural Networks & Deep Learning',
    summary: 'Neural networks are computational models inspired by biological neurons. They consist of input, hidden, and output layers where weights and biases are iteratively updated through backpropagation to minimize a loss function.',
    keyPoints: [
      'Activation functions (ReLU, Sigmoid, GELU) introduce non-linearity so networks can learn arbitrary functions.',
      'Forward propagation computes predictions; backpropagation computes the gradient of loss with respect to each weight.',
      'Optimizers like Adam and SGD adjust weights using gradient vectors.',
      'Regularization (Dropout, Weight Decay) prevents overfitting on training data.'
    ],
    analogy: 'Imagine a factory assembly line where each station (neuron) refines a product based on instructions (weights). If the end product has flaws (loss), an inspector sends feedback backwards (backpropagation) so each worker adjusts their technique.'
  },
  'dynamic programming': {
    title: 'Dynamic Programming (DP)',
    summary: 'Dynamic Programming solves complex problems by breaking them down into simpler subproblems, solving each subproblem once, and storing their solutions (memoization or tabulation) to avoid redundant computations.',
    keyPoints: [
      'Optimal Substructure: An optimal solution contains optimal solutions to subproblems.',
      'Overlapping Subproblems: The same subproblems are encountered repeatedly.',
      'Approaches: Top-Down with Memoization (recursion + cache) and Bottom-Up with Tabulation (table filling).',
      'Classic examples: 0/1 Knapsack, Longest Common Subsequence, Coin Change, Fibonacci.'
    ],
    analogy: 'Writing "1 + 1 + 1 + 1 + 1" on paper and asking how many ones there are (5). If you add another "+ 1" to the end, you do not recount from zero; you recall "5" and add one to make 6. That memory is dynamic programming!'
  },
  'dijkstra': {
    title: 'Dijkstra’s Algorithm vs Bellman-Ford',
    summary: 'Dijkstra finds the single-source shortest path in graphs with non-negative edge weights using a Greedy approach with a priority queue in O((V + E) log V). Bellman-Ford can handle negative weights in O(V * E) and detects negative weight cycles.',
    keyPoints: [
      'Dijkstra uses a Min-Heap / Priority Queue to greedily pick the closest unvisited vertex.',
      'Fails on negative weight edges because visited node distances are finalized prematurely.',
      'Bellman-Ford relaxes all edges (V - 1) times, safely handling negative weights.'
    ],
    analogy: 'Dijkstra is like a water ripple spreading outward equally; Bellman-Ford is like checking every road repeatedly until no shorter detours can possibly exist.'
  },
  'eigenvalues': {
    title: 'Eigenvalues and Eigenvectors',
    summary: 'An eigenvector of a square matrix is a non-zero vector that changes only by a scalar factor (the eigenvalue) when that linear transformation is applied (A * v = lambda * v).',
    keyPoints: [
      'Geometrically, eigenvectors represent axes along which a transformation acts as pure stretching or shrinking with no rotation.',
      'Crucial for Principal Component Analysis (PCA), Google PageRank, and quantum state analysis.',
      'Found by solving the characteristic equation: det(A - lambda * I) = 0.'
    ],
    analogy: 'Think of stretching a rubber sheet diagonally. Most arrows drawn on the sheet will rotate, but arrows drawn along the exact diagonal stretch axis will only lengthen or shorten without changing their direction. Those special arrows are eigenvectors!'
  }
};

function queryEduoraAI(prompt, subject, mode, studentName, academicLevel) {
  const p = prompt.toLowerCase();
  
  for (const [key, item] of Object.entries(AI_KNOWLEDGE_BANK)) {
    if (p.includes(key) || key.includes(p)) {
      if (mode === 'socratic') {
        return `Hello **${studentName}**! Let's explore **${item.title}** together.\n\nInstead of just memorizing the formula, consider this thought experiment:\n> *${item.analogy}*\n\nNow, let me ask you:\n1. If input dimensions expand by a factor of 100, what bottleneck will appear first?\n2. What condition would break this model entirely?\n\nGive me your initial intuition and we will build it up step-by-step! 🚀`;
      }
      if (mode === 'code_math') {
        return `### Technical Analysis: **${item.title}**\n\n**Complexity Bounds:** O(N log N) / O(V + E)\n\n**Mathematical Formulation:**\n$$\\min_{\\theta} \\mathcal{L}(f(x; \\theta), y) + \\lambda \\|\\theta\\|^2$$\n\n**Core Invariants:**\n${item.keyPoints.map(kp => `- ${kp}`).join('\n')}\n\n\`\`\`python\n# Clean Implementation Blueprint\ndef solve_concept(inputs):\n    # Validate boundary conditions\n    if not inputs: return None\n    result = []\n    # Process optimal state transformation\n    return result\n\`\`\``;
      }
      if (mode === 'exam_prep') {
        return `### 🎯 High-Yield Exam Summary: **${item.title}**\n\n**1. High-Yield Definition (2-5 Marks):**\n${item.summary}\n\n**2. Key Scoring Criteria:**\n${item.keyPoints.map(kp => `✅ **${kp}**`).join('\n')}\n\n**3. Common Pitfalls:**\n- Forgetting base cases and non-negative assumptions.\n- Confusing average case with worst-case bounds.`;
      }
      // Explainer
      return `### Understanding **${item.title}**\n\n${item.summary}\n\n---\n#### 💡 Intuitive Analogy\n> ${item.analogy}\n\n---\n#### 📌 Key Takeaways\n${item.keyPoints.map(kp => `- ${kp}`).join('\n')}`;
    }
  }

  // Fallback tailored response
  if (mode === 'socratic') {
    return `Excellent inquiry regarding **"${prompt}"** in **${subject}**!\n\nTo develop a rigorous mental model at your **${academicLevel}** stage:\n1. What is the fundamental problem that this concept solves that simpler methods could not?\n2. If you had to explain this to someone with zero technical background, what physical object would you compare it to?\n\nTell me your hypothesis!`;
  }
  return `### Exploring: **${prompt}**\n\nIn **${subject}**, this concept forms a cornerstone for building robust systems.\n\n**1. Foundational Logic:** Every transformation maintains strict boundary invariants to ensure deterministic results.\n**2. Core Mechanism:** Information flows sequentially or recursively, eliminating redundancies.\n**3. Practical Impact:** Directly tested in technical interviews and college semester finals.\n\n*Would you like to explore an example problem or switch to Socratic mode?*`;
}

// 3. APPLICATION CONTROLLER
const App = {
  currentView: 'landing',
  student: null,
  activeQuiz: null,
  currentQIndex: 0,
  quizAnswers: {},
  showRationale: false,
  timerInterval: null,
  timeLeft: 60,
  ttsSpeaking: false,

  init() {
    this.student = EduoraStore.getStudent();
    
    // Check hash route or default
    const hash = window.location.hash.replace('#', '');
    if (hash && ['landing', 'dashboard', 'tutor', 'quizzes', 'study-plan', 'analytics', 'resources', 'settings'].includes(hash)) {
      this.switchView(hash);
    } else {
      this.render();
    }

    // Attach global hash change listener
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && h !== this.currentView) {
        this.switchView(h);
      }
    });
  },

  switchView(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  },

  loginAsDemo() {
    this.student = DEFAULT_STUDENT;
    EduoraStore.saveStudent(this.student);
    EduoraStore.setAuthenticated(true);
    this.switchView('dashboard');
  },

  logout() {
    EduoraStore.setAuthenticated(false);
    this.switchView('landing');
  },

  render() {
    const root = document.getElementById('root');
    if (!root) return;

    const isAuth = EduoraStore.isAuthenticated();
    const student = this.student || DEFAULT_STUDENT;

    // Render Navigation
    let navHtml = `
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100/80 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Brand Wordmark -->
            <a href="#landing" onclick="App.switchView('landing')" class="flex items-center gap-2.5">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl gradient-brand text-white shadow-md">
                <svg class="w-5 h-5 text-white animate-pulse-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-extrabold tracking-tight text-slate-900">
                  EDU<span class="text-purple-600">ORA</span>
                </span>
                <span class="text-[10px] -mt-1 font-semibold tracking-wider text-slate-500 uppercase">
                  AI Learning Companion
                </span>
              </div>
            </a>

            <!-- Nav Links -->
            <nav class="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-medium">
              ${!isAuth ? `
                <a href="#landing" onclick="App.switchView('landing')" class="px-3 py-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">Home</a>
                <a href="#features" class="px-3 py-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">Features</a>
                <a href="#how-it-works" class="px-3 py-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">How It Works</a>
                <a href="#about" class="px-3 py-2 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">About</a>
              ` : `
                <button onclick="App.switchView('dashboard')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'dashboard' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">Dashboard</button>
                <button onclick="App.switchView('tutor')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'tutor' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">AI Tutor</button>
                <button onclick="App.switchView('quizzes')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'quizzes' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">Quizzes</button>
                <button onclick="App.switchView('study-plan')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'study-plan' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">Study Plan</button>
                <button onclick="App.switchView('analytics')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'analytics' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">Analytics</button>
                <button onclick="App.switchView('resources')" class="px-3 py-1.5 rounded-xl font-bold ${this.currentView === 'resources' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-purple-700'}">Library & Notes</button>
              `}
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center gap-3">
              ${!isAuth ? `
                <button onclick="App.openLoginModal()" class="text-xs sm:text-sm font-semibold text-slate-700 hover:text-purple-700 px-3 py-2">
                  Login
                </button>
                <button onclick="App.loginAsDemo()" class="px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-all">
                  1-Click Demo
                </button>
                <button onclick="App.openRegisterModal()" class="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 rounded-xl shadow-sm transition-all">
                  Get Started
                </button>
              ` : `
                <div class="flex items-center gap-2">
                  <button onclick="App.switchView('settings')" class="flex items-center gap-2 p-1.5 rounded-full hover:bg-purple-50">
                    <div class="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center">
                      ${student.name.charAt(0)}
                    </div>
                    <span class="text-xs font-bold text-slate-800 hidden sm:inline">${student.name}</span>
                  </button>
                  <button onclick="App.logout()" title="Sign Out" class="p-2 text-slate-400 hover:text-rose-600 text-xs font-semibold">
                    Logout
                  </button>
                </div>
              `}
            </div>
          </div>
        </div>
      </header>
    `;

    // Render View Content
    let bodyHtml = '';
    switch (this.currentView) {
      case 'dashboard':
        bodyHtml = this.renderDashboard();
        break;
      case 'tutor':
        bodyHtml = this.renderAITutor();
        break;
      case 'quizzes':
        bodyHtml = this.renderQuizzes();
        break;
      case 'study-plan':
        bodyHtml = this.renderStudyPlan();
        break;
      case 'analytics':
        bodyHtml = this.renderAnalytics();
        break;
      case 'resources':
        bodyHtml = this.renderResources();
        break;
      case 'settings':
        bodyHtml = this.renderSettings();
        break;
      case 'landing':
      default:
        bodyHtml = this.renderLanding();
        break;
    }

    // Render Footer
    let footerHtml = `
      <footer id="about" class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div class="space-y-4">
              <div class="flex items-center gap-2.5">
                <div class="flex items-center justify-center w-8 h-8 rounded-xl gradient-brand text-white shadow-md">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                </div>
                <span class="text-xl font-extrabold tracking-tight text-white">EDU<span class="text-purple-400">ORA</span></span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed font-normal">"Your Learning. Your Pace. Your Future."</p>
              <p class="text-[11px] text-slate-400">College Micro-Project: AI Tutoring Assistant for Personalized Learning under EdTech and AI.</p>
            </div>
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white">Platform Modules</h4>
              <ul class="space-y-2 text-xs text-slate-400">
                <li><button onclick="App.switchView('tutor')" class="hover:text-purple-300">AI Personal Tutor</button></li>
                <li><button onclick="App.switchView('quizzes')" class="hover:text-purple-300">Adaptive Quizzes</button></li>
                <li><button onclick="App.switchView('study-plan')" class="hover:text-purple-300">Personalized Study Plans</button></li>
                <li><button onclick="App.switchView('analytics')" class="hover:text-purple-300">Performance Analytics</button></li>
              </ul>
            </div>
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
              <ul class="space-y-2 text-xs text-slate-400">
                <li><a href="#features" class="hover:text-purple-300">Core Features</a></li>
                <li><a href="#how-it-works" class="hover:text-purple-300">How It Works</a></li>
                <li><a href="#why-choose" class="hover:text-purple-300">Why Choose EDUORA</a></li>
                <li><button onclick="App.openLoginModal()" class="hover:text-purple-300">Student Login</button></li>
              </ul>
            </div>
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white">Micro-Project Details</h4>
              <p class="text-xs text-slate-400">Industry: EdTech & Applied AI.<br>Autonomous student learning with Socratic feedback, spaced repetition, and diagnostic intelligence.</p>
              <p class="text-[11px] text-purple-400">support@eduora.ai</p>
            </div>
          </div>
          <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© ${new Date().getFullYear()} EDUORA. All rights reserved.</p>
            <p>Engineered for personalized student academic success.</p>
          </div>
        </div>
      </footer>
    `;

    root.innerHTML = navHtml + `<main class="view-container">${bodyHtml}</main>` + footerHtml;

    // Attach view-specific listeners if needed
    if (this.currentView === 'tutor') {
      this.attachTutorListeners();
    }
  },

  // 4. VIEW RENDERERS
  renderLanding() {
    return `
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-[#FAF7FD]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                <span>✦ Next-Gen AI Personalized Tutoring</span>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Learn Smarter.<br>
                <span class="gradient-text">Grow Faster.</span>
              </h1>
              <p class="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                Experience a new way of learning with EDUORA. Your personal AI tutor understands your learning needs, adapts to your pace, and helps you achieve your academic goals.
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button onclick="App.openRegisterModal()" class="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 rounded-2xl shadow-md transition-all">
                  Start Learning Free
                </button>
                <a href="#features" class="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-center">
                  Explore Features
                </a>
                <button onclick="App.loginAsDemo()" class="w-full sm:w-auto px-5 py-3.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl transition-all">
                  1-Click Student Demo (Alex)
                </button>
              </div>
            </div>

            <!-- Preview Dashboard Illustration -->
            <div class="lg:col-span-5">
              <div class="glass-card p-6 border border-purple-100 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-xs">AI</div>
                    <div>
                      <h3 class="text-xs font-bold text-slate-900">EDUORA Socratic Tutor</h3>
                      <p class="text-[10px] text-emerald-600 font-semibold">● Session Active</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-100">Socratic Mode</span>
                </div>
                <div class="space-y-2.5 text-xs">
                  <div class="bg-purple-50 p-3 rounded-2xl rounded-tr-none text-purple-950 font-medium">
                    "How does backpropagation actually adjust neural network weights?"
                  </div>
                  <div class="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-slate-800 space-y-1.5 border border-slate-200/60">
                    <p class="font-bold text-purple-700">Eduora Tutor:</p>
                    <p>Think of tuning an instrument: backprop applies the calculus Chain Rule backwards to compute:</p>
                    <div class="bg-white p-1.5 rounded font-mono text-[11px] text-purple-900 font-bold">w_new = w_old - η * (∂Loss / ∂w)</div>
                    <p class="text-[11px] text-slate-500 italic">"Would you like to solve an example step or see a mental analogy?"</p>
                  </div>
                </div>
                <div class="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
                  <div class="p-2 bg-purple-50/60 rounded-xl">
                    <p class="text-[10px] text-slate-500">DSA Mastery</p>
                    <p class="font-extrabold text-purple-700">84%</p>
                  </div>
                  <div class="p-2 bg-sky-50/60 rounded-xl">
                    <p class="text-[10px] text-slate-500">Daily Streak</p>
                    <p class="font-extrabold text-sky-800">7 Days 🔥</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3-Step How It Works -->
      <section id="how-it-works" class="py-20 bg-white border-y border-purple-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Simple 3-Step Process</span>
            <h2 class="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p class="text-sm text-slate-500">From your first minute, EDUORA personalizes everything to your speed.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">1</div>
              <h3 class="text-base font-bold text-slate-900">Tell us about your learning goals</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Select your academic level, target exam, current knowledge baseline, and weekly study cadence.</p>
            </div>
            <div class="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">2</div>
              <h3 class="text-base font-bold text-slate-900">Learn with your personalized AI tutor</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Engage in 24/7 Socratic dialogue, intuitive analogies, code breakdowns, and audible explanations.</p>
            </div>
            <div class="p-7 rounded-3xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">3</div>
              <h3 class="text-base font-bold text-slate-900">Track your progress and improve</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Take adaptive diagnostic quizzes, log weak concepts automatically, and watch your accuracy climb.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 6 Feature Highlights -->
      <section id="features" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Core Modules</span>
            <h2 class="text-3xl font-extrabold text-slate-900">Platform Features</h2>
            <p class="text-sm text-slate-500">Six intelligent modules designed for deep conceptual mastery.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">🧠</div>
              <h3 class="text-sm font-bold text-slate-900">1. AI Personal Tutor</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Socratic, Explainer, Code & Math, and Exam Prep tutoring available round-the-clock.</p>
            </div>
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">⚡</div>
              <h3 class="text-sm font-bold text-slate-900">2. Adaptive Learning</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Paces lessons dynamically to current knowledge baseline so you never feel overwhelmed.</p>
            </div>
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">📝</div>
              <h3 class="text-sm font-bold text-slate-900">3. Smart Quiz Generator</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Timed adaptive quizzes with real-time feedback and rationale for every answer option.</p>
            </div>
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">📅</div>
              <h3 class="text-sm font-bold text-slate-900">4. Personalized Study Plans</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Multi-week milestone roadmaps with interactive completion tracking and progress bars.</p>
            </div>
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">📊</div>
              <h3 class="text-sm font-bold text-slate-900">5. Performance Analytics</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Subject mastery breakdowns, weak area diagnostics, study streak counters, and badges.</p>
            </div>
            <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-2.5">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">💡</div>
              <h3 class="text-sm font-bold text-slate-900">6. Intelligent Recommendations</h3>
              <p class="text-xs text-slate-600 leading-relaxed">Proactive alerts pinpointing exactly which sub-topics need a 10-minute remediation lesson.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose EDUORA -->
      <section id="why-choose" class="py-20 bg-white border-y border-purple-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Comparison</span>
            <h2 class="text-3xl font-extrabold text-slate-900">Why Choose EDUORA?</h2>
            <p class="text-sm text-slate-500">Traditional courses treat all students identically. EDUORA personalizes to you.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 class="text-base font-bold text-slate-800">Traditional Online Courses</h3>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-center gap-2"><span class="text-rose-500 font-bold">✕</span> One-size-fits-all pre-recorded videos.</li>
                <li class="flex items-center gap-2"><span class="text-rose-500 font-bold">✕</span> No real-time response to your specific confusion.</li>
                <li class="flex items-center gap-2"><span class="text-rose-500 font-bold">✕</span> Static quizzes that don't diagnose underlying gaps.</li>
              </ul>
            </div>
            <div class="p-8 rounded-3xl bg-purple-50/70 border-2 border-purple-300 shadow-md space-y-4">
              <h3 class="text-base font-bold text-purple-950">EDUORA AI Learning Platform</h3>
              <ul class="space-y-2 text-xs text-slate-700">
                <li class="flex items-center gap-2"><span class="text-emerald-600 font-bold">✓</span> Conversational 24/7 AI Tutor with intuitive analogies.</li>
                <li class="flex items-center gap-2"><span class="text-emerald-600 font-bold">✓</span> Automatic weak-area tagging and tailored practice.</li>
                <li class="flex items-center gap-2"><span class="text-emerald-600 font-bold">✓</span> Spaced repetition flashcards and milestone roadmaps.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Learning Statistics (Sample illustrative figures) -->
      <section class="py-16">
        <div class="max-w-5xl mx-auto px-4">
          <div class="p-8 rounded-3xl bg-slate-900 text-white shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p class="text-3xl font-extrabold text-purple-300">94%</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Concept Retention Rate</p>
              <p class="text-[10px] text-slate-500">(Sample demo figure)</p>
            </div>
            <div>
              <p class="text-3xl font-extrabold text-sky-300">2.4x</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Faster Topic Mastery</p>
              <p class="text-[10px] text-slate-500">(Sample demo figure)</p>
            </div>
            <div>
              <p class="text-3xl font-extrabold text-emerald-300">50K+</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Quizzes Solved</p>
              <p class="text-[10px] text-slate-500">(Sample demo figure)</p>
            </div>
            <div>
              <p class="text-3xl font-extrabold text-amber-300">4.9 / 5</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Student Satisfaction</p>
              <p class="text-[10px] text-slate-500">(Sample demo figure)</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-16 bg-white border-t border-purple-100">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center max-w-xl mx-auto mb-12">
            <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">Feedback</span>
            <h2 class="text-2xl font-extrabold text-slate-900 mt-2">Student Testimonials</h2>
            <p class="text-xs text-slate-400 italic mt-1">*Clearly labelled as sample testimonials collected during micro-project pilot trials.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <p class="text-xs text-slate-700 italic">"The Socratic tutor made dynamic programming click for me. Instead of giving me the code, it guided my intuition."</p>
              <p class="text-xs font-bold text-slate-900">— Alex Rivera, CS Undergraduate</p>
            </div>
            <div class="p-6 rounded-2xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <p class="text-xs text-slate-700 italic">"The adaptive quizzes highlight exactly which formulas I mixed up, and directly add them to my study plan."</p>
              <p class="text-xs font-bold text-slate-900">— Sophia Kim, Data Science Major</p>
            </div>
            <div class="p-6 rounded-2xl bg-[#FAF7FD] border border-purple-100 space-y-3">
              <p class="text-xs text-slate-700 italic">"I improved my GPA from 3.2 to 3.8 by following the weekly milestone roadmaps and 7-day study streak."</p>
              <p class="text-xs font-bold text-slate-900">— Marcus Johnson, Engineering</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderDashboard() {
    const student = this.student || DEFAULT_STUDENT;
    const stats = student.stats || {};
    const quizzes = EduoraStore.getQuizzes();
    const plans = EduoraStore.getPlans();
    const activePlan = plans[0] || null;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <!-- Welcome Banner -->
        <div class="p-6 sm:p-8 rounded-3xl gradient-brand text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-1.5">
            <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold">Personalized Portal</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold">Welcome back, ${student.name}! 👋</h1>
            <p class="text-xs text-purple-100">Stage: <span class="font-bold text-white">${student.academicLevel}</span> • Target: <span class="font-bold text-white">${student.targetGoal}</span></p>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div>
              <p class="text-[10px] text-purple-200">Daily Streak</p>
              <p class="text-xl font-extrabold text-white">${student.streakDays} Days 🔥</p>
            </div>
            <div class="h-8 w-px bg-white/20"></div>
            <div>
              <p class="text-[10px] text-purple-200">Today's Target</p>
              <p class="text-xs font-bold text-white">35 / ${student.dailyGoalMinutes} mins</p>
            </div>
          </div>
        </div>

        <!-- AI Diagnostic Alert -->
        <div class="p-4 sm:p-5 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <span class="text-[10px] font-extrabold uppercase bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">AI Diagnostic Recommendation</span>
            <h3 class="text-xs font-bold text-slate-900 mt-1">Reinforce Dynamic Programming (Memoization)</h3>
            <p class="text-xs text-slate-600">Your recorded accuracy in this topic is 48%. Our AI Tutor has prepared a 10-minute micro-lesson.</p>
          </div>
          <button onclick="App.switchView('tutor')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shrink-0">
            Start Micro-Lesson
          </button>
        </div>

        <!-- KPI Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400">Avg Accuracy</p>
            <p class="text-2xl font-extrabold text-purple-700">${stats.avgScore || 84}%</p>
            <p class="text-[10px] text-emerald-600 font-semibold mt-1">+6% this week</p>
          </div>
          <div class="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400">Quizzes Taken</p>
            <p class="text-2xl font-extrabold text-slate-900">${stats.quizzesTaken || quizzes.length}</p>
            <p class="text-[10px] text-slate-500 mt-1">${stats.topicsMastered || 18} Topics Mastered</p>
          </div>
          <div class="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400">Hours Studied</p>
            <p class="text-2xl font-extrabold text-slate-900">${stats.hoursStudied || 16.5}h</p>
            <p class="text-[10px] text-slate-500 mt-1">Consistent pace</p>
          </div>
          <div class="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm">
            <p class="text-[10px] font-bold uppercase text-slate-400">Weak Areas</p>
            <p class="text-2xl font-extrabold text-slate-900">${stats.weakAreas?.length || 2} Logged</p>
            <p class="text-[10px] text-amber-700 font-semibold mt-1">Attention queued</p>
          </div>
        </div>

        <!-- Workspace Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Active Roadmap -->
          <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Active Study Roadmap</h3>
                <p class="text-xs text-slate-500">${activePlan?.title || 'Personalized AI Curriculum'}</p>
              </div>
              <button onclick="App.switchView('study-plan')" class="text-xs font-bold text-purple-600 hover:text-purple-700">View Full Roadmap →</button>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full" style="width: ${activePlan?.progress || 60}%"></div>
            </div>
            <div class="space-y-2 pt-2">
              ${activePlan?.milestones?.slice(0, 3).map(m => `
                <div class="p-3 rounded-xl border flex items-center justify-between text-xs ${m.completed ? 'bg-purple-50/50 border-purple-100 text-purple-950 line-through opacity-75' : 'bg-slate-50 border-slate-200 text-slate-900'}">
                  <span>Week ${m.week}: ${m.title}</span>
                  <span class="text-[10px] font-bold">${m.completed ? '✓ Completed' : 'Pending'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Quick Action Hub -->
          <div class="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-sm space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-purple-900">Quick Launch</h3>
            <button onclick="App.switchView('tutor')" class="w-full p-3 bg-white hover:bg-purple-50 rounded-xl border border-purple-100 text-left text-xs font-bold flex items-center justify-between shadow-sm">
              <span>💬 Chat with AI Tutor</span>
              <span>→</span>
            </button>
            <button onclick="App.switchView('quizzes')" class="w-full p-3 bg-white hover:bg-sky-50 rounded-xl border border-purple-100 text-left text-xs font-bold flex items-center justify-between shadow-sm">
              <span>📝 Take Adaptive Quiz</span>
              <span>→</span>
            </button>
            <button onclick="App.switchView('resources')" class="w-full p-3 bg-white hover:bg-emerald-50 rounded-xl border border-purple-100 text-left text-xs font-bold flex items-center justify-between shadow-sm">
              <span>📚 Flashcards & Notes</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderAITutor() {
    const student = this.student || DEFAULT_STUDENT;
    return `
      <div class="max-w-5xl mx-auto px-4 py-6">
        <div class="bg-white rounded-3xl border border-purple-100 shadow-lg flex flex-col h-[82vh] overflow-hidden">
          <!-- Top Bar -->
          <div class="p-4 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center font-bold text-xs">AI</div>
              <div>
                <h2 class="text-sm font-extrabold text-slate-900">EDUORA AI Tutor</h2>
                <p class="text-[11px] text-slate-500">Tuned to ${student.name} (${student.academicLevel})</p>
              </div>
            </div>

            <!-- Subject & Mode Controls -->
            <div class="flex items-center gap-2">
              <select id="tutor-subject" class="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50">
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Mathematics">Mathematics</option>
              </select>

              <select id="tutor-mode" class="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-purple-200 bg-white">
                <option value="explainer">Intuitive Explainer</option>
                <option value="socratic">Socratic Tutor</option>
                <option value="code_math">Code & Math</option>
                <option value="exam_prep">Exam Prep Coach</option>
              </select>
            </div>
          </div>

          <!-- Chat Thread -->
          <div id="tutor-thread" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7FD]">
            <div class="flex justify-start">
              <div class="max-w-[85%] bg-white p-4 rounded-2xl rounded-tl-none border border-purple-100 text-xs sm:text-sm text-slate-800 space-y-2 shadow-sm">
                <p class="font-bold text-purple-700">EDUORA AI Tutor:</p>
                <p>Hello <strong>${student.name}</strong>! I am your personal AI learning companion. How would you like to explore today? Ask me to explain a tricky theorem, write code, or quiz your understanding!</p>
              </div>
            </div>
          </div>

          <!-- Suggestions Bar -->
          <div class="px-4 py-2 bg-slate-50 border-t border-purple-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span class="font-bold text-slate-400 shrink-0">Try asking:</span>
            <button onclick="App.askSuggestedPrompt('Explain dynamic programming')" class="shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-purple-300">Dynamic Programming</button>
            <button onclick="App.askSuggestedPrompt('Explain neural networks with an analogy')" class="shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-purple-300">Neural Networks Analogy</button>
            <button onclick="App.askSuggestedPrompt('Compare Dijkstra vs Bellman-Ford')" class="shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-purple-300">Dijkstra vs Bellman-Ford</button>
            <button onclick="App.askSuggestedPrompt('Explain Eigenvalues and Eigenvectors intuitively')" class="shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-purple-300">Eigenvalues</button>
          </div>

          <!-- Input Bar -->
          <div class="p-4 bg-white border-t border-purple-100">
            <form id="tutor-form" class="flex items-center gap-2">
              <input id="tutor-input" type="text" placeholder="Type your academic question..." class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500" required />
              <button type="submit" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm">Send</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  attachTutorListeners() {
    const form = document.getElementById('tutor-form');
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('tutor-input');
      const text = input.value.trim();
      if (!text) return;
      this.sendTutorMessage(text);
      input.value = '';
    };
  },

  askSuggestedPrompt(text) {
    this.sendTutorMessage(text);
  },

  sendTutorMessage(text) {
    const thread = document.getElementById('tutor-thread');
    const subject = document.getElementById('tutor-subject')?.value || 'Artificial Intelligence';
    const mode = document.getElementById('tutor-mode')?.value || 'explainer';
    const student = this.student || DEFAULT_STUDENT;

    // Append user message
    const userDiv = document.createElement('div');
    userDiv.className = 'flex justify-end';
    userDiv.innerHTML = `
      <div class="max-w-[85%] bg-purple-600 text-white p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm shadow-sm font-medium">
        ${text}
      </div>
    `;
    thread.appendChild(userDiv);

    // AI formulation response
    setTimeout(() => {
      const aiResponse = queryEduoraAI(text, subject, mode, student.name, student.academicLevel);
      const aiDiv = document.createElement('div');
      aiDiv.className = 'flex justify-start';
      aiDiv.innerHTML = `
        <div class="max-w-[85%] bg-white p-4 rounded-2xl rounded-tl-none border border-purple-100 text-xs sm:text-sm text-slate-800 space-y-2 shadow-sm whitespace-pre-wrap">
          <div class="flex items-center justify-between pb-1 border-b border-slate-100">
            <span class="font-bold text-purple-700">EDUORA AI Tutor (${mode}):</span>
            <button onclick="App.speakText(this)" data-content="${encodeURIComponent(aiResponse)}" class="text-[10px] text-purple-600 font-bold hover:underline">🔊 Read Audio</button>
          </div>
          <div>${aiResponse}</div>
          <div class="pt-2 border-t border-slate-100 flex justify-end">
            <button onclick="App.saveTutorNote('${encodeURIComponent(text)}', '${encodeURIComponent(aiResponse)}')" class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">Save to Notebook</button>
          </div>
        </div>
      `;
      thread.appendChild(aiDiv);
      thread.scrollTop = thread.scrollHeight;
    }, 400);

    thread.scrollTop = thread.scrollHeight;
  },

  speakText(btn) {
    if (!('speechSynthesis' in window)) return;
    if (this.ttsSpeaking) {
      window.speechSynthesis.cancel();
      this.ttsSpeaking = false;
      btn.innerText = '🔊 Read Audio';
      return;
    }
    const raw = decodeURIComponent(btn.getAttribute('data-content')).replace(/[#*`_>]/g, '');
    const u = new SpeechSynthesisUtterance(raw);
    u.rate = 1.0;
    u.onend = () => { this.ttsSpeaking = false; btn.innerText = '🔊 Read Audio'; };
    this.ttsSpeaking = true;
    btn.innerText = '⏹ Stop Audio';
    window.speechSynthesis.speak(u);
  },

  saveTutorNote(rawTitle, rawContent) {
    const title = decodeURIComponent(rawTitle);
    const content = decodeURIComponent(rawContent);
    const notes = EduoraStore.getNotes();
    notes.unshift({
      id: `note-${Date.now()}`,
      title: `AI Note: ${title}`,
      subject: 'AI Tutor Session',
      content,
      updatedAt: new Date().toLocaleDateString()
    });
    EduoraStore.saveNotes(notes);
    alert('Note saved to your Notebook!');
  },

  renderQuizzes() {
    const history = EduoraStore.getQuizzes();
    return `
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">Assessment</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Smart Adaptive Quiz Generator</h1>
          <p class="text-xs text-slate-500">Timed concept evaluations with instant rationale feedback.</p>
        </div>

        <!-- Quiz Container -->
        <div id="quiz-box" class="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
          <h3 class="text-base font-bold text-slate-900">Configure Your Diagnostic Quiz</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-700">Subject</label>
              <select id="quiz-subject" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1">
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Linear Algebra">Linear Algebra</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700">Topic</label>
              <input id="quiz-topic" type="text" value="Neural Networks" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" />
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700">Difficulty</label>
              <select id="quiz-diff" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1">
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button onclick="App.startQuiz()" class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm">
            Generate 5-Question Quiz
          </button>
        </div>

        <!-- History -->
        <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900">Quiz History & Analytics</h3>
          <div class="space-y-2">
            ${history.map(q => `
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p class="font-bold text-slate-900">${q.title}</p>
                  <p class="text-[10px] text-slate-500">${q.subject} • ${q.difficulty}</p>
                </div>
                <span class="px-2.5 py-1 rounded-full font-bold ${q.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${q.score}/${q.maxScore} (${q.percentage}%)
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  startQuiz() {
    const subject = document.getElementById('quiz-subject')?.value || 'Artificial Intelligence';
    const topic = document.getElementById('quiz-topic')?.value || 'Core';
    const diff = document.getElementById('quiz-diff')?.value || 'Intermediate';

    const questions = [
      {
        question: 'What is the primary role of the activation function in a neural network?',
        options: [
          'To ensure weights remain between 0 and 1',
          'To introduce non-linearity, allowing the network to learn arbitrary complex patterns',
          'To speed up CPU clock cycles',
          'To normalize the dataset'
        ],
        correct: 1,
        rationale: 'Without non-linear activations (like ReLU or Sigmoid), stacking layers would simply collapse into a single linear transformation.'
      },
      {
        question: 'Which regularizer randomly drops a percentage of neurons during training to prevent co-adaptation?',
        options: ['Batch Normalization', 'Gradient Clipping', 'Dropout', 'Softmax Scaling'],
        correct: 2,
        rationale: 'Dropout deactivates random units during training, forcing the network to learn redundant and robust representations.'
      },
      {
        question: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'],
        correct: 1,
        rationale: 'Worst case O(N^2) happens when the pivot selection repeatedly yields unbalanced partitions (e.g. sorted input with naive pivot).'
      },
      {
        question: 'What does a zero determinant in a square matrix imply?',
        options: ['The matrix is invertible', 'The matrix is singular and has linearly dependent rows', 'The matrix represents orthogonal rotation', 'All eigenvalues are 1'],
        correct: 1,
        rationale: 'A zero determinant squashes volume into a lower dimension, making the matrix irreversible.'
      },
      {
        question: 'What is the average lookup time in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correct: 1,
        rationale: 'Balanced trees maintain strict height guarantees bounded by log2(N).'
      }
    ];

    this.activeQuiz = { subject, topic, diff, questions, currentIdx: 0, score: 0 };
    this.renderActiveQuizQuestion();
  },

  renderActiveQuizQuestion() {
    const box = document.getElementById('quiz-box');
    if (!box || !this.activeQuiz) return;

    const q = this.activeQuiz.questions[this.activeQuiz.currentIdx];
    const total = this.activeQuiz.questions.length;
    const idx = this.activeQuiz.currentIdx;

    box.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <span class="text-xs font-bold text-purple-700">${this.activeQuiz.subject} • Question ${idx + 1} of ${total}</span>
          <span class="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Score: ${this.activeQuiz.score}/${idx}</span>
        </div>
        <p class="text-sm sm:text-base font-bold text-slate-900">${q.question}</p>
        <div class="space-y-2">
          ${q.options.map((opt, i) => `
            <button onclick="App.selectQuizOption(${i})" class="w-full p-3.5 rounded-xl border border-slate-200 text-left text-xs sm:text-sm hover:border-purple-300 hover:bg-slate-50 transition-all flex items-center gap-3">
              <span class="w-6 h-6 rounded-lg bg-slate-100 font-bold flex items-center justify-center text-xs shrink-0">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  selectQuizOption(chosenIdx) {
    const box = document.getElementById('quiz-box');
    const q = this.activeQuiz.questions[this.activeQuiz.currentIdx];
    const isCorrect = chosenIdx === q.correct;
    if (isCorrect) this.activeQuiz.score++;

    box.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <span class="text-xs font-bold text-purple-700">Question ${this.activeQuiz.currentIdx + 1} of ${this.activeQuiz.questions.length}</span>
          <span class="text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}">${isCorrect ? '✓ Correct Answer' : '✕ Incorrect'}</span>
        </div>
        <p class="text-sm font-bold text-slate-900">${q.question}</p>
        <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
          <p class="font-bold">Educational Rationale:</p>
          <p>${q.rationale}</p>
        </div>
        <button onclick="App.nextQuizQuestion()" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm">
          ${this.activeQuiz.currentIdx + 1 < this.activeQuiz.questions.length ? 'Next Question →' : 'Complete Quiz'}
        </button>
      </div>
    `;
  },

  nextQuizQuestion() {
    this.activeQuiz.currentIdx++;
    if (this.activeQuiz.currentIdx < this.activeQuiz.questions.length) {
      this.renderActiveQuizQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    const box = document.getElementById('quiz-box');
    const score = this.activeQuiz.score;
    const total = this.activeQuiz.questions.length;
    const pct = Math.round((score / total) * 100);

    // Save to history
    const history = EduoraStore.getQuizzes();
    history.unshift({
      id: `q-${Date.now()}`,
      title: `${this.activeQuiz.subject} Quiz`,
      subject: this.activeQuiz.subject,
      difficulty: this.activeQuiz.diff,
      score,
      maxScore: total,
      percentage: pct,
      date: 'Just now'
    });
    EduoraStore.saveQuizzes(history);

    // Confetti celebration if >= 80%
    if (pct >= 80 && typeof confetti === 'function') {
      try { confetti({ particleCount: 80, spread: 60 }); } catch {}
    }

    box.innerHTML = `
      <div class="text-center space-y-4 py-4">
        <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold flex items-center justify-center mx-auto text-lg shadow-md">🏆</div>
        <h3 class="text-lg font-bold text-slate-900">Assessment Completed!</h3>
        <p class="text-3xl font-extrabold text-purple-700">${score} / ${total} (${pct}%)</p>
        <div class="flex justify-center gap-3 pt-2">
          <button onclick="App.switchView('tutor')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600">Discuss with AI Tutor</button>
          <button onclick="App.switchView('quizzes')" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100">Take Another</button>
        </div>
      </div>
    `;
  },

  renderStudyPlan() {
    const plans = EduoraStore.getPlans();
    return `
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">Roadmaps</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Personalized Study Plans</h1>
            <p class="text-xs text-slate-500">Multi-week structured milestone roadmaps.</p>
          </div>
          <button onclick="App.openNewPlanPrompt()" class="px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-xl shadow-sm">+ New Roadmap</button>
        </div>

        <div class="space-y-6">
          ${plans.map(p => `
            <div class="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">${p.subject}</span>
                  <h3 class="text-base font-bold text-slate-900 mt-1">${p.title}</h3>
                  <p class="text-xs text-slate-500">Goal: ${p.goal}</p>
                </div>
                <div class="text-left sm:text-right">
                  <p class="text-xs font-bold text-purple-700">${p.progress}% Complete</p>
                </div>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="gradient-brand h-full rounded-full" style="width: ${p.progress}%"></div>
              </div>
              <div class="space-y-2 pt-2">
                ${p.milestones.map(m => `
                  <div onclick="App.toggleMilestone('${p.id}', '${m.id}')" class="p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${m.completed ? 'bg-purple-50/50 border-purple-200 text-purple-950 line-through opacity-75' : 'bg-slate-50 border-slate-200 text-slate-900'}">
                    <span>Week ${m.week}: ${m.title}</span>
                    <span class="text-[10px] font-bold">${m.completed ? '✓ Done' : '○ Click to complete'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleMilestone(planId, milestoneId) {
    const plans = EduoraStore.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const m = plan.milestones.find(item => item.id === milestoneId);
    if (!m) return;
    m.completed = !m.completed;
    const completedCount = plan.milestones.filter(item => item.completed).length;
    plan.progress = Math.round((completedCount / plan.milestones.length) * 100);
    EduoraStore.savePlans(plans);
    this.render();
  },

  openNewPlanPrompt() {
    const goal = prompt('Enter your target subject or exam goal (e.g. Master Tree Algorithms in 3 weeks):');
    if (!goal) return;
    const plans = EduoraStore.getPlans();
    plans.unshift({
      id: `plan-${Date.now()}`,
      title: `${goal} Roadmap`,
      subject: 'Computer Science',
      goal,
      durationWeeks: 3,
      progress: 33,
      milestones: [
        { id: 'm1', week: 1, title: 'Foundations and Core Principles', description: 'Review fundamentals and mental models.', completed: true },
        { id: 'm2', week: 2, title: 'Deep Implementation & Pattern Practice', description: 'Conquer edge cases and complexity.', completed: false },
        { id: 'm3', week: 3, title: 'Timed Practice & Capstone Mock Test', description: 'Exam readiness review.', completed: false }
      ]
    });
    EduoraStore.savePlans(plans);
    this.render();
  },

  renderAnalytics() {
    const student = this.student || DEFAULT_STUDENT;
    const prof = student.stats?.subjectProficiency || { 'Artificial Intelligence': 88, 'Data Structures': 82 };
    const weakAreas = student.stats?.weakAreas || [];

    return `
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">Diagnostics</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Performance Analytics</h1>
          <p class="text-xs text-slate-500">Real-time mastery metrics and weak area diagnosis.</p>
        </div>

        <!-- Mastery Progress Bars -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <h3 class="text-sm font-bold text-slate-900">Subject Mastery Breakdown</h3>
          <div class="space-y-3.5">
            ${Object.entries(prof).map(([k, v]) => `
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-bold text-slate-700">
                  <span>${k}</span>
                  <span class="text-purple-700">${v}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div class="gradient-brand h-full rounded-full" style="width: ${v}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Weak Areas -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900">Weak Area Diagnostics</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${weakAreas.map(w => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-slate-900">${w.topic}</span>
                  <span class="text-rose-600">${w.confidence}%</span>
                </div>
                <button onclick="App.switchView('tutor')" class="w-full py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold">Practice with AI Tutor</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderResources() {
    const flashcards = EduoraStore.getFlashcards();
    const notes = EduoraStore.getNotes();

    return `
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <span class="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">Retention Hub</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Library, Flashcards & Notes</h1>
          <p class="text-xs text-slate-500">Spaced repetition review and saved notes.</p>
        </div>

        <!-- Flashcards -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-900">Interactive Flashcards (Click card to reveal answer)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${flashcards.map(fc => `
              <div onclick="App.flipFlashcard(this)" class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm cursor-pointer min-h-[160px] flex flex-col justify-between space-y-3">
                <div class="text-[10px] font-bold text-purple-700 uppercase">${fc.subject}</div>
                <div class="fc-front text-xs sm:text-sm font-bold text-slate-900">${fc.question}</div>
                <div class="fc-back text-xs text-slate-700 hidden">${fc.answer}</div>
                <div class="text-[10px] text-slate-400">Click to flip</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-4 pt-4 border-t border-purple-100">
          <h3 class="text-sm font-bold text-slate-900">Student Notebook (${notes.length} Notes)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${notes.map(n => `
              <div class="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-2">
                <h4 class="text-xs font-bold text-slate-900">${n.title}</h4>
                <p class="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">${n.content}</p>
                <p class="text-[10px] text-slate-400">${n.updatedAt}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  flipFlashcard(cardEl) {
    const front = cardEl.querySelector('.fc-front');
    const back = cardEl.querySelector('.fc-back');
    if (front.classList.contains('hidden')) {
      front.classList.remove('hidden');
      back.classList.add('hidden');
    } else {
      front.classList.add('hidden');
      back.classList.remove('hidden');
    }
  },

  renderSettings() {
    const student = this.student || DEFAULT_STUDENT;
    return `
      <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 class="text-2xl font-extrabold text-slate-900">Learning Settings</h1>
        <div class="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div>
            <label class="text-xs font-bold text-slate-700">Full Name</label>
            <input id="set-name" type="text" value="${student.name}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700">Academic Stage</label>
            <input id="set-level" type="text" value="${student.academicLevel}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700">Daily Study Target (Minutes)</label>
            <input id="set-mins" type="number" value="${student.dailyGoalMinutes}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" />
          </div>
          <button onclick="App.saveSettings()" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600">Save Preferences</button>
        </div>
      </div>
    `;
  },

  saveSettings() {
    this.student.name = document.getElementById('set-name')?.value || this.student.name;
    this.student.academicLevel = document.getElementById('set-level')?.value || this.student.academicLevel;
    this.student.dailyGoalMinutes = parseInt(document.getElementById('set-mins')?.value) || 45;
    EduoraStore.saveStudent(this.student);
    alert('Settings saved!');
    this.render();
  },

  // 5. MODALS
  openLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl border border-purple-100">
        <div class="text-center space-y-1">
          <h3 class="text-lg font-bold text-slate-900">Student Login</h3>
          <p class="text-xs text-slate-500">Sign in to your personalized AI companion</p>
        </div>
        <div class="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
          <div>
            <p class="font-bold text-purple-900">Demo Student (Alex)</p>
            <p class="text-[10px] text-purple-700">alex.rivera@eduora.ai</p>
          </div>
          <button onclick="App.closeAuthModal(); App.loginAsDemo();" class="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold">1-Click Login</button>
        </div>
        <form onsubmit="event.preventDefault(); App.closeAuthModal(); App.loginAsDemo();" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-slate-700">Email</label>
            <input type="email" value="alex.rivera@eduora.ai" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" required />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700">Password</label>
            <input type="password" value="password123" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" required />
          </div>
          <button type="submit" class="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm">Sign In</button>
        </form>
        <button onclick="App.closeAuthModal()" class="w-full text-center text-xs text-slate-500 hover:text-slate-800">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  openRegisterModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100">
        <div class="text-center space-y-1">
          <h3 class="text-lg font-bold text-slate-900">Create Account</h3>
          <p class="text-xs text-slate-500">Join EDUORA and unlock your AI tutor</p>
        </div>
        <form onsubmit="event.preventDefault(); App.handleRegisterSubmit(this);" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-slate-700">Full Name</label>
            <input id="reg-name" type="text" placeholder="e.g. Maya Lin" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" required />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700">Email Address</label>
            <input id="reg-email" type="email" placeholder="name@university.edu" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1" required />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700">Academic Stage</label>
            <select id="reg-level" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1 bg-white">
              <option value="Undergraduate">Undergraduate</option>
              <option value="High School">High School</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
          <button type="submit" class="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm">Start Onboarding</button>
        </form>
        <button onclick="App.closeAuthModal()" class="w-full text-center text-xs text-slate-500 hover:text-slate-800">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  handleRegisterSubmit(form) {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const level = document.getElementById('reg-level').value;
    
    this.student = {
      ...DEFAULT_STUDENT,
      name,
      email,
      academicLevel: level
    };
    EduoraStore.saveStudent(this.student);
    EduoraStore.setAuthenticated(true);
    this.closeAuthModal();
    this.switchView('dashboard');
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.remove();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  App.init();
}

