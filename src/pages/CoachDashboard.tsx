import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, ArrowRight, 
  Save, Info, Columns, Ghost, Flame, Lock 
} from 'lucide-react';
import AvatarScene from '../components/3d/Avatar';
import { useEngineStore } from '../store/engineStore';
import PremiumOverlay from '../components/PremiumOverlay';

interface Client {
  id: string;
  name: string;
  startWeight?: number;
  currentWeight?: number;
  goalWeight?: number;
  lastCheckIn?: string;
  status?: 'active' | 'pending';
}

const CoachDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { 
    isConsultationMode, setConsultationMode, 
    influences, setInfluences, splitView, toggleSplitView, 
    setUserId, inviteClient, updateClientPermissions,
    fetchCheckins, fetchUser, subscriptionStatus,
    showGhost, toggleGhost, viewMode, setViewMode
  } = useEngineStore();

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

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3000/coaches/clients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await inviteClient(inviteEmail);
    setInviteEmail('');
    fetchClients();
  };

  const handlePermissionToggle = async (clientId: string, bit: number, currentMask: number) => {
    const newMask = currentMask ^ bit;
    await updateClientPermissions(clientId, newMask);
    fetchClients();
  };

  const handleSelectClient = async (client: Client) => {
    setSelectedClient(client);
    setUserId(client.id);
    setConsultationMode(false);
    
    await fetchUser();
    await fetchCheckins();
  };

  const handleConsultationSlider = (key: keyof typeof influences, value: number) => {
    if (isConsultationMode) {
      setInfluences({ [key]: value });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Coach Dashboard</h1>
          <p className="text-gray-500">Manage your clients and their visual progress.</p>
        </div>
        <form onSubmit={handleInvite} className="flex items-center space-x-2">
          <input 
            type="email" 
            placeholder="client@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
            <UserPlus size={18} />
            <span>Invite Client</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-semibold flex items-center space-x-2 text-slate-800">
                <Users size={18} className="text-blue-600" />
                <span>My Clients</span>
              </h2>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {clients.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={`w-full text-left p-4 hover:bg-blue-50 transition flex items-center justify-between group ${
                    selectedClient?.id === client.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-500">
                      {client.lastCheckIn ? `Last check-in: ${client.lastCheckIn}` : client.id}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {client.status === 'pending' && (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded uppercase font-bold">
                        Pending
                      </span>
                    )}
                    <ArrowRight size={16} className={`text-slate-300 group-hover:text-blue-500 transition ${selectedClient?.id === client.id ? 'text-blue-600' : ''}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Client Detail / Visualization */}
        <div className="lg:col-span-2 space-y-8">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                      <span>Progress: <span className="text-blue-600 font-bold">{
                        (selectedClient.startWeight && selectedClient.currentWeight && selectedClient.goalWeight) 
                          ? Math.round(((selectedClient.startWeight - selectedClient.currentWeight) / (selectedClient.startWeight - selectedClient.goalWeight)) * 100) 
                          : 0
                      }%</span></span>
                      <span className="text-slate-200">•</span>
                      <span>Goal: <span className="text-green-600 font-bold">{selectedClient.goalWeight || '-'} lbs</span></span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      <span>Shoulder: {(selectedClient as any).shoulder_cm || '-'} cm</span>
                      <span>Wrist: {(selectedClient as any).wrist_cm || '-'} cm</span>
                      <span>Ankle: {(selectedClient as any).ankle_cm || '-'} cm</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleSplitView}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition text-sm font-medium ${
                        splitView ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Toggle Side-by-Side Comparison"
                    >
                      <Columns size={16} />
                      <span>{splitView ? 'Split On' : 'Split View'}</span>
                    </button>
                    <button 
                      onClick={handleToggleGhost}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition text-sm font-medium ${
                        showGhost ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      } ${subscriptionStatus === 'free' ? 'opacity-70' : ''}`}
                    >
                      <Ghost size={16} />
                      <span>Ghost</span>
                      {subscriptionStatus === 'free' && <Lock size={12} className="ml-1 text-slate-400" />}
                    </button>
                    <button 
                      onClick={handleToggleHeatMap}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition text-sm font-medium ${
                        viewMode === 'heat-map' ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      } ${subscriptionStatus === 'free' ? 'opacity-70' : ''}`}
                    >
                      <Flame size={16} />
                      <span>Heat Map</span>
                      {subscriptionStatus === 'free' && <Lock size={12} className="ml-1 text-slate-400" />}
                    </button>
                    <button 
                      onClick={() => setConsultationMode(!isConsultationMode)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition text-sm font-medium ${
                        isConsultationMode ? 'bg-purple-600 border-purple-600 text-white shadow-purple-200 shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Shield size={16} />
                      <span>{isConsultationMode ? 'Consultation Active' : 'Consultation Mode'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">3D Visualization</h3>
                      {isConsultationMode && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold animate-pulse">Live Editing</span>
                      )}
                    </div>
                    <div className="relative">
                      <AvatarScene />
                      {showUpgradePrompt && subscriptionStatus === 'free' && (
                        <PremiumOverlay feature="Ghost & Heat Map" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 italic text-center leading-tight">
                      {splitView ? 'Comparing Start (Left) vs Current/Consultation (Right)' : (isConsultationMode ? 'Sliders are active. Visual changes will NOT be saved to client data.' : 'Sliders locked. Showing actual client progress.')}
                    </p>

                    {isConsultationMode && (
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 mt-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Visual Waist</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.waist * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.waist}
                            onChange={(e) => handleConsultationSlider('waist', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Visual Fat/Volume</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.weight * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.weight}
                            onChange={(e) => handleConsultationSlider('weight', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Visual Arms</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.arm * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.arm}
                            onChange={(e) => handleConsultationSlider('arm', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Visual Thighs</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.thigh * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.thigh}
                            onChange={(e) => handleConsultationSlider('thigh', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Shoulder Width (Frame)</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.shoulder * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.shoulder}
                            onChange={(e) => handleConsultationSlider('shoulder', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Wrist Thickness (Frame)</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.wrist * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.wrist}
                            onChange={(e) => handleConsultationSlider('wrist', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-slate-600">Ankle Thickness (Frame)</label>
                            <span className="text-xs text-purple-600 font-bold">{Math.round(influences.ankle * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" value={influences.ankle}
                            onChange={(e) => handleConsultationSlider('ankle', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-slate-800">
                      <Shield size={18} className="text-blue-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Client Permissions</h3>
                    </div>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {[
                        { label: 'View Basic Info', bit: 1 },
                        { label: 'View Measurements', bit: 2 },
                        { label: 'View 3D Avatar', bit: 4 },
                        { label: 'Edit Goals', bit: 8 },
                        { label: 'Add Check-ins', bit: 16 },
                      ].map((perm) => {
                        const isEnabled = ((selectedClient as any).permissions & perm.bit) !== 0;
                        return (
                          <div key={perm.bit} className="flex items-center justify-between text-sm">
                            <span className={isEnabled ? 'text-slate-700' : 'text-slate-400'}>{perm.label}</span>
                            <button 
                              onClick={() => handlePermissionToggle(selectedClient.id, perm.bit, (selectedClient as any).permissions)}
                              className={`w-8 h-4 rounded-full relative transition ${isEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                            >
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition ${isEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                            </button>
                          </div>
                        );
                      })}
                      <div className="mt-2 text-[10px] text-slate-400 text-center uppercase font-bold tracking-tighter">
                        Current Mask: {(selectedClient as any).permissions || 0}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-blue-800 uppercase">Internal Coach Notes</h4>
                        <Save size={14} className="text-blue-400 cursor-pointer hover:text-blue-600" />
                      </div>
                      <textarea 
                        className="w-full bg-transparent border-none text-sm text-blue-900 focus:ring-0 placeholder:text-blue-300 resize-none"
                        placeholder="Add a private note about this client's adherence or goals..."
                        rows={4}
                      ></textarea>
                      <div className="flex items-center space-x-1 text-[10px] text-blue-400 mt-2">
                        <Info size={10} />
                        <span>Visible only to you and authorized staff.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-md border border-slate-200 border-dashed p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Users size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 font-serif">Select a Client</h2>
              <p className="text-slate-500 max-w-sm mt-3 leading-relaxed">
                Choose a client from your list to begin a consultation. You can visualize their progress, adjust 'What-If' scenarios, and record private notes.
              </p>
              <div className="mt-8 flex space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                <div className="h-2 w-2 rounded-full bg-slate-200"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
