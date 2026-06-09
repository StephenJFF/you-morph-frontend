import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEngineStore } from '../store/engineStore';
import { kgToLbs } from '../utils/logic';

const Progress = () => {
  const { checkins } = useEngineStore();

  const data = [...checkins].reverse().map((c, i) => ({
    name: `Week ${i + 1}`,
    weight: Math.round(kgToLbs(c.weight_kg)),
    waist: c.waist_cm ? Math.round(c.waist_cm / 2.54) : null,
    hips: c.hips_cm ? Math.round(c.hips_cm / 2.54) : null,
    arm: c.arm_girth_cm ? Math.round(c.arm_girth_cm / 2.54) : null,
    thigh: c.thigh_girth_cm ? Math.round(c.thigh_girth_cm / 2.54) : null,
    date: new Date(c.recorded_at).toLocaleDateString(),
  }));

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Progress Tracking</h1>
      {data.length > 0 ? (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Weight Trend (lbs)</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip labelFormatter={(value, payload) => payload[0]?.payload?.date || value} />
                  <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Circumference Trend (inches)</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={(value, payload) => payload[0]?.payload?.date || value} />
                  <Line type="monotone" dataKey="waist" stroke="#ef4444" strokeWidth={2} name="Waist" />
                  <Line type="monotone" dataKey="hips" stroke="#8b5cf6" strokeWidth={2} name="Hips" />
                  <Line type="monotone" dataKey="arm" stroke="#10b981" strokeWidth={2} name="Arms" />
                  <Line type="monotone" dataKey="thigh" stroke="#f59e0b" strokeWidth={2} name="Thighs" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-md text-center text-gray-500 border-2 border-dashed border-gray-200">
          No measurements logged yet. Go to the Measurements page to start tracking!
        </div>
      )}
    </div>
  );
};

export default Progress;
