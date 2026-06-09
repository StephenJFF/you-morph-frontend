import Link from 'next/link'

interface ProgramCardProps {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  instructor: string
  price: number
}

export default function ProgramCard({
  id,
  title,
  description,
  difficulty,
  duration,
  instructor,
  price,
}: ProgramCardProps) {
  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-dark">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            difficulty === 'beginner'
              ? 'bg-green-100 text-green-800'
              : difficulty === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {difficulty}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <p>👨‍🏫 <strong>Instructor:</strong> {instructor}</p>
        <p>⏱️ <strong>Duration:</strong> {duration} weeks</p>
        <p>💰 <strong>Price:</strong> ${price}</p>
      </div>
      <Link href={`/programs/${id}`} className="btn-primary w-full text-center">
        View Program
      </Link>
    </div>
  )
}
