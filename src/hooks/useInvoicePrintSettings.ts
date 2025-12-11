'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ヘッダー表示項目の定義
export const HEADER_ITEMS = [
  { id: 'invoice_number', label: '請求書番号' },
  { id: 'issue_date', label: '発行日' },
  { id: 'due_date', label: '支払期限' },
  { id: 'customer_name', label: '顧客名' },
  { id: 'customer_company', label: '顧客会社名' },
  { id: 'subject', label: '件名' },
  { id: 'registration_number', label: '登録番号' },
  { id: 'total_amount', label: '合計金額（税込）' },
  { id: 'company_logo', label: '自社ロゴ' },
  { id: 'company_name', label: '自社名' },
  { id: 'company_address', label: '自社住所' },
  { id: 'company_phone', label: '自社電話番号' },
  { id: 'company_registration', label: '自社登録番号' },
] as const;

// フッター表示項目の定義
export const FOOTER_ITEMS = [
  { id: 'subtotal', label: '小計' },
  { id: 'tax', label: '消費税' },
  { id: 'total', label: '合計金額' },
  { id: 'bank_info', label: '振込先銀行情報' },
  { id: 'remarks', label: '備考欄' },
  { id: 'payment_terms', label: '支払条件' },
] as const;

// レイアウトの定義
export const LAYOUTS = [
  { id: 'minimal', name: 'ミニマル', description: 'クリーンで洗練されたデザイン' },
  { id: 'standard', name: '法人標準', description: '適格請求書対応・法人向け' },
  { id: 'modern', name: 'ビジネス', description: 'プロフェッショナル仕様' },
  { id: 'compact', name: 'シンプル', description: 'A4一枚完結型' },
  { id: 'detailed', name: '詳細・監査', description: '税務・監査対応' },
] as const;

// 型定義
export type HeaderItemId = typeof HEADER_ITEMS[number]['id'];
export type FooterItemId = typeof FOOTER_ITEMS[number]['id'];
export type LayoutId = typeof LAYOUTS[number]['id'];

export interface GlobalSettings {
  id: string;
  default_layout: LayoutId;
  header_items: HeaderItemId[];
  footer_items: FooterItemId[];
}

export interface CustomerSettings {
  id: string;
  customer_name: string;
  layout: LayoutId | null;
  header_items: HeaderItemId[] | null;
  footer_items: FooterItemId[] | null;
}

// フック
export function useInvoicePrintSettings() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [customerSettings, setCustomerSettings] = useState<CustomerSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // グローバル設定を取得
  const fetchGlobalSettings = useCallback(async () => {
    try {
      // テーブルが型定義に含まれていないため、anyでキャスト
      const { data, error: fetchError } = await (supabase as any)
        .from('invoice_print_global_settings')
        .select('*')
        .single();

      if (fetchError) throw fetchError;
      setGlobalSettings(data as GlobalSettings);
    } catch (err) {
      console.error('グローバル設定の取得に失敗:', err);
      setError('グローバル設定の取得に失敗しました');
    }
  }, []);

  // 顧客別設定を取得
  const fetchCustomerSettings = useCallback(async () => {
    try {
      // テーブルが型定義に含まれていないため、anyでキャスト
      const { data, error: fetchError } = await (supabase as any)
        .from('invoice_print_customer_settings')
        .select('*')
        .order('customer_name');

      if (fetchError) throw fetchError;
      setCustomerSettings((data as CustomerSettings[]) || []);
    } catch (err) {
      console.error('顧客別設定の取得に失敗:', err);
      setError('顧客別設定の取得に失敗しました');
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchGlobalSettings(), fetchCustomerSettings()]);
      setLoading(false);
    };
    load();
  }, [fetchGlobalSettings, fetchCustomerSettings]);

  // グローバル設定を更新
  const updateGlobalSettings = useCallback(async (settings: Partial<GlobalSettings>) => {
    if (!globalSettings?.id) return;

    try {
      const { error: updateError } = await (supabase as any)
        .from('invoice_print_global_settings')
        .update(settings)
        .eq('id', globalSettings.id);

      if (updateError) throw updateError;
      await fetchGlobalSettings();
    } catch (err) {
      console.error('グローバル設定の更新に失敗:', err);
      throw err;
    }
  }, [globalSettings, fetchGlobalSettings]);

  // 顧客別設定を追加/更新
  const upsertCustomerSettings = useCallback(async (settings: Omit<CustomerSettings, 'id'>) => {
    try {
      const { error: upsertError } = await (supabase as any)
        .from('invoice_print_customer_settings')
        .upsert(settings, { onConflict: 'customer_name' });

      if (upsertError) throw upsertError;
      await fetchCustomerSettings();
    } catch (err) {
      console.error('顧客別設定の保存に失敗:', err);
      throw err;
    }
  }, [fetchCustomerSettings]);

  // 顧客別設定を削除
  const deleteCustomerSettings = useCallback(async (customerName: string) => {
    try {
      const { error: deleteError } = await (supabase as any)
        .from('invoice_print_customer_settings')
        .delete()
        .eq('customer_name', customerName);

      if (deleteError) throw deleteError;
      await fetchCustomerSettings();
    } catch (err) {
      console.error('顧客別設定の削除に失敗:', err);
      throw err;
    }
  }, [fetchCustomerSettings]);

  // 顧客名から適用される設定を取得
  const getSettingsForCustomer = useCallback((customerName: string): {
    layout: LayoutId;
    headerItems: HeaderItemId[];
    footerItems: FooterItemId[];
  } => {
    // 顧客別設定を探す
    const customerSetting = customerSettings.find(s => s.customer_name === customerName);

    // デフォルト値
    const defaultLayout: LayoutId = 'minimal';
    const defaultHeaderItems: HeaderItemId[] = ['invoice_number', 'issue_date', 'customer_name', 'total_amount', 'company_name', 'company_address', 'company_phone'];
    const defaultFooterItems: FooterItemId[] = ['subtotal', 'tax', 'total', 'bank_info', 'remarks'];

    if (customerSetting) {
      // 顧客別設定がある場合、設定された項目を使用（NULLならグローバル設定）
      return {
        layout: customerSetting.layout || globalSettings?.default_layout || defaultLayout,
        headerItems: customerSetting.header_items || globalSettings?.header_items || defaultHeaderItems,
        footerItems: customerSetting.footer_items || globalSettings?.footer_items || defaultFooterItems,
      };
    }

    // 顧客別設定がない場合、グローバル設定を使用
    return {
      layout: globalSettings?.default_layout || defaultLayout,
      headerItems: globalSettings?.header_items || defaultHeaderItems,
      footerItems: globalSettings?.footer_items || defaultFooterItems,
    };
  }, [globalSettings, customerSettings]);

  return {
    globalSettings,
    customerSettings,
    loading,
    error,
    updateGlobalSettings,
    upsertCustomerSettings,
    deleteCustomerSettings,
    getSettingsForCustomer,
    refetch: () => Promise.all([fetchGlobalSettings(), fetchCustomerSettings()]),
  };
}
