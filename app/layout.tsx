
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vending Solutions',
  description: 'Smart vending solutions for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <Link href="/" className="font-bold text-xl text-vending-blue">Vending Solutions</Link>
              <div className="space-x-6">
                <Link href="/products" className="text-gray-700 hover:text-vending-blue">Products</Link>
                <Link href="/machines" className="text-gray-700 hover:text-vending-blue">Machines</Link>
                <Link href="/technology" className="text-gray-700 hover:text-vending-blue">Technology</Link>
                <Link href="/contact" className="text-gray-700 hover:text-vending-blue">Contact</Link>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-50 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© {new Date().getFullYear()} Vending Solutions. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
