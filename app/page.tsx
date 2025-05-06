
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">Welcome to Vending Solutions</h1>
        <p className="mt-4 text-xl">Discover our smart vending solutions</p>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="text-blue-600 hover:underline">
                View All Products
              </Link>
            </li>
            <li>
              <Link href="/business-goals" className="text-blue-600 hover:underline">
                Business Goals
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
