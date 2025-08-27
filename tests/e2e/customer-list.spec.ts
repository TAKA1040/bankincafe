import { test, expect } from '@playwright/test';

test.describe('顧客管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customer-list');
  });

  test('顧客一覧の表示', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('顧客管理');
    
    // テーブルヘッダーの確認
    await expect(page.locator('th:has-text("顧客名")')).toBeVisible();
    await expect(page.locator('th:has-text("担当者")')).toBeVisible();
    await expect(page.locator('th:has-text("役職")')).toBeVisible();
    await expect(page.locator('th:has-text("電話番号")')).toBeVisible();
    
    // サンプルデータが表示されることを確認
    await expect(page.locator('td:has-text("テクノロジー株式会社")')).toBeVisible();
  });

  test('顧客検索機能', async ({ page }) => {
    // 検索ボックスに入力
    await page.fill('input[placeholder*="検索"]', 'UD');
    
    // 検索結果の確認
    await expect(page.locator('td:has-text("株式会社UDトラックス")')).toBeVisible();
    
    // 他の顧客が非表示になることを確認
    await expect(page.locator('td:has-text("テクノロジー株式会社")')).not.toBeVisible();
  });

  test('新規顧客追加フォームの表示', async ({ page }) => {
    // 新規追加ボタンをクリック
    await page.click('button:has-text("新規追加")');
    
    // フォームが表示されることを確認
    await expect(page.locator('text=新規顧客登録')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('顧客編集機能', async ({ page }) => {
    // 編集ボタンをクリック
    await page.click('button:has-text("編集")').first();
    
    // 編集フォームが表示されることを確認
    await expect(page.locator('text=顧客情報編集')).toBeVisible();
  });

  test('顧客削除確認ダイアログ', async ({ page }) => {
    // 削除ボタンをクリック
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('削除してもよろしいですか');
      dialog.dismiss();
    });
    
    await page.click('button:has-text("削除")').first();
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルビューポートに変更
    await page.setViewportSize({ width: 375, height: 667 });
    
    // モバイルでも主要要素が表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("新規追加")')).toBeVisible();
  });
});
