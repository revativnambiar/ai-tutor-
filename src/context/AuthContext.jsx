import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER_PROFILE = {
  id: 'demo-student-alex',
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
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('eduora_user_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('eduora_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      // If already demo token, preserve demo student
      if (token === 'demo-token-alex') {
        setUser(DEMO_USER_PROFILE);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('eduora_user_cache', JSON.stringify(data.user));
        } else {
          // Check if cached user exists before clearing
          const cached = localStorage.getItem('eduora_user_cache');
          if (cached) {
            setUser(JSON.parse(cached));
          } else {
            localStorage.removeItem('eduora_token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('API connection check failed, using cached profile:', err.message);
        const cached = localStorage.getItem('eduora_user_cache');
        if (cached) {
          try { setUser(JSON.parse(cached)); } catch {}
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('eduora_token', data.token);
        localStorage.setItem('eduora_user_cache', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn('Online login failed, checking fallback credentials:', e.message);
    }

    // Demo student fallback if server is offline
    if (email.toLowerCase() === 'alex.rivera@eduora.ai' && password === 'password123') {
      const demoToken = 'demo-token-alex';
      localStorage.setItem('eduora_token', demoToken);
      localStorage.setItem('eduora_user_cache', JSON.stringify(DEMO_USER_PROFILE));
      setToken(demoToken);
      setUser(DEMO_USER_PROFILE);
      return DEMO_USER_PROFILE;
    }

    throw new Error('Invalid email or password');
  };

  const register = async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('eduora_token', data.token);
        localStorage.setItem('eduora_user_cache', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn('Online register failed, using client fallback:', e.message);
    }

    // Client fallback user
    const newUser = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      academicLevel: formData.academicLevel || 'Undergraduate',
      preferredSubjects: formData.preferredSubjects || ['Computer Science'],
      targetGoal: 'Academic Mastery',
      knowledgeLevel: 'Intermediate',
      learningStyle: 'Step-by-step with practical challenges',
      dailyGoalMinutes: 30,
      streakDays: 1,
      totalStudyMinutes: 0,
      createdAt: new Date().toISOString(),
      onboarded: false,
      stats: {
        quizzesTaken: 0,
        avgScore: 0,
        topicsMastered: 0,
        hoursStudied: 0,
        accuracyRate: 0,
        subjectProficiency: {},
        weakAreas: []
      }
    };

    const clientToken = `token-${Date.now()}`;
    localStorage.setItem('eduora_token', clientToken);
    localStorage.setItem('eduora_user_cache', JSON.stringify(newUser));
    setToken(clientToken);
    setUser(newUser);
    return newUser;
  };

  const demoLogin = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('eduora_token', data.token);
        localStorage.setItem('eduora_user_cache', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn('API demo login fallback:', e.message);
    }

    // Direct fallback
    const demoToken = 'demo-token-alex';
    localStorage.setItem('eduora_token', demoToken);
    localStorage.setItem('eduora_user_cache', JSON.stringify(DEMO_USER_PROFILE));
    setToken(demoToken);
    setUser(DEMO_USER_PROFILE);
    return DEMO_USER_PROFILE;
  };

  const logout = () => {
    localStorage.removeItem('eduora_token');
    localStorage.removeItem('eduora_user_cache');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('eduora_user_cache', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
