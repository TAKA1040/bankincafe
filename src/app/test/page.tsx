import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-gray-600">Server is working!</p>
        <Link 
          href="/api/auth/signin" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In API Test
        </Link>
      </div>
    </div>
  )
}