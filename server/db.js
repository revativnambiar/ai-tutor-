import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'eduora_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data generator
function getInitialSeedData() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  const demoUserId = 'demo-student-alex';

  return {
    users: [
      {
        id: demoUserId,
        name: 'Alex Rivera',
        email: 'alex.rivera@eduora.ai',
        password: hashedPassword,
        academicLevel: 'Undergraduate',
        targetGoal: 'Master AI & Ace Placement Interviews',
        preferredSubjects: ['Artificial Intelligence', 'Data Structures & Algorithms', 'Linear Algebra', 'Web Engineering'],
        knowledgeLevel: 'Intermediate',
        learningStyle: 'Step-by-step with practical challenges',
        dailyGoalMinutes: 45,
        streakDays: 7,
        totalStudyMinutes: 480,
        createdAt: new Date().toISOString(),
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
      }
    ],
    quizzes: [
      {
        id: 'quiz-init-1',
        userId: demoUserId,
        title: 'Neural Networks & Gradient Descent Fundamentals',
        subject: 'Artificial Intelligence',
        difficulty: 'Intermediate',
        totalQuestions: 5,
        score: 4,
        maxScore: 5,
        percentage: 80,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        weakAreasIdentified: ['Backpropagation calculation']
      },
      {
        id: 'quiz-init-2',
        userId: demoUserId,
        title: 'Binary Search Trees & Graph Traversals (BFS/DFS)',
        subject: 'Data Structures & Algorithms',
        difficulty: 'Medium',
        totalQuestions: 5,
        score: 5,
        maxScore: 5,
        percentage: 100,
        completedAt: new Date(Date.now() - 172800000).toISOString(),
        weakAreasIdentified: []
      }
    ],
    studyPlans: [
      {
        id: 'plan-ai-specialization',
        userId: demoUserId,
        title: 'AI & Deep Learning Mastery Roadmap',
        subject: 'Artificial Intelligence',
        goal: 'Understand core neural architectures and implement transformers',
        durationWeeks: 4,
        progress: 65,
        milestones: [
          {
            id: 'm1',
            week: 1,
            title: 'Foundations of Perceptrons & Loss Functions',
            description: 'Master forward pass, MSE, Cross-Entropy, and activation functions.',
            completed: true
          },
          {
            id: 'm2',
            week: 2,
            title: 'Backpropagation & Optimization Algorithms',
            description: 'Deep dive into computational graphs, SGD, Adam, and momentum.',
            completed: true
          },
          {
            id: 'm3',
            week: 3,
            title: 'Convolutional & Recurrent Networks (CNN & RNN)',
            description: 'Feature maps, kernel convolution, pooling, LSTM and GRU gates.',
            completed: false
          },
          {
            id: 'm4',
            week: 4,
            title: 'Attention Mechanism & Transformer Encoders',
            description: 'Self-attention mathematics, query/key/value projections, multi-head attention.',
            completed: false
          }
        ]
      },
      {
        id: 'plan-dsa-speedrun',
        userId: demoUserId,
        title: 'DSA Competitive & Interview Prep',
        subject: 'Data Structures & Algorithms',
        goal: 'Conquer tree traversals, graphs, and dynamic programming patterns',
        durationWeeks: 3,
        progress: 40,
        milestones: [
          {
            id: 'd1',
            week: 1,
            title: 'Arrays, Two Pointers & Sliding Window',
            description: 'Subarray sum, two-sum variations, fast and slow pointers.',
            completed: true
          },
          {
            id: 'd2',
            week: 2,
            title: 'Binary Trees, Tries & Priority Queues',
            description: 'Lowest Common Ancestor, Trie autocomplete, Min/Max Heaps.',
            completed: false
          },
          {
            id: 'd3',
            week: 3,
            title: 'Dynamic Programming & Memoization Patterns',
            description: 'Knapsack 0/1, Longest Common Subsequence, Grid paths.',
            completed: false
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-1',
        userId: demoUserId,
        title: 'Socratic Summary: Why Overfitting Happens in Deep Models',
        subject: 'Artificial Intelligence',
        content: `Overfitting occurs when a model learns the training noise rather than the underlying pattern.

Key regularizers to prevent overfitting:
1. Dropout (randomly deactivating units during training)
2. Weight Decay / L2 Regularization (penalizing large weight norms)
3. Data Augmentation (synthesizing transformations)
4. Early Stopping (monitoring validation loss plateau)

Rule of thumb: High training accuracy + low validation accuracy = High Variance (Overfitting).`,
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'note-2',
        userId: demoUserId,
        title: 'Mastering Dijkstra’s Shortest Path Algorithm',
        subject: 'Data Structures & Algorithms',
        content: `Dijkstra finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.

Time Complexity: O((V + E) log V) with a Min-Priority Queue / Binary Heap.
Space Complexity: O(V) to store distance array and priority queue.

Note: Cannot handle negative cycles! For negative edges, use Bellman-Ford algorithm.`,
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        userId: demoUserId,
        subject: 'Artificial Intelligence',
        question: 'What is the vanishing gradient problem, and which activation function mitigates it?',
        answer: 'In deep neural networks with Sigmoid or Tanh activations, gradients become exponentially tiny during backpropagation through many layers. ReLU (Rectified Linear Unit) mitigates this by having a constant gradient of 1 for positive inputs.',
        mastered: true
      },
      {
        id: 'fc-2',
        userId: demoUserId,
        subject: 'Artificial Intelligence',
        question: 'What is the role of the Softmax function in multi-class classification?',
        answer: 'Softmax exponentiates raw logits and normalizes them into a probability distribution summing to 1.0, enabling the model to output calibrated class likelihoods.',
        mastered: false
      },
      {
        id: 'fc-3',
        userId: demoUserId,
        subject: 'Data Structures & Algorithms',
        question: 'What is the average and worst-case time complexity of QuickSort?',
        answer: 'Average time complexity is O(N log N). Worst case is O(N^2), which occurs when the chosen pivot is always the smallest or largest element (e.g. already sorted array with naive pivot selection).',
        mastered: true
      },
      {
        id: 'fc-4',
        userId: demoUserId,
        subject: 'Linear Algebra',
        question: 'What does an Eigenvector geometrically represent when a matrix acts on it?',
        answer: 'An eigenvector is a vector whose direction does not change when transformed by a linear matrix; it is only scaled by a factor called the corresponding Eigenvalue (A * v = lambda * v).',
        mastered: false
      }
    ]
  };
}

// Database helper functions
export const db = {
  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialSeedData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
        return initial;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB file, reinitializing seed data:', err);
      const initial = getInitialSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
  },

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing to DB file:', err);
      return false;
    }
  },

  // User operations
  findUserByEmail(email) {
    const data = this.read();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id) {
    const data = this.read();
    return data.users.find(u => u.id === id);
  },

  createUser(userData) {
    const data = this.read();
    data.users.push(userData);
    this.write(data);
    return userData;
  },

  updateUser(id, updates) {
    const data = this.read();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.write(data);
    return data.users[idx];
  },

  // Quizzes operations
  getQuizzesByUser(userId) {
    const data = this.read();
    return data.quizzes.filter(q => q.userId === userId).reverse();
  },

  saveQuiz(quizData) {
    const data = this.read();
    data.quizzes.push(quizData);

    // Update user stats
    const userIdx = data.users.findIndex(u => u.id === quizData.userId);
    if (userIdx !== -1) {
      const user = data.users[userIdx];
      const userQuizzes = data.quizzes.filter(q => q.userId === quizData.userId);
      const totalScorePercent = userQuizzes.reduce((acc, q) => acc + (q.percentage || 0), 0);
      const avgScore = Math.round(totalScorePercent / userQuizzes.length);

      user.stats = user.stats || {};
      user.stats.quizzesTaken = userQuizzes.length;
      user.stats.avgScore = avgScore;
      user.stats.accuracyRate = avgScore;

      // Update subject proficiency
      user.stats.subjectProficiency = user.stats.subjectProficiency || {};
      const currentProf = user.stats.subjectProficiency[quizData.subject] || 70;
      const newProf = Math.round((currentProf * 0.6) + (quizData.percentage * 0.4));
      user.stats.subjectProficiency[quizData.subject] = newProf;

      // Update weak areas if score is below 70
      if (quizData.percentage < 70 && quizData.weakAreasIdentified?.length) {
        user.stats.weakAreas = user.stats.weakAreas || [];
        quizData.weakAreasIdentified.forEach(topic => {
          const existing = user.stats.weakAreas.find(w => w.topic === topic);
          if (existing) {
            existing.confidence = quizData.percentage;
          } else {
            user.stats.weakAreas.push({
              subject: quizData.subject,
              topic: topic,
              confidence: quizData.percentage
            });
          }
        });
      }
    }

    this.write(data);
    return quizData;
  },

  // Study plans operations
  getStudyPlansByUser(userId) {
    const data = this.read();
    return data.studyPlans.filter(p => p.userId === userId);
  },

  saveStudyPlan(planData) {
    const data = this.read();
    data.studyPlans.push(planData);
    this.write(data);
    return planData;
  },

  updateStudyPlan(planId, updates) {
    const data = this.read();
    const idx = data.studyPlans.findIndex(p => p.id === planId);
    if (idx === -1) return null;
    data.studyPlans[idx] = { ...data.studyPlans[idx], ...updates };
    this.write(data);
    return data.studyPlans[idx];
  },

  // Notes operations
  getNotesByUser(userId) {
    const data = this.read();
    return data.notes.filter(n => n.userId === userId).reverse();
  },

  saveNote(noteData) {
    const data = this.read();
    data.notes.push(noteData);
    this.write(data);
    return noteData;
  },

  deleteNote(noteId, userId) {
    const data = this.read();
    const beforeLen = data.notes.length;
    data.notes = data.notes.filter(n => !(n.id === noteId && n.userId === userId));
    this.write(data);
    return data.notes.length < beforeLen;
  },

  // Flashcards operations
  getFlashcardsByUser(userId, subject = null) {
    const data = this.read();
    let cards = data.flashcards.filter(f => f.userId === userId);
    if (subject && subject !== 'All') {
      cards = cards.filter(f => f.subject.toLowerCase() === subject.toLowerCase());
    }
    return cards;
  },

  saveFlashcard(cardData) {
    const data = this.read();
    data.flashcards.push(cardData);
    this.write(data);
    return cardData;
  },

  toggleFlashcardMastery(cardId, userId) {
    const data = this.read();
    const card = data.flashcards.find(f => f.id === cardId && f.userId === userId);
    if (card) {
      card.mastered = !card.mastered;
      this.write(data);
      return card;
    }
    return null;
  }
};

