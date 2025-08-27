import { test, expect } from '@playwright/test';

test.describe('パフォーマンステスト', () => {
  test('ページ読み込み速度', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // 3秒以内に読み込まれることを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('大量データの表示性能', async ({ page }) => {
    await page.goto('/customer-list');
    
    // パフォーマンス測定開始
    const metrics = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
    
    // DOMContentLoadedが2秒以内
    expect(metrics.domContentLoadedEventEnd - metrics.domContentLoadedEventStart).toBeLessThan(2000);
  });

  test('検索のレスポンス速度', async ({ page }) => {
    await page.goto('/work-search');
    
    const startTime = Date.now();
    await page.fill('input[placeholder*="検索"]', 'テスト');
    
    // 検索結果が500ms以内に表示される
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 500 });
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
  });

  test('メモリリークのチェック', async ({ page }) => {
    await page.goto('/');
    
    // 初期メモリ使用量
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // 複数ページを遷移
    for (let i = 0; i < 5; i++) {
      await page.goto('/customer-list');
      await page.goto('/invoice-list');
      await page.goto('/work-history');
    }
    
    // ガベージコレクション実行を待つ
    await page.evaluate(() => {
      if (window.gc) window.gc();
    });
    await page.waitForTimeout(1000);
    
    // 最終メモリ使用量
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // メモリ使用量が異常に増加していないことを確認（50MB以内）
    if (initialMemory > 0 && finalMemory > 0) {
      expect(finalMemory - initialMemory).toBeLessThan(50 * 1024 * 1024);
    }
  });
});
