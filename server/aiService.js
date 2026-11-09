// EDUORA AI Engine: Supports Google Gemini API + Built-in Intelligent Fallback Knowledge Engine

const KNOWLEDGE_BANK = {
  // Artificial Intelligence & Machine Learning
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
      'Optimal Substructure: An optimal solution to the problem contains optimal solutions to subproblems.',
      'Overlapping Subproblems: The same subproblems are solved repeatedly in a naive recursive tree.',
      'Two approaches: Top-Down with Memoization (recursion + cache) and Bottom-Up with Tabulation (iterative table filling).',
      'Classic examples: Fibonacci, 0/1 Knapsack, Longest Common Subsequence (LCS), Coin Change.'
    ],
    analogy: 'Writing "1 + 1 + 1 + 1 + 1" on paper and asking how many ones there are (5). If you add another "+ 1" to the end, you do not recount from zero; you recall "5" and add one to make 6. That memory is dynamic programming!'
  },
  'binary search': {
    title: 'Binary Search Algorithm',
    summary: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.',
    keyPoints: [
      'Prerequisite: The collection MUST be sorted or monotonic.',
      'Time Complexity: O(log N) — eliminates half the search space with every comparison.',
      'Space Complexity: O(1) iterative or O(log N) recursive call stack.',
      'Boundary conditions: Watch out for integer overflow when computing mid: use mid = low + ((high - low) / 2).'
    ],
    analogy: 'Looking for a word in a 1,000-page dictionary. You open to page 500, see your word starts with "T", and discard pages 1–500 in one second.'
  },
  'recursion': {
    title: 'Recursion in Computer Science',
    summary: 'A method where the solution to a problem depends on solutions to smaller instances of the same problem. A recursive function calls itself until reaching a base condition.',
    keyPoints: [
      'Base Case: The terminating condition that prevents infinite call stacks and stack overflow.',
      'Recursive Step: Progressively moving toward the base case with smaller input.',
      'Call Stack: Each recursive call adds a stack frame holding local variables and return addresses.',
      'Tail Recursion: When the recursive call is the final operation in the function, allowing compiler optimization.'
    ],
    analogy: 'Russian nesting dolls (Matryoshka). You open a doll to find a smaller doll, continuing until you reach the smallest solid doll that cannot be opened (the base case).'
  },
  'calculus': {
    title: 'Differential & Integral Calculus',
    summary: 'The mathematical study of continuous change. Differential calculus concerns rates of change and slopes of curves; integral calculus concerns accumulation of quantities and areas under curves.',
    keyPoints: [
      'Derivative f\'(x): The instantaneous rate of change or tangent slope at a point.',
      'Integral: The limit of a Riemann sum calculating total accumulated change or area.',
      'Fundamental Theorem of Calculus: Links differentiation and integration as inverse processes.',
      'Applications: Machine learning gradient descent, physics kinematics, economic optimization.'
    ],
    analogy: 'A car speedometer measures your instantaneous speed (the derivative of distance over time), while the odometer measures the total accumulated distance traveled (the integral of speed over time).'
  }
};

export async function askAITutor({ message, subject, mode = 'explainer', studentContext = {}, apiKey = '' }) {
  const cleanMsg = (message || '').trim();
  const lowerMsg = cleanMsg.toLowerCase();
  const studentName = studentContext.name || 'Student';
  const level = studentContext.academicLevel || 'Student';

  // 1. If Gemini API key is provided, attempt live LLM call
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  if (activeKey) {
    try {
      const systemInstruction = `You are EDUORA AI, an intelligent, empathetic, and highly capable personal AI tutor.
You are tutoring ${studentName}, who is an ${level} studying ${subject || 'general academics'}.
Selected Mode: ${mode.toUpperCase()}
- Socratic: Ask guiding questions, give subtle clues, do not spoonfeed, encourage student to arrive at the answer.
- Explainer: Provide clear, structured explanations using relatable analogies, bullet points, and key takeaways.
- Code & Math: Provide clean, well-commented code blocks or step-by-step LaTeX-styled mathematical formulas.
- Exam Prep: Focus on high-yield exam points, pitfalls, and rapid retention tips.
Format your answer in clean Markdown. Keep tone encouraging, professional, and clear.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nStudent Question: ${cleanMsg}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            engine: 'Gemini 1.5 Flash (Live AI)',
            mode
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Eduora Intelligent Engine:', err.message);
    }
  }

  // 2. Built-in Eduora Intelligent Knowledge Engine
  // Match keywords or generate tailored pedagogical response
  let matchedTopic = null;
  for (const [key, data] of Object.entries(KNOWLEDGE_BANK)) {
    if (lowerMsg.includes(key)) {
      matchedTopic = data;
      break;
    }
  }

  if (matchedTopic) {
    if (mode === 'socratic') {
      return {
        text: `Hello **${studentName}**! Let's explore **${matchedTopic.title}** together.

Instead of just giving you the textbook definition, consider this thought experiment:
> *${matchedTopic.analogy}*

Now, let me ask you:
1. When you look at how this process works, what do you think would happen if the input values became excessively large?
2. Which component do you think is most vulnerable to errors?

Take a moment to formulate your answer and reply to me. What is your initial intuition?`,
        engine: 'Eduora Socratic Knowledge Engine',
        mode
      };
    }

    if (mode === 'code_math') {
      return {
        text: `### Technical Deep-Dive: **${matchedTopic.title}**

Here is a structured breakdown designed for your **${level}** level:

**Core Architecture & Complexity:**
- **Time Complexity:** O(N log N) / O(V + E) depending on implementation details.
- **Space Complexity:** O(N) auxiliary space.

**Key Mathematical / Algorithmic Principles:**
${matchedTopic.keyPoints.map(kp => `- ${kp}`).join('\n')}

\`\`\`python
# Example Implementation Principle
def solve_concept(data_input):
    """
    Demonstrating core logic for ${matchedTopic.title}
    """
    if not data_input:
        return None
    
    # Process with memoization or optimal traversal
    result = []
    for item in data_input:
        # Step-by-step state transformation
        result.append(item)
    return result
\`\`\`

> **Pro Tip:** In technical interviews or college exams, always state your assumptions and edge cases before writing the code!`,
        engine: 'Eduora Code & Math Engine',
        mode
      };
    }

    if (mode === 'exam_prep') {
      return {
        text: `### 🎯 High-Yield Exam Summary: **${matchedTopic.title}**

**1. Essential Definition (For 2-mark & 5-mark questions):**
${matchedTopic.summary}

**2. Crucial Points Graders Look For:**
${matchedTopic.keyPoints.map(kp => `✅ **${kp}**`).join('\n')}

**3. Common Pitfalls to Avoid:**
- Forgetting boundary conditions and empty base cases.
- Confusing worst-case time complexity with average-case.
- Overlooking the mathematical trade-off between memory and speed.

**4. Quick Self-Test:**
Can you state the primary difference between this and its standard brute-force alternative in 30 seconds?`,
        engine: 'Eduora Exam Prep Engine',
        mode
      };
    }

    // Default: Explainer
    return {
      text: `### Understanding **${matchedTopic.title}**

${matchedTopic.summary}

---

#### 💡 The Intuitive Analogy
> ${matchedTopic.analogy}

---

#### 📌 Core Takeaways
${matchedTopic.keyPoints.map(p => `- ${p}`).join('\n')}

---

Would you like me to walk you through a specific example, test your understanding with a quick quiz question, or write code together?`,
      engine: 'Eduora Adaptive Explainer Engine',
      mode
    };
  }

  // Generic intelligent contextual generator based on subject and prompt
  const topicTitle = cleanMsg.length > 50 ? `${cleanMsg.slice(0, 47)}...` : cleanMsg;

  if (mode === 'socratic') {
    return {
      text: `Great question regarding **"${topicTitle}"** in **${subject || 'your curriculum'}**!

To build a deep understanding, let's break this down into first principles:
1. What is the primary problem or question that **"${cleanMsg}"** is trying to solve?
2. If you had to explain this concept to a classmate who has never seen it before, what is the first foundational building block you would mention?

Give me your best estimate or hypothesis, and we will refine it together step-by-step! 🚀`,
      engine: 'Eduora Socratic AI',
      mode
    };
  }

  if (mode === 'code_math') {
    return {
      text: `### Technical & Mathematical Analysis: **${topicTitle}**

When analyzing **${cleanMsg}** in **${subject}**:

1. **Formal Formulation:**
   We analyze inputs, state transitions, and outputs using rigorous invariants.
   $$\\text{Objective: } \\min_{w} \\mathcal{L}(f(x; w), y) + \\lambda \\Omega(w)$$

2. **Step-by-Step Breakdown:**
   - **Step 1:** Establish input dimensions and verify preconditions.
   - **Step 2:** Formulate recurrence or mathematical transformation.
   - **Step 3:** Optimize space and time bounds.

\`\`\`javascript
// Architectural Template for ${subject}
function analyzeConcept(input) {
  // 1. Validate boundary constraints
  if (input === null || input === undefined) return false;
  
  // 2. Core transform logic
  const processed = [];
  // Apply transformation
  return processed;
}
\`\`\`

Would you like to analyze a specific numerical problem or implementation?`,
      engine: 'Eduora Math & Code AI',
      mode
    };
  }

  if (mode === 'exam_prep') {
    return {
      text: `### 🎯 High-Yield Exam Review: **${topicTitle}**

Here is what you must memorize and practice for exams:

- **Key Definitions:** Be ready to write a concise 2-sentence summary highlighting inputs, mechanisms, and outcomes.
- **Top 3 Concepts Frequently Tested:**
  1. The underlying mathematical or theoretical principle.
  2. The key trade-offs (Speed vs Memory, Precision vs Recall, Bias vs Variance).
  3. Edge cases and failure modes.
- **Scoring Strategy:** Structure your exam response with a diagram/flowchart, bullet points, and an explicit example.

Do you want me to quiz you on this topic right now?`,
      engine: 'Eduora Exam Coach',
      mode
    };
  }

  // Default Explainer
  return {
    text: `### Exploring: **${topicTitle}**

Here is an intuitive, structured breakdown of **${cleanMsg}** tailored for **${studentName}** (${level}):

#### 1. What It Is In Simple Terms
At its heart, this concept addresses how systems in **${subject || 'Science & Tech'}** organize information, transform states, and solve computational or natural bottlenecks.

#### 2. Key Pillars
- **Foundation:** Every complex system relies on fundamental invariants that remain true throughout the process.
- **Mechanism:** Information flows through layers or steps, where each stage refines the output.
- **Application:** Used extensively in industry-standard software, analytical modeling, and academic research.

#### 3. Why It Matters
Mastering this topic gives you the leverage to solve higher-order problems without having to reinvent basic principles from scratch.

*Feel free to ask me to explain any sub-topic in more detail, generate practice problems, or switch to Socratic tutoring mode!*`,
    engine: 'Eduora Adaptive Explainer Engine',
    mode
  };
}

// 2. Smart Quiz Generator
export function generateQuizForTopic({ subject, topic, difficulty = 'Intermediate' }) {
  const quizBank = {
    'Artificial Intelligence': [
      {
        question: 'What is the primary role of the activation function in a neural network?',
        options: [
          'To ensure the weights remain between 0 and 1',
          'To introduce non-linearity, allowing the network to learn complex patterns',
          'To speed up CPU clock cycles during matrix multiplication',
          'To normalize the dataset before training begins'
        ],
        correctIndex: 1,
        explanation: 'Activation functions introduce non-linear properties to the network. Without them, no matter how many layers a neural network has, it would simply behave like a single linear regression model.'
      },
      {
        question: 'Which technique is specifically used to prevent overfitting by randomly setting a fraction of input units to 0 during training?',
        options: [
          'Gradient Clipping',
          'Batch Normalization',
          'Dropout',
          'Softmax Temperature'
        ],
        correctIndex: 2,
        explanation: 'Dropout randomly deactivates a percentage of neurons at each training iteration, preventing neurons from co-adapting too strongly to training noise.'
      },
      {
        question: 'In reinforcement learning, what does the discount factor (gamma) control?',
        options: [
          'The learning rate of the gradient descent optimizer',
          'The importance of immediate rewards versus future cumulative rewards',
          'The size of the replay buffer',
          'The number of episodes before policy evaluation'
        ],
        correctIndex: 1,
        explanation: 'Gamma (between 0 and 1) discounts future rewards. A gamma close to 0 makes the agent short-sighted, while a gamma close to 1 makes it value long-term rewards.'
      },
      {
        question: 'What is the attention mechanism in Transformers primarily designed to overcome in sequence modeling?',
        options: [
          'The vanishing gradient and bottleneck problem of long-distance dependencies in RNNs',
          'High memory cost of convolutional kernels',
          'The requirement of having GPU accelerators',
          'The need for labeled training datasets'
        ],
        correctIndex: 0,
        explanation: 'Self-attention allows the model to directly compute pairwise relationships between all tokens in a sequence regardless of distance, eliminating RNN sequential bottlenecks.'
      },
      {
        question: 'What occurs during the backward pass (backpropagation) of neural network training?',
        options: [
          'Inputs are multiplied by initial weights to calculate predictions',
          'Gradients of the loss function with respect to weights are computed via the chain rule',
          'The dataset is reshuffled for the next epoch',
          'Weights are wiped clean and reset to random values'
        ],
        correctIndex: 1,
        explanation: 'Backpropagation applies the calculus chain rule backwards from the loss output to compute gradients for every trainable parameter.'
      }
    ],
    'Data Structures & Algorithms': [
      {
        question: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'In a balanced BST, tree height is strictly bounded by O(log N). Each comparison halves the remaining subtree.'
      },
      {
        question: 'Which graph traversal algorithm uses a First-In, First-Out (FIFO) Queue data structure?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Topological Sort', 'Tarjan’s Algorithm'],
        correctIndex: 1,
        explanation: 'BFS explores vertices level by level, utilizing a FIFO queue to maintain the frontier.'
      },
      {
        question: 'What two key properties must a problem have to be solved effectively with Dynamic Programming?',
        options: [
          'Monotonic stack and two-pointer behavior',
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property and cyclic dependencies',
          'Sorted inputs and constant space complexity'
        ],
        correctIndex: 1,
        explanation: 'Optimal substructure means an optimal solution is composed of optimal solutions to subproblems; overlapping subproblems means the same subproblems are solved multiple times.'
      },
      {
        question: 'What is the worst-case time complexity of QuickSort, and when does it occur?',
        options: [
          'O(N log N), when the array has distinct elements',
          'O(N^2), when the pivot selection consistently yields unbalanced partitions',
          'O(N), when the array is reversed',
          'O(2^N), when recursion depth exceeds stack limits'
        ],
        correctIndex: 1,
        explanation: 'If the smallest or largest element is repeatedly picked as pivot (e.g., sorted array with naive pivot), partitioning yields subproblems of sizes 0 and N-1, leading to O(N^2).'
      },
      {
        question: 'Which of the following data structures allows O(1) average-time insertion, deletion, and lookup?',
        options: ['Binary Heap', 'Hash Table / HashMap', 'Balanced BST', 'Doubly Linked List'],
        correctIndex: 1,
        explanation: 'Hash tables compute bucket indices via hash functions, achieving O(1) amortized lookup, insert, and delete.'
      }
    ],
    'Mathematics': [
      {
        question: 'If a 2x2 matrix has a determinant equal to 0, what does this signify?',
        options: [
          'The matrix is invertible and has a unique solution',
          'The matrix is singular, has linearly dependent rows/columns, and is not invertible',
          'All eigenvalues of the matrix must be 1',
          'The matrix represents an orthogonal rotation'
        ],
        correctIndex: 1,
        explanation: 'A zero determinant means the matrix squashes space into a lower dimension; therefore, it cannot be inverted.'
      },
      {
        question: 'What is the derivative of f(x) = ln(x) for x > 0?',
        options: ['1 / x', 'e^x', 'x', '1 / (x^2)'],
        correctIndex: 0,
        explanation: 'By fundamental calculus rules, d/dx [ln(x)] = 1/x for all x > 0.'
      },
      {
        question: 'In probability, if events A and B are independent, what is P(A and B)?',
        options: ['P(A) + P(B)', 'P(A) * P(B)', 'P(A) / P(B)', 'P(A) - P(B)'],
        correctIndex: 1,
        explanation: 'Independence means the occurrence of A gives no information about B; thus P(A ∩ B) = P(A) * P(B).'
      },
      {
        question: 'What is the geometric meaning of the dot product of two non-zero vectors being equal to zero?',
        options: [
          'The vectors are parallel and point in the same direction',
          'The vectors are orthogonal (perpendicular) to each other',
          'One vector has infinite magnitude',
          'The vectors lie on the unit sphere'
        ],
        correctIndex: 1,
        explanation: 'u · v = ||u|| ||v|| cos(theta). If dot product is 0 and vectors are non-zero, cos(theta) = 0, meaning theta = 90 degrees (orthogonal).'
      },
      {
        question: 'Which theorem states that for a continuous function on [a, b], there is at least one point c where the derivative equals the average rate of change?',
        options: [
          'Intermediate Value Theorem',
          'Mean Value Theorem',
          'Central Limit Theorem',
          'Cauchy-Schwarz Inequality'
        ],
        correctIndex: 1,
        explanation: 'The Mean Value Theorem guarantees f\'(c) = (f(b) - f(a)) / (b - a) for some c in (a, b).'
      }
    ]
  };

  const selectedCategory = quizBank[subject] || quizBank['Artificial Intelligence'];
  const questions = selectedCategory.slice(0, 5);

  return {
    title: `${topic || subject} Adaptive Assessment`,
    subject: subject || 'Computer Science',
    topic: topic || 'Core Fundamentals',
    difficulty,
    questions
  };
}

// 3. Personalized Study Plan Generator
export function generateStudyPlan({ subject, goal, targetWeeks = 4, knowledgeLevel = 'Intermediate' }) {
  const weeks = Math.max(2, Math.min(8, parseInt(targetWeeks) || 4));

  const milestones = [];
  for (let i = 1; i <= weeks; i++) {
    milestones.push({
      id: `m-${Date.now()}-${i}`,
      week: i,
      title: i === 1 ? 'Foundations, Mental Models & Core Principles'
            : i === 2 ? 'Deep Conceptual Mechanics & Algorithmic Patterns'
            : i === 3 ? 'Practical Implementation & Problem-Solving'
            : `Advanced Optimization & Exam/Project Capstone`,
      description: `Targeted mastery tasks for Week ${i} designed for ${knowledgeLevel} level to reach goal: "${goal}".`,
      completed: i === 1 // first milestone active
    });
  }

  return {
    id: `plan-${Date.now()}`,
    title: `${subject} Mastery Roadmap`,
    subject,
    goal: goal || 'Achieve conceptual mastery and high academic performance',
    durationWeeks: weeks,
    progress: Math.round((1 / weeks) * 100),
    milestones
  };
}

// 4. Intelligent Recommendations
export function generateRecommendations(user) {
  const weakAreas = user?.stats?.weakAreas || [];
  const subjectProf = user?.stats?.subjectProficiency || {};

  const recs = [];

  if (weakAreas.length > 0) {
    const topWeak = weakAreas[0];
    recs.push({
      id: 'rec-weak-1',
      type: 'weak_area',
      priority: 'High',
      title: `Reinforce ${topWeak.topic}`,
      description: `Your recorded accuracy in this topic is ${topWeak.confidence}%. Our AI Tutor has prepared a 10-minute micro-lesson to solidify your foundation.`,
      action: 'Start Micro-Lesson',
      route: '/ai-tutor'
    });
  }

  // Quiz recommendation
  recs.push({
    id: 'rec-quiz-1',
    type: 'practice',
    priority: 'Medium',
    title: 'Adaptive Diagnostic Quiz',
    description: 'Keep your 7-day streak alive! Take a 5-question adaptive quiz to refresh your key memory triggers.',
    action: 'Take Quiz',
    route: '/quizzes'
  });

  // Study plan milestone
  recs.push({
    id: 'rec-plan-1',
    type: 'milestone',
    priority: 'Normal',
    title: 'Next Roadmap Milestone: Convolution & Sequence Models',
    description: 'You are 65% through your current study plan. Complete this week’s module to unlock the next achievement badge.',
    action: 'View Study Plan',
    route: '/study-plan'
  });

  return recs;
}

