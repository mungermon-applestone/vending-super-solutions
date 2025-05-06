
import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8 text-gray-600">
          The product you're looking for could not be found or has been removed.
        </p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Browse all products
        </Link>
      </div>
    </div>
  )
}
