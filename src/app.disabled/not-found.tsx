import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-700 mb-4">ページが見つかりません</h2>
        <p className="text-secondary-600 mb-8">お探しのページは存在しないか、移動された可能性があります。</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}