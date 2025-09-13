'use client';

import React from 'react';

export default function StaticTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ 静的ルートテスト成功
        </h1>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            このページが表示されれば、Next.jsの基本ルーティングは動作しています。
          </div>
          <div>
            <strong>URL:</strong> /test-invoice-page
          </div>
          <div>
            <strong>状態:</strong> 静的ルート成功
          </div>
        </div>
      </div>
    </div>
  );
}