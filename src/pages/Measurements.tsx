import { useState } from 'react';
import { useEngineStore } from '../store/engineStore';
import { lbsToKg } from '../utils/logic';

const Measurements = () => {
  const { saveCheckin } = useEngineStore();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    weightLbs: '',
    waistInches: '',
    hipsInches: '',
    chestInches: '',
    armInches: '',
    thighInches: '',
    shoulderInches: '',
    wristInches: '',
    ankleInches: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await saveCheckin({
      currentWeightKg: lbsToKg(parseFloat(formData.weightLbs)),
      waist: parseFloat(formData.waistInches) * 2.54 / 120, 
      hips: parseFloat(formData.hipsInches) * 2.54 / 120,
      chest: parseFloat(formData.chestInches) * 2.54 / 120,
      arm: parseFloat(formData.armInches) * 2.54 / 120,
      thigh: parseFloat(formData.thighInches) * 2.54 / 120,
      shoulder: parseFloat(formData.shoulderInches) * 2.54 / 60,
      wrist: parseFloat(formData.wristInches) * 2.54 / 25,
      ankle: parseFloat(formData.ankleInches) * 2.54 / 35,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Weekly Measurements</h1>
      <p className="text-gray-600 mb-8">Enter your latest stats to update your 3D avatar.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">Body Stats</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
                <input 
                  type="number" name="weightLbs" value={formData.weightLbs} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="185" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Waist Circumference (inches)</label>
                <input 
                  type="number" name="waistInches" value={formData.waistInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="36" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hip Circumference (inches)</label>
                <input 
                  type="number" name="hipsInches" value={formData.hipsInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="40" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chest Circumference (inches)</label>
                <input 
                  type="number" name="chestInches" value={formData.chestInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="42" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Arm Girth (inches)</label>
                <input 
                  type="number" name="armInches" value={formData.armInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="15" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thigh Girth (inches)</label>
                <input 
                  type="number" name="thighInches" value={formData.thighInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="24" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-purple-800 border-b pb-2">Bone Structure (Calibration)</h2>
            <p className="text-xs text-gray-500 mb-4">These stay relatively constant and help us determine your "Ideal Soft Cap".</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shoulder Width (inches)</label>
                <input 
                  type="number" name="shoulderInches" value={formData.shoulderInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="18" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wrist Circumference (inches)</label>
                <input 
                  type="number" name="wristInches" value={formData.wristInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="7" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ankle Circumference (inches)</label>
                <input 
                  type="number" name="ankleInches" value={formData.ankleInches} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="9" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center">
              Update My Avatar
            </button>
            {saved && (
              <div className="text-green-600 text-center font-medium animate-pulse">
                Measurements saved! Avatar updating...
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Measurements;
