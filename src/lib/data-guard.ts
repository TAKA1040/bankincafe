// フロントエンド用データ保護ガード
import { dbClient } from './db-client';

interface DataProtectionConfig {
  minInvoices: number;
  minLineItems: number;
}

class DataGuard {
  private config: DataProtectionConfig = {
    minInvoices: 1000,
    minLineItems: 500
  };

  // クエリ実行前の強制チェック
  async guardQuery(tableName: string, operation: string) {
    // 危険な操作を検出
    if (this.isDangerousOperation(operation, tableName)) {
      throw new Error(`🚨 BLOCKED: 経理データ(${tableName})への危険な操作(${operation})は禁止されています`);
    }

    return true;
  }

  private isDangerousOperation(operation: string, tableName: string): boolean {
    const protectedTables = ['invoices', 'invoice_line_items'];
    const dangerousOps = ['delete', 'truncate', 'drop'];

    return protectedTables.includes(tableName) &&
           dangerousOps.some(op => operation.toLowerCase().includes(op));
  }

  private async getCurrentCount(tableName: string): Promise<number> {
    const result = await dbClient.executeSQL<{ count: number }>(
      `SELECT COUNT(*) as count FROM "${tableName}"`
    );

    if (!result.success) throw new Error(result.error);
    return result.data?.rows?.[0]?.count || 0;
  }

  // データ監視ダッシュボード
  async getDataStatus() {
    const invoiceCount = await this.getCurrentCount('invoices');
    const lineItemCount = await this.getCurrentCount('invoice_line_items');

    return {
      invoices: {
        current: invoiceCount,
        minimum: this.config.minInvoices,
        status: invoiceCount >= this.config.minInvoices ? 'SAFE' : 'DANGER'
      },
      line_items: {
        current: lineItemCount,
        minimum: this.config.minLineItems,
        status: lineItemCount >= this.config.minLineItems ? 'SAFE' : 'DANGER'
      }
    };
  }
}

export const dataGuard = new DataGuard();
