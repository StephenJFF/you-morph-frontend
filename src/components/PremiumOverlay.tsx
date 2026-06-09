import { Lock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumOverlay = ({ feature }: { feature: string }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center rounded-lg border border-white/10 shadow-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-400/20">
        <Lock className="text-white" size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Unlock {feature}</h3>
      <p className="text-slate-300 text-sm max-w-xs mb-6">
        Upgrade to YouMorph Premium to access advanced 3D visualizations and professional progress tracking.
      </p>
      <button 
        onClick={() => navigate('/subscription')}
        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-6 py-3 rounded-xl transition shadow-xl transform active:scale-95 flex items-center space-x-2"
      >
        <Star size={18} fill="currentColor" />
        <span>Upgrade to Premium</span>
      </button>
      <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold">Just $14.99/month</p>
    </div>
  );
};

export default PremiumOverlay;
