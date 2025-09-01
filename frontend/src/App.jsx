import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  User, 
  LogOut,
  Eye,
  EyeOff,
  Target,
  Wallet,
  Trophy,
  TrendingUp,
  PlusCircle,
  DollarSign
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Auth Context
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Request Helper
const apiRequest = async (endpoint, options = {}, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (authToken) => {
    try {
      const response = await apiRequest('/auth/profile', {}, authToken);
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
      setUser(null);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name, email, password }
      });
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Login Component
const Login = ({ onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            XPense
          </h1>
          <p className="text-gray-600 mt-2">Financial Wellness Game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Component  
const Register = ({ onSwitchToLogin }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            XPense
          </h1>
          <p className="text-gray-600 mt-2">Join the Financial Wellness Game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiRequest('/dashboard', {}, token);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const nextLevelXP = (user?.profile.level * 100) - user?.profile.xp;
  const xpProgress = (user?.profile.xp % 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                XPense
              </h1>
              <p className="text-gray-600">Financial Wellness Game</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user?.profile.name}</p>
                <p className="text-sm text-gray-600">Level {user?.profile.level}</p>
              </div>
              <button 
                onClick={logout} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.profile.name}! 
          </h2>
          <p className="text-gray-600">Ready to level up your financial game?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* XP Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">XP Points</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{user?.profile.xp || 0}</p>
            <div className="mt-3">
              <div className="bg-blue-400 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{nextLevelXP} XP to next level</p>
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Level</h3>
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{user?.profile.level || 1}</p>
            <p className="text-sm mt-1">Financial Warrior</p>
          </div>

          {/* Badges Card */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Badges</h3>
              <Target className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{user?.profile.badges?.length || 0}</p>
            <p className="text-sm mt-1">Achievements earned</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Streak</h3>
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">{user?.profile.streak || 0}</p>
            <p className="text-sm mt-1">Days active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500 text-left">
            <div className="flex items-center mb-3">
              <PlusCircle className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="font-semibold text-gray-900">Add Transaction</h3>
            </div>
            <p className="text-gray-600 text-sm">Record your income or expenses</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500 text-left">
            <div className="flex items-center mb-3">
              <Target className="w-6 h-6 text-purple-500 mr-3" />
              <h3 className="font-semibold text-gray-900">Create Goal</h3>
            </div>
            <p className="text-gray-600 text-sm">Set a new financial goal</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500 text-left">
            <div className="flex items-center mb-3">
              <Trophy className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="font-semibold text-gray-900">View Challenges</h3>
            </div>
            <p className="text-gray-600 text-sm">Take on financial challenges</p>
          </button>
        </div>

        {/* Recent Activity / Placeholder for future features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {dashboardData ? (
            <div className="text-gray-600">
              <p>Dashboard data loaded successfully!</p>
              {dashboardData.activeGoals?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Active Goals</h4>
                  <div className="space-y-2">
                    {dashboardData.activeGoals.map((goal, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{goal.title}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                              style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ₹{goal.currentAmount} / ₹{goal.targetAmount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Start your financial journey by adding your first transaction or creating a goal!</p>
            </div>
          )}
        </div>

        {/* Badges Display */}
        {user?.profile.badges?.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h3>
            <div className="flex flex-wrap gap-3">
              {user.profile.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  if (loading) return <LoadingSpinner />;

  if (user) {
    return <Dashboard />;
  }

  return (
    <div>
      {currentView === 'login' && (
        <Login onSwitchToRegister={() => setCurrentView('register')} />
      )}
      {currentView === 'register' && (
        <Register onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </div>
  );
};

// Wrap App with AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth; 