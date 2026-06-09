import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-lg mb-4 text-primary">YouMorph</h3>
          <p className="text-gray-400">Your personal fitness transformation platform</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/programs" className="hover:text-primary">Programs</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
        <p>&copy; 2026 YouMorph. All rights reserved.</p>
      </div>
    </footer>
  )
}
