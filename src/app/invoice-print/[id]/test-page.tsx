'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function TestInvoicePage() {
  const params = useParams();
  const invoiceId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          テストページ
        </h1>
        <div className="space-y-4">
          <div>
            <strong>請求書ID:</strong> {invoiceId || 'ID未取得'}
          </div>
          <div>
            <strong>状態:</strong> 基本表示テスト成功
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            このページが表示されれば、基本的なルーティングは動作しています。
          </div>
        </div>
      </div>
    </div>
  );
}