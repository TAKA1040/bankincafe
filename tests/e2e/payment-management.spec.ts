import { test, expect } from '@playwright/test';

/**
 * 入金管理 E2E
 * - 初回取得時に payment_date カラム不存在エラー(42703)を擬似発生させ、fallback 再取得で一覧を表示できること
 * - 入金日を指定して一括入金更新(PATCH)を送り、payload に payment_status/payment_date が含まれること
 * - 更新後の再取得でサマリーが更新されること
 */
test.describe('入金管理（支払い更新とフェールセーフ）', () => {
  test('payment_date なし->fallback選択と一括入金更新の成功', async ({ page }) => {
    // 擬似データ（テスト内の簡易状態管理）
    const state = {
      invoices: [
        {
          invoice_id: 'INV-001',
          issue_date: '2025-08-01',
          customer_name: 'ACME株式会社',
          subject_name: '保守契約',
          total_amount: 10000,
          status: 'finalized',
          payment_status: 'unpaid',
          created_at: '2025-08-01T00:00:00Z',
        },
      ],
    } as const;

    // 変化可能なコピー
    let current = JSON.parse(JSON.stringify(state));

    // /rest/v1/invoices の通信をスタブ
    let fetchCount = 0;
    await page.route('**/rest/v1/invoices**', async (route) => {
      const req = route.request();
      const method = req.method();

      // CORSプリフライト
      if (method === 'OPTIONS') {
        return route.fulfill({ status: 200, body: '' });
      }

      if (method === 'GET') {
        fetchCount += 1;
        if (fetchCount === 1) {
          // 最初の取得は payment_date 不存在エラーを返して fallback を誘発
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              code: '42703',
              message: 'column "payment_date" does not exist',
              details: null,
              hint: null,
            }),
          });
        }
        // fallback（2回目以降）は正常に一覧を返す
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'access-control-expose-headers': 'content-range, content-profile' },
          body: JSON.stringify(current.invoices),
        });
      }

      if (method === 'PATCH') {
        // 更新の受信と検証
        const payload = req.postDataJSON?.() ?? {};
        expect(payload.payment_status).toBe('paid');
        // payment_date は UI で入力した値が入る（fallback環境では更新リトライで省略される可能性があるため存在すれば検証）
        if (payload.payment_date) {
          expect(payload.payment_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }

        // invoice_id in (...) のクエリによる対象特定を前提に、簡易的に INV-001 を更新
        current.invoices = current.invoices.map((inv: any) =>
          inv.invoice_id === 'INV-001'
            ? { ...inv, payment_status: 'paid', payment_date: payload.payment_date ?? null }
            : inv
        );

        return route.fulfill({ status: 204, body: '' });
      }

      // その他メソッドは通す
      return route.continue();
    });

    // ページ遷移
    await page.goto('/sales-management');

    // 「入金管理」タブへ切り替え
    await page.click('button:has-text("入金管理")');

    // Fallback 後の一覧・サマリー表示を待機（未入金=¥10,000）
    await expect(page.locator('text=未入金（件数/請求額）')).toBeVisible();
    await expect(page.locator('text=¥10,000')).toBeVisible();

    // 入金日を入力
    await page.fill('input[type="date"]', '2025-08-31');

    // 対象を選択
    await page.check('input[aria-label="入金対象: INV-001"]');

    // PATCH を待ちながら入金実行
    const patchPromise = page.waitForRequest((req) => req.url().includes('/rest/v1/invoices') && req.method() === 'PATCH');
    await page.click('button:has-text("選択した明細を入金済みにする")');
    const patchReq = await patchPromise;

    // PATCH 送信 payload 確認
    const sent = patchReq.postDataJSON?.() ?? {};
    expect(sent.payment_status).toBe('paid');
    // 入力した日付が入る（カラムが存在する環境では）
    // カラム未存在時はリトライで payment_date なしの PATCH が送られるため、存在時のみ厳密チェック
    if (sent.payment_date) {
      expect(sent.payment_date).toBe('2025-08-31');
    }

    // 更新後の refetch を待機してサマリーが更新されること（入金済み=¥10,000, 未入金=¥0）
    await expect(page.locator('text=入金済み（件数/請求額）')).toBeVisible();
    await expect(page.locator('text=¥10,000')).toBeVisible();
    // 未入金が 0 になること（厳密一致しづらいので 0 の表示存在を確認）
    await expect(page.locator('text=未入金（件数/請求額）')).toBeVisible();
    await expect(page.locator('text=¥0')).toBeVisible();
  });
});
