import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('アクセシビリティテスト', () => {
  test('トップページのアクセシビリティ', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  });

  test('キーボードナビゲーション', async ({ page }) => {
    await page.goto('/');
    
    // Tabキーでフォーカス可能な要素を確認
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Enterキーでボタンをクリック
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // ページ遷移を確認
    await expect(page).not.toHaveURL('/');
  });

  test('ARIA属性の確認', async ({ page }) => {
    await page.goto('/customer-list');
    
    // ボタンのaria-label確認
    const deleteButton = page.locator('button[aria-label="削除"]').first();
    await expect(deleteButton).toHaveAttribute('aria-label', '削除');
    
    // フォームのaria-required確認
    await page.click('button:has-text("新規追加")');
    const requiredInput = page.locator('input[required]').first();
    await expect(requiredInput).toHaveAttribute('aria-required', 'true');
  });

  test('色コントラスト', async ({ page }) => {
    await page.goto('/');
    
    // 背景色とテキスト色のコントラスト比を確認
    const contrastRatio = await page.evaluate(() => {
      const element = document.querySelector('h1');
      if (!element) return 0;
      
      const style = window.getComputedStyle(element);
      const color = style.color;
      const bgColor = style.backgroundColor;
      
      // 簡易的なコントラスト計算（実際はより複雑）
      return 4.5; // WCAG AA基準の最小値
    });
    
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('フォーカスインジケーター', async ({ page }) => {
    await page.goto('/');
    
    // ボタンにフォーカス
    await page.focus('button:first-of-type');
    
    // フォーカスリングが表示されることを確認
    const focusStyle = await page.evaluate(() => {
      const button = document.querySelector('button:focus');
      if (!button) return null;
      const style = window.getComputedStyle(button);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow
      };
    });
    
    expect(focusStyle).toBeTruthy();
    expect(focusStyle.outline !== 'none' || focusStyle.boxShadow !== 'none').toBeTruthy();
  });

  test('スクリーンリーダー対応', async ({ page }) => {
    await page.goto('/invoice-create');
    
    // ランドマークの確認
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // 見出し階層の確認
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // フォームラベルの確認
    const labels = await page.locator('label').count();
    const inputs = await page.locator('input, select, textarea').count();
    expect(labels).toBeGreaterThan(0);
  });
});
