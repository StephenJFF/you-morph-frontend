'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, removeToken } from '@/lib/auth'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  return (
    <header className="bg-dark text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          YouMorph
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/programs" className="hover:text-primary transition">
            Programs
          </Link>
          <Link href="/pricing" className="hover:text-primary transition">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About
          </Link>

          {authenticated ? (
            <>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary transition">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark bg-opacity-95 px-4 pb-4 space-y-2">
          <Link href="/programs" className="block py-2 hover:text-primary">
            Programs
          </Link>
          <Link href="/pricing" className="block py-2 hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="block py-2 hover:text-primary">
            About
          </Link>
          {authenticated ? (
            <>
              <Link href="/dashboard" className="block py-2 btn-primary text-center">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 hover:text-primary">
                Login
              </Link>
              <Link href="/signup" className="block py-2 btn-primary text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
