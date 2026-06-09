'use client'

import ProgramCard from '@/components/ProgramCard'
import { useState } from 'react'

const PROGRAMS = [
  {
    id: '1',
    title: 'Strength Building 101',
    description: 'Learn the fundamentals of strength training with proven techniques',
    difficulty: 'beginner',
    duration: 8,
    instructor: 'John Smith',
    price: 49,
  },
  {
    id: '2',
    title: 'HIIT Cardio Blast',
    description: 'High-intensity interval training for maximum calorie burn',
    difficulty: 'intermediate',
    duration: 6,
    instructor: 'Sarah Johnson',
    price: 39,
  },
  {
    id: '3',
    title: 'Advanced Bodybuilding',
    description: 'Elite bodybuilding techniques for experienced lifters',
    difficulty: 'advanced',
    duration: 12,
    instructor: 'Mike Thompson',
    price: 79,
  },
  {
    id: '4',
    title: 'Yoga & Flexibility',
    description: 'Improve flexibility and mental wellness through yoga',
    difficulty: 'beginner',
    duration: 4,
    instructor: 'Emily Chen',
    price: 29,
  },
  {
    id: '5',
    title: 'Marathon Training',
    description: 'Complete program to prepare for your first marathon',
    difficulty: 'intermediate',
    duration: 16,
    instructor: 'David Wilson',
    price: 59,
  },
  {
    id: '6',
    title: 'CrossFit Mastery',
    description: 'Master functional fitness and CrossFit movements',
    difficulty: 'advanced',
    duration: 10,
    instructor: 'Lisa Rodriguez',
    price: 69,
  },
]

export default function ProgramsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const filtered = selectedDifficulty === 'all'
    ? PROGRAMS
    : PROGRAMS.filter(p => p.difficulty === selectedDifficulty)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-dark mb-4">Our Programs</h1>
          <p className="text-xl text-gray-600">
            Choose from our wide range of fitness programs designed for all levels
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedDifficulty === level
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(program => (
            <ProgramCard key={program.id} {...program} />
          ))}
        </div>
      </div>
    </div>
  )
}
