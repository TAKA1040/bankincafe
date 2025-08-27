export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page - 基本動作確認</h1>
      <p>もしこのページが表示されれば、基本的なNext.jsは動作しています。</p>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
        <h2>ステータス:</h2>
        <ul>
          <li>✅ Next.js 15 - 動作中</li>
          <li>✅ React 19 - 動作中</li>
          <li>✅ TypeScript - 動作中</li>
        </ul>
      </div>
    </div>
  )
}