import { useEngineStore } from '../store/engineStore';
import { Check, Zap, Shield } from 'lucide-react';

const Subscription = () => {
  const { subscriptionStatus, upgradeSubscription } = useEngineStore();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic visual weight tracking',
      features: [
        '3D Avatar Visualizer',
        'Weight Loss Slider',
        'Weekly Measurement Logging',
        'Basic Progress Charts',
      ],
      current: subscriptionStatus === 'free',
      buttonText: 'Current Plan',
      buttonDisabled: true,
    },
    {
      name: 'Premium',
      price: '$14.99',
      period: '/month',
      description: 'Professional visual coaching tools',
      features: [
        'Everything in Free',
        'Ghost Outline Overlay',
        'Anatomical Heat Maps',
        'Advanced Circumference Tracking',
        'Priority Coach Support',
        'Bone Structure Frame Calibration',
      ],
      current: subscriptionStatus === 'premium',
      buttonText: subscriptionStatus === 'premium' ? 'Current Plan' : 'Upgrade Now',
      buttonDisabled: subscriptionStatus === 'premium',
      highlight: true,
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Choose Your Plan</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Unlock the full power of YouMorph Fitness and transform your weight loss journey with advanced 3D insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 relative flex flex-col ${
              plan.highlight 
                ? 'border-blue-600 shadow-2xl scale-105 z-10' 
                : 'border-slate-100 shadow-xl'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 ml-1 font-medium">{plan.period}</span>}
              </div>
              <p className="text-slate-500 font-medium">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start space-x-3">
                  <div className={`mt-1 rounded-full p-0.5 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Check size={14} />
                  </div>
                  <span className="text-slate-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => !plan.buttonDisabled && upgradeSubscription()}
              disabled={plan.buttonDisabled}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 ${
                plan.buttonDisabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'
              }`}
            >
              {plan.highlight && !plan.buttonDisabled && <Zap size={18} fill="currentColor" />}
              <span>{plan.buttonText}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-blue-400" size={32} />
            <h2 className="text-2xl font-bold">Enterprise & Coaching</h2>
          </div>
          <p className="text-slate-400 max-w-2xl mb-8 leading-relaxed">
            Are you a fitness professional or gym owner? Our B2B licensing includes multi-client dashboards, white-labeling options, and advanced consultation modes.
          </p>
          <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition font-bold border border-white/10">
            Contact Sales for Teams
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
