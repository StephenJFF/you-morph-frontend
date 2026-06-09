'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setAuthorized(true)
    }
  }, [])

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-dark mb-2">Welcome Back!</h1>
          <p className="text-xl text-gray-600">Here's your fitness dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Workouts Completed', value: '24', icon: '💪' },
            { label: 'Days Streak', value: '12', icon: '🔥' },
            { label: 'Calories Burned', value: '12,450', icon: '🔥' },
            { label: 'Programs Active', value: '3', icon: '📚' },
          ].map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
              <div className="text-3xl font-bold text-primary mt-2">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-dark mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { date: 'Today', activity: 'Completed Strength Training', icon: '✓' },
                  { date: 'Yesterday', activity: 'Added 5 miles to running goal', icon: '✓' },
                  { date: '2 days ago', activity: 'Updated nutrition plan', icon: '✓' },
                  { date: '3 days ago', activity: 'Joined CrossFit Mastery program', icon: '✓' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="text-primary text-xl">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-dark">{item.activity}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-bold text-dark mb-4">Quick Actions</h3>
              <button className="w-full btn-primary mb-3">
                Start Workout
              </button>
              <button className="w-full btn-secondary mb-3">
                View Programs
              </button>
              <button className="w-full btn-outline">
                Update Profile
              </button>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-dark mb-4">Progress Goal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weekly Goal</span>
                  <span className="font-bold text-primary">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
