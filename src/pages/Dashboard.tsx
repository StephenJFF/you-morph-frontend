import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, AlertCircle } from 'lucide-react';

interface CheckIn {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/checkins', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCheckIns(data);
    } catch (err) {
      setError('Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to add check-in');
      const newCheckIn = await response.json();
      setCheckIns([newCheckIn, ...checkIns]);
      setWeight('');
      setNotes('');
    } catch (err) {
      setError('Failed to add check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your fitness progress</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} className="text-red-600" />
          <span className="text-red-600">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={20} />
              Add Check-in
            </h2>

            <form onSubmit={handleAddCheckIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="75.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How did you feel today?"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
              >
                {submitting ? 'Saving...' : 'Save Check-in'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Recent Check-ins
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : checkIns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No check-ins yet</div>
            ) : (
              <div className="space-y-2">
                {checkIns.map((checkIn) => (
                  <div key={checkIn.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{checkIn.weight} kg</p>
                      <p className="text-sm text-gray-600">{new Date(checkIn.date).toLocaleDateString()}</p>
                      {checkIn.notes && <p className="text-sm text-gray-500 mt-1">{checkIn.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Total Check-ins</p>
              <p className="text-2xl font-bold text-blue-600">{checkIns.length}</p>
            </div>
            {checkIns.length > 0 && (
              <>
                <div>
                  <p className="text-gray-600 text-sm">Latest Weight</p>
                  <p className="text-2xl font-bold text-gray-900">{checkIns[0].weight} kg</p>
                </div>
                {checkIns.length > 1 && (
                  <div>
                    <p className="text-gray-600 text-sm">Change</p>
                    <p className={`text-2xl font-bold ${checkIns[0].weight < checkIns[checkIns.length - 1].weight ? 'text-green-600' : 'text-red-600'}`}>
                      {(checkIns[0].weight - checkIns[checkIns.length - 1].weight).toFixed(1)} kg
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
