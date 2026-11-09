"""
=============================================================================
EDUORA – Your Personal AI Learning Companion
College Micro-Project: "AI Tutoring Assistant for Personalized Learning"
Streamlit Community Cloud Main Application
=============================================================================
"""

import streamlit as st
import datetime
import json
import time
import requests

# 1. PAGE CONFIGURATION
st.set_page_config(
    page_title="EDUORA – AI Learning Companion",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. CUSTOM CSS STYLING
st.markdown("""
<style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    /* Brand Background and Header Styling */
    .stApp {
        background-color: #FAF7FD;
        color: #0F172A;
    }

    /* Gradient Brand Banner */
    .brand-banner {
        background: linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #0284C7 100%);
        color: white;
        padding: 2rem 2.5rem;
        border-radius: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.25);
    }

    /* Soft Card Container */
    .eduora-card {
        background: #FFFFFF;
        border: 1px solid #EBE5FC;
        border-radius: 1.25rem;
        padding: 1.5rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
    }

    /* Subtle Card Hover */
    .eduora-card-interactive {
        background: #FFFFFF;
        border: 1px solid #EBE5FC;
        border-radius: 1.25rem;
        padding: 1.25rem;
        transition: all 0.2s ease;
    }
    .eduora-card-interactive:hover {
        border-color: #7C3AED;
        box-shadow: 0 8px 25px -4px rgba(15, 23, 42, 0.08);
    }

    /* Alert / Recommendation Banner */
    .rec-banner {
        background: linear-gradient(90deg, #F4F0FF 0%, #E0F2FE 100%);
        border: 1px solid #D7CBF8;
        border-radius: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1.25rem;
    }

    /* Metric Badges */
    .badge-purple {
        background-color: #F4F0FF;
        color: #7C3AED;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #EBE5FC;
    }
    
    .badge-emerald {
        background-color: #ECFDF5;
        color: #059669;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid #A7F3D0;
    }

    /* Flashcard Styling */
    .flashcard-box {
        background: #FFFFFF;
        border: 2px solid #EBE5FC;
        border-radius: 1.25rem;
        padding: 1.75rem;
        min-height: 180px;
        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.04);
    }
</style>
""", unsafe_allow_html=True)

# 3. KNOWLEDGE BANK & PEDAGOGICAL AI ENGINE
KNOWLEDGE_BANK = {
    'neural networks': {
        'title': 'Neural Networks & Deep Learning',
        'summary': 'Computational models inspired by biological neurons. They transform input tensors through weighted linear layers and non-linear activations, updating parameters via backpropagation to minimize empirical loss.',
        'keyPoints': [
            'Non-linear activation functions (ReLU, GELU, Sigmoid) allow learning arbitrary non-convex functions.',
            'Forward propagation computes predictions; backward propagation calculates loss gradients using the chain rule.',
            'Optimizers (Adam, SGD with momentum) adjust weight tensors along the negative gradient vector.',
            'Regularization (Dropout, Weight Decay) prevents over-indexing on training noise.'
        ],
        'analogy': 'Imagine a factory assembly line where each worker (neuron) refines a product based on instructions (weights). If the end product has flaws (loss), an inspector sends feedback backwards (backpropagation) so each worker adjusts their technique.'
    },
    'dynamic programming': {
        'title': 'Dynamic Programming (DP)',
        'summary': 'Solves complex problems by decomposing them into simpler overlapping subproblems, solving each subproblem once, and caching their solutions (memoization or tabulation) to prevent redundant computations.',
        'keyPoints': [
            'Optimal Substructure: Optimal problem solution consists of optimal subproblem solutions.',
            'Overlapping Subproblems: The same subproblems are solved multiple times in a naive recursive call tree.',
            'Two Approaches: Top-Down with Memoization (recursion + cache) and Bottom-Up with Tabulation (iterative table filling).',
            'Classic Problems: 0/1 Knapsack, Longest Common Subsequence (LCS), Coin Change, Matrix Chain Multiplication.'
        ],
        'analogy': 'Writing "1 + 1 + 1 + 1 + 1" on paper and asking how many ones there are (5). If you add another "+ 1" to the end, you do not recount from zero; you recall "5" and add one to make 6. That memory is dynamic programming!'
    },
    'dijkstra': {
        'title': 'Dijkstra’s Algorithm vs Bellman-Ford',
        'summary': 'Dijkstra finds single-source shortest paths in weighted graphs with non-negative edges in O((V + E) log V) using a priority queue. Bellman-Ford runs in O(V * E) and safely handles negative edge weights and detects negative cycles.',
        'keyPoints': [
            'Dijkstra greedily finalizes the closest unvisited node using a Min-Heap.',
            'Dijkstra fails with negative weights because distances are locked prematurely.',
            'Bellman-Ford relaxes all edges (V - 1) times to guarantee shortest paths even with negative edges.'
        ],
        'analogy': 'Dijkstra is like a water ripple spreading outward evenly; Bellman-Ford is like checking every road repeatedly until no shorter detours can possibly exist.'
    },
    'eigenvalues': {
        'title': 'Eigenvalues and Eigenvectors',
        'summary': 'An eigenvector of a square matrix is a non-zero vector whose direction remains invariant under the linear transformation, changing only by a scalar factor called the eigenvalue (A * v = lambda * v).',
        'keyPoints': [
            'Geometrically represents axes of pure stretching or compression with zero rotational deflection.',
            'Underpins Principal Component Analysis (PCA), Google PageRank, and quantum state decompositions.',
            'Derived by solving the characteristic equation: det(A - lambda * I) = 0.'
        ],
        'analogy': 'Think of stretching a rubber sheet diagonally. Most arrows drawn on the sheet will rotate, but arrows drawn along the exact diagonal stretch axis will only lengthen or shorten without rotating. Those special arrows are eigenvectors!'
    }
}

def query_ai_tutor(prompt, subject, mode, student_name, academic_level, api_key=""):
    # 1. Live Google Gemini API (if key configured)
    active_key = api_key or st.secrets.get("GEMINI_API_KEY", "")
    if active_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={active_key}"
            system_instruction = f"""You are EDUORA AI, an intelligent, empathetic personal AI tutor.
Student: {student_name} ({academic_level})
Subject: {subject}
Mode: {mode.upper()}
- Socratic: Ask guiding questions, give subtle clues, never spoonfeed.
- Explainer: Provide clear intuitive analogies, bullet points, and key takeaways.
- Code & Math: Provide clean code blocks and LaTeX mathematical derivations.
- Exam Prep: Focus on scoring criteria, common pitfalls, and memory mnemonics."""
            
            payload = {
                "contents": [{"role": "user", "parts": [{"text": f"{system_instruction}\n\nStudent Question: {prompt}"}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000}
            }
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if text:
                    return text, "Gemini 1.5 Flash (Live AI)"
        except Exception as e:
            pass

    # 2. Eduora Intelligent Built-in Pedagogical Knowledge Engine
    p_lower = prompt.lower()
    for key, item in KNOWLEDGE_BANK.items():
        if key in p_lower:
            if mode == 'socratic':
                return f"""Hello **{student_name}**! Let's explore **{item['title']}** together.

Instead of just memorizing definitions, consider this thought experiment:
> *{item['analogy']}*

Now, let me ask you:
1. When input scales by a factor of 100, which component becomes the immediate bottleneck?
2. What edge condition would break this model entirely?

What does your initial intuition say? Reply below and we will refine it step-by-step! 🚀""", "Eduora Socratic Engine"
            
            elif mode == 'code_math':
                kps = "\n".join([f"- {kp}" for kp in item['keyPoints']])
                return f"""### Technical & Mathematical Analysis: **{item['title']}**

**Complexity Bounds:** O(N log N) / O(V + E) auxiliary space O(N)

**Mathematical Invariant:**
$$\\min_{{\\theta}} \\mathcal{{L}}(f(x; \\theta), y) + \\lambda \\|\\theta\\|^2$$

**Core Invariants:**
{kps}

```python
# Optimal Implementation Template
def solve_concept(inputs):
    if not inputs:
        return None
    # State transformation with memoization
    memo = {{}}
    return memo
```""", "Eduora Code & Math Engine"

            elif mode == 'exam_prep':
                kps = "\n".join([f"✅ **{kp}**" for kp in item['keyPoints']])
                return f"""### 🎯 High-Yield Exam Review: **{item['title']}**

**1. Essential Definition (For 2-5 Mark Questions):**
{item['summary']}

**2. Key Scoring Criteria:**
{kps}

**3. Common Pitfalls to Avoid:**
- Forgetting base cases and empty boundary constraints.
- Confusing average-case with worst-case bounds.""", "Eduora Exam Coach"

            else:
                kps = "\n".join([f"- {kp}" for kp in item['keyPoints']])
                return f"""### Understanding **{item['title']}**

{item['summary']}

---
#### 💡 The Intuitive Analogy
> {item['analogy']}

---
#### 📌 Core Takeaways
{kps}

*Would you like to explore an example problem or test your understanding with a quiz?*""", "Eduora Explainer Engine"

    # Contextual Tailored Fallback
    if mode == 'socratic':
        return f"""Great question regarding **"{prompt}"** in **{subject}**!

To build an intuitive mental model for your **{academic_level}** stage:
1. What fundamental challenge does this concept solve that simpler approaches could not?
2. If you had to explain this using an everyday physical object, what would you compare it to?

Tell me your hypothesis! 🚀""", "Eduora Socratic AI"
    
    return f"""### Conceptual Analysis: **{prompt}**

In **{subject}**, this concept forms a cornerstone for building robust systems:

1. **Foundational Mechanism:** State invariants guarantee deterministic outputs across transformations.
2. **Computational Leverage:** Subproblems or layers iteratively reduce entropy and eliminate redundant computations.
3. **Exam / Placement Relevance:** Regularly tested in semester finals and technical coding interviews.

*Feel free to ask for code implementations or switch to Socratic mode!*""", "Eduora Adaptive Engine"

# 4. INITIALIZE SESSION STATE
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = True  # Default logged in as demo student for instant grading

if 'student' not in st.session_state:
    st.session_state.student = {
        'name': 'Alex Rivera',
        'email': 'alex.rivera@eduora.ai',
        'academicLevel': 'Undergraduate',
        'targetGoal': 'Master AI & Ace Placement Interviews',
        'preferredSubjects': ['Artificial Intelligence', 'Data Structures & Algorithms', 'Linear Algebra', 'Web Engineering'],
        'knowledgeLevel': 'Intermediate',
        'dailyGoalMinutes': 45,
        'streakDays': 7,
        'totalStudyMinutes': 480,
        'stats': {
            'quizzesTaken': 12,
            'avgScore': 84,
            'topicsMastered': 18,
            'hoursStudied': 16.5,
            'accuracyRate': 86,
            'subjectProficiency': {
                'Artificial Intelligence': 88,
                'Data Structures & Algorithms': 82,
                'Linear Algebra': 76,
                'Web Engineering': 90
            },
            'weakAreas': [
                {'subject': 'Data Structures', 'topic': 'Dynamic Programming (Memoization)', 'confidence': 48},
                {'subject': 'Linear Algebra', 'topic': 'Eigenvalues & Diagonalization', 'confidence': 54},
                {'subject': 'AI', 'topic': 'Backpropagation Gradient Derivation', 'confidence': 62}
            ]
        }
    }

if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = [
        {
            'role': 'assistant',
            'text': f"Hello **Alex Rivera**! I am your **EDUORA AI Tutor**. I am tuned to your **Undergraduate** level in **Artificial Intelligence**. What concept would you like to master today?",
            'engine': 'Eduora AI Tutor'
        }
    ]

if 'study_plans' not in st.session_state:
    st.session_state.study_plans = [
        {
            'id': 'p1',
            'title': 'AI & Deep Learning Mastery Roadmap',
            'subject': 'Artificial Intelligence',
            'goal': 'Understand core neural architectures and implement transformers',
            'durationWeeks': 4,
            'progress': 65,
            'milestones': [
                {'id': 'm1', 'week': 1, 'title': 'Foundations of Perceptrons & Loss Functions', 'completed': True},
                {'id': 'm2', 'week': 2, 'title': 'Backpropagation & Optimization Algorithms', 'completed': True},
                {'id': 'm3', 'week:': 3, 'title': 'Convolutional & Recurrent Networks (CNN & RNN)', 'completed': False},
                {'id': 'm4', 'week': 4, 'title': 'Attention Mechanism & Transformer Encoders', 'completed': False}
            ]
        },
        {
            'id': 'p2',
            'title': 'DSA Competitive & Interview Prep',
            'subject': 'Data Structures & Algorithms',
            'goal': 'Conquer tree traversals, graphs, and dynamic programming patterns',
            'durationWeeks': 3,
            'progress': 40,
            'milestones': [
                {'id': 'd1', 'week': 1, 'title': 'Arrays, Two Pointers & Sliding Window', 'completed': True},
                {'id': 'd2', 'week': 2, 'title': 'Binary Trees, Tries & Priority Queues', 'completed': False},
                {'id': 'd3', 'week': 3, 'title': 'Dynamic Programming & Memoization Patterns', 'completed': False}
            ]
        }
    ]

if 'quiz_history' not in st.session_state:
    st.session_state.quiz_history = [
        {'title': 'Neural Networks & Gradient Descent', 'subject': 'Artificial Intelligence', 'score': 4, 'total': 5, 'pct': 80, 'date': 'Yesterday'},
        {'title': 'BST & Graph Traversals (BFS/DFS)', 'subject': 'Data Structures & Algorithms', 'score': 5, 'total': 5, 'pct': 100, 'date': '3 days ago'}
    ]

if 'notes' not in st.session_state:
    st.session_state.notes = [
        {
            'title': 'Socratic Summary: Overfitting in Deep Models',
            'subject': 'Artificial Intelligence',
            'content': 'Overfitting occurs when model memorizes training noise rather than invariant patterns.\nRegularizers: Dropout, L2 Weight Decay, Data Augmentation, Early Stopping.'
        },
        {
            'title': 'Mastering Dijkstra’s Shortest Path',
            'subject': 'Data Structures & Algorithms',
            'content': 'Dijkstra finds single-source shortest path with non-negative edge weights.\nComplexity: O((V + E) log V) with Min-Priority Queue.'
        }
    ]

if 'flashcards' not in st.session_state:
    st.session_state.flashcards = [
        {
            'subject': 'Artificial Intelligence',
            'question': 'What is the vanishing gradient problem, and which activation mitigates it?',
            'answer': 'In deep networks with Sigmoid/Tanh, gradients become exponentially tiny during backprop. ReLU mitigates this with a constant gradient of 1 for positive inputs.',
            'mastered': True
        },
        {
            'subject': 'Artificial Intelligence',
            'question': 'What is the role of the Softmax function in classification?',
            'answer': 'Softmax exponentiates raw logits and normalizes them into a calibrated probability distribution summing to 1.0.',
            'mastered': False
        },
        {
            'subject': 'Data Structures & Algorithms',
            'question': 'What is the average and worst-case time complexity of QuickSort?',
            'answer': 'Average is O(N log N). Worst case is O(N^2) when pivot selection repeatedly yields unbalanced partitions.',
            'mastered': True
        },
        {
            'subject': 'Linear Algebra',
            'question': 'What does an Eigenvector geometrically represent?',
            'answer': 'A vector whose direction does not rotate under transformation; it is only scaled by the corresponding Eigenvalue (A*v = lambda*v).',
            'mastered': False
        }
    ]

# 5. SIDEBAR NAVIGATION
with st.sidebar:
    st.markdown("""
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
        <div style="background:linear-gradient(135deg, #7C3AED, #0284C7); width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-size:20px; font-weight:800;">🎓</div>
        <div>
            <div style="font-size:20px; font-weight:800; color:#0F172A; line-height:1;">EDU<span style="color:#7C3AED;">ORA</span></div>
            <div style="font-size:10px; color:#64748B; font-weight:600; text-transform:uppercase;">AI Learning Companion</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    if st.session_state.authenticated:
        student = st.session_state.student
        st.markdown(f"""
        <div style="background:#F4F0FF; border:1px solid #EBE5FC; border-radius:12px; padding:10px 14px; margin-bottom:15px;">
            <div style="font-size:12px; font-weight:700; color:#0F172A;">{student['name']}</div>
            <div style="font-size:11px; color:#7C3AED;">{student['academicLevel']}</div>
            <div style="font-size:11px; color:#059669; font-weight:600; margin-top:2px;">Streak: {student['streakDays']} Days 🔥</div>
        </div>
        """, unsafe_allow_html=True)

    page = st.radio(
        "Navigation",
        ["🏠 Home", "📊 Dashboard", "🧠 AI Personal Tutor", "📝 Smart Quizzes", "📅 Study Roadmaps", "📈 Performance Analytics", "📚 Library & Flashcards", "⚙️ Settings"],
        label_visibility="collapsed"
    )

    st.markdown("---")
    if not st.session_state.authenticated:
        if st.button("⚡ 1-Click Demo Student", use_container_width=True):
            st.session_state.authenticated = True
            st.rerun()
    else:
        if st.button("Sign Out", use_container_width=True):
            st.session_state.authenticated = False
            st.rerun()

    st.markdown("""
    <div style="font-size:10px; color:#94A3B8; text-align:center; margin-top:20px;">
        College Micro-Project Edition<br>EdTech & Applied AI
    </div>
    """, unsafe_allow_html=True)

# 6. PAGE ROUTING

# =============================================================================
# PAGE: HOME (LANDING PAGE)
# =============================================================================
if page == "🏠 Home":
    st.markdown("""
    <div class="brand-banner">
        <span class="badge-purple" style="background:rgba(255,255,255,0.2); color:white; border:none;">✦ Next-Gen AI Personalized Tutoring</span>
        <h1 style="font-size:2.8rem; font-weight:800; margin:0.8rem 0 0.5rem 0; line-height:1.15;">
            Learn Smarter.<br>Grow Faster.
        </h1>
        <p style="font-size:1.1rem; opacity:0.92; max-width:650px; margin-bottom:1.5rem;">
            Experience a new way of learning with EDUORA. Your personal AI tutor understands your learning needs, adapts to your pace, and helps you achieve your academic goals.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([3, 2])
    with col1:
        st.markdown("### How EDUORA Works (3-Step Pedagogical Process)")
        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown("""
            <div class="eduora-card">
                <div style="font-size:20px; font-weight:800; color:#7C3AED;">1</div>
                <div style="font-weight:700; font-size:13px; margin:4px 0;">Tell us your goals</div>
                <div style="font-size:11px; color:#64748B;">Select academic level, focus topics, and knowledge baseline.</div>
            </div>
            """, unsafe_allow_html=True)
        with c2:
            st.markdown("""
            <div class="eduora-card">
                <div style="font-size:20px; font-weight:800; color:#6366F1;">2</div>
                <div style="font-weight:700; font-size:13px; margin:4px 0;">Learn with AI Tutor</div>
                <div style="font-size:11px; color:#64748B;">Interactive Socratic dialogue, mental models, and code.</div>
            </div>
            """, unsafe_allow_html=True)
        with c3:
            st.markdown("""
            <div class="eduora-card">
                <div style="font-size:20px; font-weight:800; color:#0284C7;">3</div>
                <div style="font-weight:700; font-size:13px; margin:4px 0;">Track & Improve</div>
                <div style="font-size:11px; color:#64748B;">Adaptive diagnostic tests and weak area matrices.</div>
            </div>
            """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="eduora-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EBE5FC; padding-bottom:8px; margin-bottom:10px;">
                <span style="font-weight:700; font-size:12px; color:#0F172A;">EDUORA Socratic Tutor</span>
                <span class="badge-emerald">● Session Active</span>
            </div>
            <div style="background:#F4F0FF; padding:10px; border-radius:10px; font-size:11px; color:#3B0764; margin-bottom:8px;">
                <strong>Alex Rivera:</strong> "How does backprop adjust weights?"
            </div>
            <div style="background:#F8FAFC; padding:10px; border-radius:10px; font-size:11px; color:#0F172A; border:1px solid #E2E8F0;">
                <strong>Tutor:</strong> By applying the calculus Chain Rule backwards:<br>
                <code>w_new = w_old - η * (∂Loss/∂w)</code>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("### Platform Feature Highlights")
    f1, f2, f3 = st.columns(3)
    with f1:
        st.markdown("🧠 **AI Personal Tutor**: Socratic, Explainer, Code & Math, Exam Prep.")
        st.markdown("⚡ **Adaptive Learning**: Calibrated to your cognitive baseline.")
    with f2:
        st.markdown("📝 **Smart Quiz Generator**: Timed evaluations with instant rationale.")
        st.markdown("📅 **Personalized Study Plans**: Multi-week roadmaps and milestone tracking.")
    with f3:
        st.markdown("📊 **Performance Analytics**: Diagnostic accuracy and weak-area matrices.")
        st.markdown("💡 **Intelligent Recommendations**: Automatic remediation triggers.")

# =============================================================================
# PAGE: DASHBOARD
# =============================================================================
elif page == "📊 Dashboard":
    student = st.session_state.student
    stats = student['stats']

    st.markdown(f"""
    <div class="brand-banner" style="padding:1.5rem 2rem;">
        <span class="badge-purple" style="background:rgba(255,255,255,0.25); color:white; border:none;">Student Portal</span>
        <h2 style="font-size:2rem; font-weight:800; margin:0.4rem 0;">Welcome back, {student['name']}! 👋</h2>
        <p style="margin:0; opacity:0.9; font-size:0.95rem;">Stage: <strong>{student['academicLevel']}</strong> • Target: <strong>{student['targetGoal']}</strong></p>
    </div>
    """, unsafe_allow_html=True)

    # Proactive AI Diagnostic Alert
    st.markdown("""
    <div class="rec-banner">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span class="badge-purple" style="font-size:10px;">AI Diagnostic Alert</span>
                <div style="font-weight:700; font-size:13px; color:#0F172A; margin-top:4px;">Reinforce Dynamic Programming (Memoization)</div>
                <div style="font-size:11px; color:#475569;">Recorded accuracy: 48%. Recommended: 10-minute Socratic micro-lesson.</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # KPI Summary Tiles
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.metric("Avg Accuracy", f"{stats['avgScore']}%", "+6% this week")
    with k2:
        st.metric("Daily Streak", f"{student['streakDays']} Days 🔥", "Consistent")
    with k3:
        st.metric("Topics Mastered", f"{stats['topicsMastered']}", "Across 4 subjects")
    with k4:
        st.metric("Study Time", f"{stats['hoursStudied']} hrs", "On track")

    # Active Roadmap Preview
    active_plan = st.session_state.study_plans[0]
    st.markdown("### Active Study Roadmap")
    st.progress(active_plan['progress'] / 100.0)
    st.caption(f"{active_plan['title']} – {active_plan['progress']}% Completed")

    st.markdown("### Recent Quiz Diagnostics")
    for q in st.session_state.quiz_history[:3]:
        st.markdown(f"**{q['title']}** ({q['subject']}) — **{q['score']}/{q['total']} ({q['pct']}%)** • *{q['date']}*")

# =============================================================================
# PAGE: AI PERSONAL TUTOR
# =============================================================================
elif page == "🧠 AI Personal Tutor":
    st.markdown("## EDUORA AI Personal Tutor")
    st.caption("24/7 Socratic guidance, intuitive analogies, and algorithmic derivations.")

    t_col1, t_col2 = st.columns([1, 1])
    with t_col1:
        subject = st.selectbox(
            "Select Subject",
            ["Artificial Intelligence", "Data Structures & Algorithms", "Linear Algebra", "Mathematics", "Physics"]
        )
    with t_col2:
        mode = st.selectbox(
            "Tutor Mode",
            ["explainer", "socratic", "code_math", "exam_prep"],
            format_func=lambda m: {
                "explainer": "💡 Intuitive Explainer (ELI5 & Analogies)",
                "socratic": "❓ Socratic Tutor (Guiding Questions)",
                "code_math": "💻 Code & Math Breakdown",
                "exam_prep": "🎯 Exam Prep Coach"
            }[m]
        )

    # Suggestion Pills
    st.markdown("**Try asking:**")
    sp1, sp2, sp3, sp4 = st.columns(4)
    suggested_prompt = None
    if sp1.button("Dynamic Programming", use_container_width=True):
        suggested_prompt = "Explain dynamic programming with an analogy"
    if sp2.button("Neural Networks", use_container_width=True):
        suggested_prompt = "How does backpropagation adjust neural weights?"
    if sp3.button("Dijkstra vs Bellman", use_container_width=True):
        suggested_prompt = "Compare Dijkstra vs Bellman-Ford"
    if sp4.button("Eigenvalues", use_container_width=True):
        suggested_prompt = "Explain eigenvalues and eigenvectors intuitively"

    # Display Chat History
    for msg in st.session_state.chat_messages:
        with st.chat_message(msg['role']):
            st.markdown(msg['text'])
            if 'engine' in msg:
                st.caption(f"Engine: {msg['engine']}")

    # User Input
    user_query = st.chat_input("Ask a concept question...")
    effective_query = suggested_prompt or user_query

    if effective_query:
        st.session_state.chat_messages.append({"role": "user", "text": effective_query})
        with st.chat_message("user"):
            st.markdown(effective_query)

        with st.chat_message("assistant"):
            with st.spinner("Formulating pedagogical guidance..."):
                ans_text, engine = query_ai_tutor(
                    effective_query,
                    subject,
                    mode,
                    st.session_state.student['name'],
                    st.session_state.student['academicLevel']
                )
                st.markdown(ans_text)
                st.caption(f"Engine: {engine}")

        st.session_state.chat_messages.append({
            "role": "assistant",
            "text": ans_text,
            "engine": engine
        })

# =============================================================================
# PAGE: SMART QUIZZES
# =============================================================================
elif page == "📝 Smart Quizzes":
    st.markdown("## Smart Adaptive Quiz Generator")
    st.caption("Timed multiple-choice evaluations with instant pedagogical rationales.")

    q_subj = st.selectbox("Subject Focus", ["Artificial Intelligence", "Data Structures & Algorithms", "Mathematics"])
    q_diff = st.select_slider("Adaptive Difficulty", options=["Beginner", "Intermediate", "Advanced"], value="Intermediate")

    QUESTIONS = [
        {
            "q": "What is the primary role of the activation function in a neural network?",
            "opts": [
                "To ensure weights remain between 0 and 1",
                "To introduce non-linearity, allowing the network to learn arbitrary complex patterns",
                "To speed up CPU clock cycles",
                "To normalize the dataset"
            ],
            "ans": 1,
            "rationale": "Without non-linear activations (like ReLU or Sigmoid), stacking layers simply collapses into a single linear transformation."
        },
        {
            "q": "Which technique randomly deactivates neurons during training to prevent overfitting?",
            "opts": ["Batch Normalization", "Gradient Clipping", "Dropout", "Softmax Temperature"],
            "ans": 2,
            "rationale": "Dropout prevents co-adaptation of feature detectors by randomly zeroing activations."
        },
        {
            "q": "What is the worst-case time complexity of QuickSort?",
            "opts": ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"],
            "ans": 1,
            "rationale": "Occurs when pivot selection repeatedly yields unbalanced partitions."
        },
        {
            "q": "What does a zero determinant in a square matrix imply?",
            "opts": ["Matrix is invertible", "Matrix is singular with linearly dependent rows", "All eigenvalues are 1", "Orthogonal rotation"],
            "ans": 1,
            "rationale": "A zero determinant squashes volume into a lower dimension, making inversion impossible."
        },
        {
            "q": "Which graph traversal uses a FIFO Queue?",
            "opts": ["DFS", "BFS", "Topological Sort", "Tarjan’s Algorithm"],
            "ans": 1,
            "rationale": "BFS explores vertices level by level using a First-In, First-Out (FIFO) queue."
        }
    ]

    with st.form("quiz_form"):
        user_picks = []
        for i, item in enumerate(QUESTIONS):
            st.markdown(f"**Q{i+1}: {item['q']}**")
            pick = st.radio(f"Options for Q{i+1}", item['opts'], key=f"q_{i}", label_visibility="collapsed")
            user_picks.append(item['opts'].index(pick))
            st.markdown("---")

        submit_quiz = st.form_submit_button("Submit Quiz for Evaluation", use_container_width=True)

    if submit_quiz:
        score = sum(1 for i, q in enumerate(QUESTIONS) if user_picks[i] == q['ans'])
        total = len(QUESTIONS)
        pct = int((score / total) * 100)

        if pct >= 80:
            st.balloons()
            st.success(f"🎉 Excellent! You scored **{score}/{total} ({pct}%)**")
        else:
            st.warning(f"Score: **{score}/{total} ({pct}%)**. Review the rationales below:")

        for i, q in enumerate(QUESTIONS):
            correct = user_picks[i] == q['ans']
            status = "✅ Correct" if correct else "❌ Incorrect"
            st.markdown(f"**Q{i+1}: {status}**")
            st.info(f"**Educational Rationale:** {q['rationale']}")

        st.session_state.quiz_history.insert(0, {
            'title': f"{q_subj} Diagnostic",
            'subject': q_subj,
            'score': score,
            'total': total,
            'pct': pct,
            'date': 'Just now'
        })

# =============================================================================
# PAGE: STUDY ROADMAPS
# =============================================================================
elif page == "📅 Study Roadmaps":
    st.markdown("## Personalized Study Plans & Roadmaps")
    st.caption("Weekly curriculum checkpoints tailored to your syllabus and target exam.")

    for plan in st.session_state.study_plans:
        with st.expander(f"📌 {plan['title']} ({plan['progress']}% Complete)", expanded=True):
            st.write(f"**Goal:** {plan['goal']} | **Duration:** {plan['durationWeeks']} Weeks")
            st.progress(plan['progress'] / 100.0)

            for m in plan['milestones']:
                chk = st.checkbox(f"{m['title']}", value=m['completed'], key=f"{plan['id']}_{m['id']}")
                m['completed'] = chk

            # Recalculate progress
            done = sum(1 for m in plan['milestones'] if m['completed'])
            plan['progress'] = int((done / len(plan['milestones'])) * 100)

# =============================================================================
# PAGE: PERFORMANCE ANALYTICS
# =============================================================================
elif page == "📈 Performance Analytics":
    st.markdown("## Academic Performance Analytics")
    st.caption("Real-time diagnostics tracking concept confidence and mastery.")

    student = st.session_state.student
    prof = student['stats']['subjectProficiency']
    weak = student['stats']['weakAreas']

    st.markdown("### Subject Mastery Breakdown")
    for subj, val in prof.items():
        st.write(f"**{subj}** — {val}%")
        st.progress(val / 100.0)

    st.markdown("### Weak Area Diagnostics")
    for w in weak:
        st.error(f"⚠️ **{w['topic']}** ({w['subject']}) — Confidence: **{w['confidence']}%** (Remediation Queued)")

# =============================================================================
# PAGE: LIBRARY & FLASHCARDS
# =============================================================================
elif page == "📚 Library & Flashcards":
    tab1, tab2 = st.tabs(["🗂️ Spaced Repetition Flashcards", "📝 Student Notebook"])

    with tab1:
        st.markdown("### Interactive Flashcards")
        for i, card in enumerate(st.session_state.flashcards):
            with st.container():
                st.markdown(f"""
                <div class="flashcard-box">
                    <span class="badge-purple">{card['subject']}</span>
                    <h4 style="margin:10px 0 6px 0; color:#0F172A;">{card['question']}</h4>
                </div>
                """, unsafe_allow_html=True)
                with st.expander("Reveal Answer"):
                    st.info(card['answer'])

    with tab2:
        st.markdown("### Student Notebook")
        for note in st.session_state.notes:
            st.markdown(f"#### {note['title']}")
            st.caption(f"Subject: {note['subject']}")
            st.write(note['content'])
            st.markdown("---")

# =============================================================================
# PAGE: SETTINGS
# =============================================================================
elif page == "⚙️ Settings":
    st.markdown("## Learning Settings & API Configuration")
    student = st.session_state.student

    with st.form("settings_form"):
        new_name = st.text_input("Full Name", value=student['name'])
        new_level = st.selectbox("Academic Stage", ["High School", "Undergraduate", "Postgraduate", "Professional"], index=1)
        new_goal = st.slider("Daily Study Target (Minutes)", min_value=15, max_value=120, value=student['dailyGoalMinutes'], step=15)
        gemini_key = st.text_input("Google Gemini API Key (Optional for Live LLM)", type="password")

        save = st.form_submit_button("Save Preferences")
        if save:
            student['name'] = new_name
            student['academicLevel'] = new_level
            student['dailyGoalMinutes'] = new_goal
            st.success("Preferences updated successfully!")

