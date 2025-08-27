import { test, expect } from '@playwright/test';

test.describe('ナビゲーション機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('トップページが正しく表示される', async ({ page }) => {
    // タイトルの確認
    await expect(page).toHaveTitle(/BankinCafe/);
    
    // ヘッダーの確認
    await expect(page.locator('h1')).toContainText('BankinCafe 管理システム');
    
    // 6つのメニューボタンが存在することを確認
    const menuButtons = page.locator('button').filter({ hasText: /顧客管理|請求書作成|請求書一覧|売上管理|作業履歴|作業検索/ });
    await expect(menuButtons).toHaveCount(6);
  });

  test('顧客管理ページへの遷移', async ({ page }) => {
    await page.click('text=顧客管理');
    await expect(page).toHaveURL('/customer-list');
    await expect(page.locator('h1')).toContainText('顧客管理');
  });

  test('請求書作成ページへの遷移', async ({ page }) => {
    await page.click('text=請求書作成');
    await expect(page).toHaveURL('/invoice-create');
    await expect(page.locator('h1')).toContainText('請求書作成');
  });

  test('請求書一覧ページへの遷移', async ({ page }) => {
    await page.click('text=請求書一覧');
    await expect(page).toHaveURL('/invoice-list');
    await expect(page.locator('h1')).toContainText('請求書一覧');
  });

  test('売上管理ページへの遷移', async ({ page }) => {
    await page.click('text=売上管理');
    await expect(page).toHaveURL('/sales-management');
    await expect(page.locator('h1')).toContainText('売上管理');
  });

  test('作業履歴ページへの遷移', async ({ page }) => {
    await page.click('text=作業履歴');
    await expect(page).toHaveURL('/work-history');
    await expect(page.locator('h1')).toContainText('作業履歴');
  });

  test('作業検索ページへの遷移', async ({ page }) => {
    await page.click('text=作業検索');
    await expect(page).toHaveURL('/work-search');
    await expect(page.locator('h1')).toContainText('作業検索');
  });

  test('戻るボタンの動作確認', async ({ page }) => {
    // 顧客管理ページへ遷移
    await page.click('text=顧客管理');
    await expect(page).toHaveURL('/customer-list');
    
    // 戻るボタンをクリック
    await page.click('button:has-text("戻る")');
    await expect(page).toHaveURL('/');
  });
});
