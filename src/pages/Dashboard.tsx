import AvatarScene from '../components/3d/Avatar';
import { useEngineStore } from '../store/engineStore';
import { Ghost, Flame, Info, Columns, Lock, Star } from 'lucide-react';
import { calculateSoftCap, kgToLbs } from '../utils/logic';
import { useState } from 'react';
import PremiumOverlay from '../components/PremiumOverlay';

const Dashboard = () => {
  const { 
    influences, setInfluences, stats, setStats, 
    viewMode, setViewMode, showGhost, toggleGhost, 
    getVisualImpact, splitView, toggleSplitView,
    invitations, respondToInvitation, subscriptionStatus
  } = useEngineStore();

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleToggleGhost = () => {
    if (subscriptionStatus === 'premium') {
      toggleGhost();
    } else {
      setShowUpgradePrompt(true);
    }
  };

  const handleToggleHeatMap = () => {
    if (subscriptionStatus === 'premium') {
      setViewMode(viewMode === 'heat-map' ? 'standard' : 'heat-map');
    } else {
      setShowUpgradePrompt(true);
    }
  };

  const handleInfluenceChange = (key: keyof typeof influences, value: number) => {
    setInfluences({ [key]: value });
  };

  const handleWeightChange = (lbs: number) => {
    // Basic lbs to kg for the engine logic
    const kg = lbs / 2.20462;
    setStats({ currentWeightKg: kg });
  };

  const handleHeightChange = (cm: number) => {
    setStats({ heightCm: cm });
  };

  const softCapKg = calculateSoftCap(stats.heightCm, stats.wristCm, stats.gender);
  const softCapLbs = Math.round(kgToLbs(softCapKg));
  const currentWeightLbs = Math.round(kgToLbs(stats.currentWeightKg));
  const goalWeightLbs = Math.round(kgToLbs(stats.goalWeightKg));
  const impactScore = getVisualImpact();

  // 12-week prediction: roughly 0.5kg/week
  Math.max(stats.goalWeightKg, stats.currentWeightKg - 6);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {subscriptionStatus === 'premium' && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm flex items-center space-x-1">
                <Star size={10} fill="currentColor" />
                <span>Premium Member</span>
              </span>
            )}
          </div>
          <p className="text-gray-500">Visualizing your progress in 3D using the Paper Towel Effect.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={toggleSplitView}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${splitView ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Columns size={18} />
            <span className="text-sm font-medium">Split View</span>
          </button>
          <button 
            onClick={handleToggleGhost}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${showGhost ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} ${subscriptionStatus === 'free' ? 'opacity-70' : ''}`}
          >
            <Ghost size={18} />
            <span className="text-sm font-medium">Ghost Outline</span>
            {subscriptionStatus === 'free' && <Lock size={12} className="ml-1 text-slate-400" />}
          </button>
          <button 
            onClick={handleToggleHeatMap}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${viewMode === 'heat-map' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} ${subscriptionStatus === 'free' ? 'opacity-70' : ''}`}
          >
            <Flame size={18} />
            <span className="text-sm font-medium">Heat Map</span>
            {subscriptionStatus === 'free' && <Lock size={12} className="ml-1 text-slate-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Visual Progress</h2>
            <div className="relative">
              <AvatarScene />
              {showUpgradePrompt && subscriptionStatus === 'free' && (
                <PremiumOverlay feature="Ghost & Heat Map" />
              )}
            </div>
            
            {/* Visual Impact Score Overlay */}
            <div className="absolute top-20 right-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Visual Impact Score</span>
                <Info size={12} className="text-slate-400" />
              </div>
              <div className="text-2xl font-black text-blue-600">{impactScore}</div>
              <div className="w-24 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${impactScore}%` }}></div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-slate-700">Height (cm)</label>
                  <span className="text-xs font-bold text-blue-600">{stats.heightCm} cm</span>
                </div>
                <input 
                  type="range" min="140" max="220" step="1" 
                  value={stats.heightCm}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-slate-700">Weight Simulator (lbs)</label>
                  <span className="text-xs font-bold text-blue-600">{currentWeightLbs} lbs</span>
                </div>
                <input 
                  type="range" min={goalWeightLbs - 10} max={Math.round(kgToLbs(stats.startWeightKg))} step="1" 
                  value={currentWeightLbs}
                  onChange={(e) => handleWeightChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Chest (Morph)</label>
                  <span className="text-xs text-gray-500">{Math.round(influences.chest * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={influences.chest}
                  onChange={(e) => handleInfluenceChange('chest', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Waist (Morph)</label>
                  <span className="text-xs text-gray-500">{Math.round(influences.waist * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={influences.waist}
                  onChange={(e) => handleInfluenceChange('waist', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Hips (Morph)</label>
                  <span className="text-xs text-gray-500">{Math.round(influences.hips * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={influences.hips}
                  onChange={(e) => handleInfluenceChange('hips', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Inseam (Leg Length)</label>
                  <span className="text-xs text-gray-500">{Math.round(influences.inseam * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={influences.inseam}
                  onChange={(e) => handleInfluenceChange('inseam', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                />
              </div>
            </div>
          </div>
        </div>


        <div className="space-y-8">
          {invitations.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-200">
              <h2 className="text-xl font-semibold mb-4 text-purple-900 flex items-center space-x-2">
                <Info size={20} />
                <span>Coach Invitations</span>
              </h2>
              <div className="space-y-4">
                {invitations.map((inv) => (
                  <div key={inv.id} className="bg-white p-4 rounded-lg border border-purple-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-purple-900">{inv.coach_name || 'Coach'}</div>
                      <div className="text-xs text-purple-600">Would like to manage your profile</div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => respondToInvitation(inv.id, 'active')}
                        className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-purple-700 transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => respondToInvitation(inv.id, 'terminated')}
                        className="bg-white text-slate-500 text-xs px-3 py-1.5 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Goal Tracker</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">Current Weight</span>
                <span className="font-bold text-lg">{currentWeightLbs} lbs</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">Goal Weight</span>
                <span className="font-bold text-lg text-green-600">{goalWeightLbs} lbs</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">Ideal Soft Cap</span>
                <span className="font-bold text-lg text-blue-600">{softCapLbs} lbs</span>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Paper Towel Effect</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  As you get leaner, each pound lost is more visually impactful. 
                  <span className="block mt-2 font-bold italic">"The last 10 lbs look like the first 30."</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl shadow-md text-white border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Frame Calibration</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Height</span>
                <span>{stats.heightCm} cm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Wrist</span>
                <span>{stats.wristCm} cm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Calculated Frame</span>
                <span className="font-bold text-blue-300">{calculateSoftCap(stats.heightCm, stats.wristCm, stats.gender) > 0 ? 'Verified' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
