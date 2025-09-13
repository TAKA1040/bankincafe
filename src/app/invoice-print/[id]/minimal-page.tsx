'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MinimalInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Step 1: Page mounted, invoiceId:', invoiceId);
    setStep(2);
  }, [invoiceId]);

  const testSupabaseImport = () => {
    try {
      console.log('Step 2: Testing Supabase import...');
      const { supabase } = require('@/lib/supabase');
      console.log('Step 3: Supabase import successful', supabase);
      setStep(3);
    } catch (err) {
      console.error('Supabase import failed:', err);
      setError(`Supabaseインポートエラー: ${err}`);
    }
  };

  const testCustomerCategoryImport = () => {
    try {
      console.log('Step 3: Testing CustomerCategory import...');
      const { CustomerCategoryDB } = require('@/lib/customer-categories');
      console.log('Step 4: CustomerCategory import successful');
      setStep(4);
    } catch (err) {
      console.error('CustomerCategory import failed:', err);
      setError(`CustomerCategoryインポートエラー: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          最小限テストページ
        </h1>
        
        <div className="space-y-4">
          <div>
            <strong>請求書ID:</strong> {invoiceId || 'ID未取得'}
          </div>
          
          <div>
            <strong>現在のステップ:</strong> {step}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <strong>エラー:</strong> {error}
            </div>
          )}
          
          <div className="space-y-2">
            <button 
              onClick={testSupabaseImport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
            >
              Supabaseテスト
            </button>
            
            <button 
              onClick={testCustomerCategoryImport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2"
            >
              CustomerCategoryテスト
            </button>
            
            <button 
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              戻る
            </button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <strong>テスト手順:</strong><br/>
            1. このページが表示される（基本ルーティングOK）<br/>
            2. Supabaseテストボタンをクリック<br/>
            3. CustomerCategoryテストボタンをクリック<br/>
            4. どこでエラーが発生するか確認
          </div>
        </div>
      </div>
    </div>
  );
}