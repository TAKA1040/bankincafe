'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDbPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testDb() {
      try {
        console.log('Testing database connection...');
        
        // 簡単なクエリでテスト
        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('invoice_id, customer_name, total, billing_date')
          .limit(5);

        if (error) {
          throw error;
        }

        console.log('Database test successful:', invoices);
        setData(invoices || []);
      } catch (err) {
        console.error('Database test error:', err);
        setError(err instanceof Error ? err.message : 'Database error');
      } finally {
        setLoading(false);
      }
    }

    testDb();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <p>Found {data.length} records</p>
      <ul className="mt-4">
        {data.map((item, index) => (
          <li key={index} className="mb-2 p-2 border rounded">
            {item.invoice_id} - {item.customer_name} - ¥{item.total}
            <br />
            <small>{item.billing_date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}