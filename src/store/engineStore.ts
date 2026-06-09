import { create } from 'zustand';
import { calculateVisualInfluence } from '../utils/logic';

interface Influences {
  waist: number;
  hips: number;
  chest: number;
  arm: number;
  thigh: number;
  weight: number;
  height: number;
  shoulder: number;
  wrist: number;
  ankle: number;
}

interface UserStats {
  gender: 'male' | 'female';
  heightCm: number;
  wristCm: number;
  shoulderCm: number;
  ankleCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
}

interface EngineState {
  influences: Influences;
  stats: UserStats;
  viewMode: 'standard' | 'heat-map' | 'ghost-outline';
  showGhost: boolean;
  splitView: boolean;
  isConsultationMode: boolean;
  userId: string | null;
  userName: string | null;
  userRole: 'user' | 'coach' | null;
  token: string | null;
  subscriptionStatus: 'free' | 'premium';
  checkins: any[];
  clients: any[];
  invitations: any[];
  setUserId: (id: string) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  fetchCheckins: () => Promise<void>;
  saveCheckin: (measurements: Partial<UserStats> & Partial<Influences>) => Promise<void>;
  fetchClients: () => Promise<void>;
  inviteClient: (email: string) => Promise<void>;
  updateClientPermissions: (clientId: string, permissions: number) => Promise<void>;
  fetchInvitations: () => Promise<void>;
  respondToInvitation: (invitationId: string, status: 'active' | 'terminated') => Promise<void>;
  upgradeSubscription: () => Promise<void>;
  setInfluences: (influences: Partial<Influences>) => void;
  setStats: (stats: Partial<UserStats>) => void;
  setViewMode: (mode: EngineState['viewMode']) => void;
  toggleGhost: () => void;
  toggleSplitView: () => void;
  setConsultationMode: (enabled: boolean) => void;
  getVisualImpact: () => number;
}

const API_BASE = 'http://localhost:3000';

export const useEngineStore = create<EngineState>((set, get) => ({
  userId: 'e583ebba-7f19-4984-a055-3e6a132f0f7a', // Default test user
  checkins: [],
  clients: [],
  invitations: [],
  influences: {
    waist: 0.5,
    hips: 0.5,
    chest: 0.5,
    arm: 0.5,
    thigh: 0.5,
    weight: 0.5,
    height: 0.5,
    shoulder: 0.5,
    wrist: 0.5,
    ankle: 0.5,
  },
  stats: {
    gender: 'male',
    heightCm: 180,
    wristCm: 17.5,
    shoulderCm: 45,
    ankleCm: 22,
    startWeightKg: 95,
    currentWeightKg: 85,
    goalWeightKg: 75,
  },
  viewMode: 'standard',
  showGhost: false,
  splitView: false,
  isConsultationMode: false,
  subscriptionStatus: 'free',
  token: localStorage.getItem('token'),

  setUserId: (id) => set({ userId: id }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },

  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        set({ userRole: data.role });
        get().setToken(data.token);
        get().setUserId(data.id);
        await get().fetchUser();
        await get().fetchCheckins();
        await get().fetchInvitations();
        if (data.role === 'coach') await get().fetchClients();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  },

  fetchUser: async () => {
    const { userId, token } = get();
    if (!userId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const user = await res.json();
      if (user) {
        set((state) => ({
          subscriptionStatus: user.subscription_tier || 'free',
          userName: user.name || null,
          stats: {
            ...state.stats,
            gender: user.gender || 'male',
            heightCm: user.height_cm || 180,
            wristCm: user.wrist_cm || 17.5,
            shoulderCm: user.shoulder_cm || 45,
            ankleCm: user.ankle_cm || 22,
            goalWeightKg: user.target_weight_kg || 75,
          }
        }));
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  },

  fetchCheckins: async () => {
    const { userId, token } = get();
    if (!userId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/checkins/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const checkins = await res.json();
      if (checkins && checkins.length > 0) {
        // Sort by date descending
        const sorted = checkins.sort((a: any, b: any) => 
          new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
        );
        const latest = sorted[0];
        const start = sorted[sorted.length - 1];

        set((state) => {
          const updatedStats = {
            ...state.stats,
            startWeightKg: start.weight_kg,
            currentWeightKg: latest.weight_kg,
          };

          const visualInfluence = calculateVisualInfluence(
            updatedStats.currentWeightKg,
            updatedStats.startWeightKg,
            updatedStats.goalWeightKg
          );

          return {
            checkins: sorted,
            stats: updatedStats,
            influences: {
              ...state.influences,
              weight: visualInfluence,
              waist: latest.waist_cm ? latest.waist_cm / 120 : 0.5, 
              hips: latest.hips_cm ? latest.hips_cm / 120 : 0.5,
              chest: latest.chest_cm ? latest.chest_cm / 120 : 0.5,
              arm: latest.arm_girth_cm ? latest.arm_girth_cm / 120 : 0.5,
              thigh: latest.thigh_girth_cm ? latest.thigh_girth_cm / 120 : 0.5,
              shoulder: latest.shoulder_cm ? latest.shoulder_cm / 60 : 0.5,
              wrist: latest.wrist_cm ? latest.wrist_cm / 25 : 0.5,
              ankle: latest.ankle_cm ? latest.ankle_cm / 35 : 0.5,
            }
          };
        });
      }
    } catch (err) {
      console.error('Failed to fetch checkins', err);
    }
  },

  saveCheckin: async (data) => {
    const { userId, token, fetchCheckins, fetchUser, stats } = get();
    if (!userId || !token) return;
    try {
      // 1. Update User Profile for constant frame dimensions if provided
      const userUpdate: any = {};
      if (data.shoulder !== undefined) userUpdate.shoulder_cm = data.shoulder * 60;
      if (data.wrist !== undefined) userUpdate.wrist_cm = data.wrist * 25;
      if (data.ankle !== undefined) userUpdate.ankle_cm = data.ankle * 35;
      
      if (Object.keys(userUpdate).length > 0) {
        await fetch(`${API_BASE}/users/${userId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userUpdate),
        });
        await fetchUser();
      }

      // 2. Save Check-in for dynamic measurements
      await fetch(`${API_BASE}/checkins`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          weight_kg: data.currentWeightKg,
          waist_cm: data.waist ? data.waist * 120 : null,
          hips_cm: data.hips ? data.hips * 120 : null,
          chest_cm: data.chest ? data.chest * 120 : null,
          arm_girth_cm: data.arm ? data.arm * 120 : null,
          thigh_girth_cm: data.thigh ? data.thigh * 120 : null,
        }),
      });
      await fetchCheckins();
    } catch (err) {
      console.error('Failed to save checkin', err);
    }
  },

  fetchClients: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/coaches/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const clients = await res.json();
      set({ clients });
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  },

  inviteClient: async (email) => {
    const { token, fetchClients } = get();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/coaches/invite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      });
      await fetchClients();
    } catch (err) {
      console.error('Failed to invite client', err);
    }
  },

  updateClientPermissions: async (clientId, permissions) => {
    const { token, fetchClients } = get();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/coaches/clients/${clientId}/permissions`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permissions }),
      });
      await fetchClients();
    } catch (err) {
      console.error('Failed to update permissions', err);
    }
  },

  fetchInvitations: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/invitations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const invitations = await res.json();
      set({ invitations });
    } catch (err) {
      console.error('Failed to fetch invitations', err);
    }
  },

  respondToInvitation: async (invitationId, status) => {
    const { token, fetchInvitations } = get();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/users/invitations/${invitationId}/respond`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      await fetchInvitations();
    } catch (err) {
      console.error('Failed to respond to invitation', err);
    }
  },

  upgradeSubscription: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (res.ok) {
        set({ subscriptionStatus: 'premium' });
      }
    } catch (err) {
      console.error('Failed to upgrade subscription', err);
    }
  },
  setInfluences: (newInfluences) =>
    set((state) => ({
      influences: { ...state.influences, ...newInfluences },
    })),
  setStats: (newStats) => 
    set((state) => {
      const updatedStats = { ...state.stats, ...newStats };
      // Automatically update the 'weight' influence based on the Paper Towel Effect formula
      const visualInfluence = calculateVisualInfluence(
        updatedStats.currentWeightKg,
        updatedStats.startWeightKg,
        updatedStats.goalWeightKg
      );
      
      return { 
        stats: updatedStats,
        influences: { ...state.influences, weight: visualInfluence }
      };
    }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleGhost: () => set((state) => ({ showGhost: !state.showGhost })),
  toggleSplitView: () => set((state) => ({ splitView: !state.splitView })),
  setConsultationMode: (enabled: boolean) => set({ isConsultationMode: enabled }),
  getVisualImpact: () => {
    const { currentWeightKg, startWeightKg, goalWeightKg } = get().stats;
    const progress = (startWeightKg - currentWeightKg) / (startWeightKg - goalWeightKg);
    const clampedProgress = Math.max(0.01, Math.min(1, progress));
    // Impact is the derivative or rate of change. 
    // For p^1.5, the visual impact score can be modeled as 1.5 * p^0.5 * 100
    return Math.round(1.5 * Math.sqrt(clampedProgress) * 50);
  }
}));
