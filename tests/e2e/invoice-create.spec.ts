import { test, expect } from '@playwright/test';

test.describe('請求書作成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/invoice-create');
  });

  test('請求書作成フォームの表示', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('請求書作成');
    
    // 必須フィールドの確認
    await expect(page.locator('label:has-text("顧客選択")')).toBeVisible();
    await expect(page.locator('label:has-text("請求日")')).toBeVisible();
    await expect(page.locator('label:has-text("支払期限")')).toBeVisible();
  });

  test('明細行の追加と削除', async ({ page }) => {
    // 明細追加ボタンをクリック
    await page.click('button:has-text("明細追加")');
    
    // 明細行が追加されることを確認
    const detailRows = page.locator('[data-testid="invoice-detail-row"]');
    await expect(detailRows).toHaveCount(1);
    
    // さらに追加
    await page.click('button:has-text("明細追加")');
    await expect(detailRows).toHaveCount(2);
    
    // 削除ボタンをクリック
    await page.click('button[aria-label="削除"]').first();
    await expect(detailRows).toHaveCount(1);
  });

  test('金額の自動計算', async ({ page }) => {
    // 明細を追加
    await page.click('button:has-text("明細追加")');
    
    // 数量と単価を入力
    await page.fill('input[name="quantity"]', '5');
    await page.fill('input[name="unitPrice"]', '1000');
    
    // 小計が自動計算されることを確認
    await expect(page.locator('[data-testid="subtotal"]')).toContainText('5,000');
    
    // 税額と合計も確認
    await expect(page.locator('[data-testid="tax"]')).toContainText('500');
    await expect(page.locator('[data-testid="total"]')).toContainText('5,500');
  });

  test('必須項目の検証', async ({ page }) => {
    // 保存ボタンをクリック
    await page.click('button:has-text("保存")');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=顧客を選択してください')).toBeVisible();
  });

  test('プレビュー機能', async ({ page }) => {
    // 必要な情報を入力
    await page.selectOption('select[name="customer"]', { index: 1 });
    await page.fill('input[name="invoiceDate"]', '2025-08-27');
    await page.fill('input[name="dueDate"]', '2025-09-30');
    
    // プレビューボタンをクリック
    await page.click('button:has-text("プレビュー")');
    
    // プレビューモーダルが表示されることを確認
    await expect(page.locator('[data-testid="invoice-preview"]')).toBeVisible();
  });

  test('キーボードナビゲーション', async ({ page }) => {
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("戻る")')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('select[name="customer"]')).toBeFocused();
  });
});
