import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Progress from './pages/Progress';
import CoachDashboard from './pages/CoachDashboard';
import Subscription from './pages/Subscription';
import Login from './pages/Login';
import { LayoutDashboard, Ruler, TrendingUp, Users, LogOut, CreditCard, Star } from 'lucide-react';
import { useEngineStore } from './store/engineStore';

const Sidebar = () => {
  const { setToken, subscriptionStatus, userName } = useEngineStore();
  
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-1 text-blue-400 px-2 font-serif">YouMorph Fitness</h1>
      <div className="px-2 mb-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate max-w-[120px]">{userName || 'User'}</span>
            {subscriptionStatus === 'premium' ? (
              <span className="text-[10px] text-amber-400 font-bold flex items-center">
                <Star size={10} fill="currentColor" className="mr-1" />
                Premium
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 font-bold">Free Plan</span>
            )}
          </div>
        </div>
      </div>
      <nav className="space-y-2 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-3 mb-2">Personal</div>
        <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/measurements" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Ruler size={20} />
          <span>Measurements</span>
        </Link>
        <Link to="/progress" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <TrendingUp size={20} />
          <span>Progress</span>
        </Link>
        <Link to="/subscription" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition">
          <div className="flex items-center space-x-3">
            <CreditCard size={20} />
            <span>Subscription</span>
          </div>
          {subscriptionStatus === 'premium' && <Star size={14} className="text-amber-400" fill="currentColor" />}
        </Link>

        <div className="pt-8 text-[10px] uppercase tracking-widest text-gray-500 font-bold px-3 mb-2">Professional</div>
        <Link to="/coach" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition text-blue-300">
          <Users size={20} />
          <span>Coach Portal</span>
        </Link>
      </nav>
      
      <div className="mt-auto space-y-4">
        <button 
          onClick={() => setToken(null)}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition border border-transparent hover:border-red-900/30"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <div className="text-xs text-gray-500 px-2">
          YouMorph Fitness v1.0
        </div>
      </div>
    </div>
  );
};

function App() {
  const { token, fetchUser, fetchCheckins, fetchInvitations, fetchClients } = useEngineStore();

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCheckins();
      fetchInvitations();
      // Role-based logic could go here, but for now we try to fetch both
      fetchClients();
    }
  }, [token, fetchUser, fetchCheckins, fetchInvitations, fetchClients]);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/coach" element={<CoachDashboard />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
