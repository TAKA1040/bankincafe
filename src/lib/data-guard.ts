// フロントエンド用データ保護ガード
import { createClient } from './supabase/client';

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
  async guardQuery(tableName: string, operation: string, queryBuilder: any) {
    // 危険な操作を検出
    if (this.isDangerousOperation(operation, tableName)) {
      throw new Error(`🚨 BLOCKED: 経理データ(${tableName})への危険な操作(${operation})は禁止されています`);
    }

    // 件数制限チェック
    if (this.isSelectWithLimit(queryBuilder)) {
      await this.validateSelectLimit(tableName);
    }

    return queryBuilder;
  }

  private isDangerousOperation(operation: string, tableName: string): boolean {
    const protectedTables = ['invoices', 'invoice_line_items'];
    const dangerousOps = ['delete', 'truncate', 'drop'];
    
    return protectedTables.includes(tableName) && 
           dangerousOps.some(op => operation.toLowerCase().includes(op));
  }

  private isSelectWithLimit(queryBuilder: any): boolean {
    // Supabaseクエリビルダーのlimit使用を検出
    return queryBuilder._query?.limit !== undefined;
  }

  private async validateSelectLimit(tableName: string) {
    const currentCount = await this.getCurrentCount(tableName);
    const minRequired = tableName === 'invoices' ? this.config.minInvoices : this.config.minLineItems;
    
    if (currentCount < minRequired) {
      throw new Error(`🚨 データ不足: ${tableName}は${currentCount}件しかありません（最低${minRequired}件必要）`);
    }
  }

  private async getCurrentCount(tableName: string): Promise<number> {
    const supabase = createClient()
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
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

// 保護されたSupabaseクライアント
class ProtectedSupabaseClient {
  private guard = new DataGuard();

  async from(tableName: string) {
    return {
      select: async (columns: string, options?: any) => {
        const supabase = createClient()
        const query = supabase.from(tableName).select(columns, options);
        await this.guard.guardQuery(tableName, 'SELECT', query);
        return query;
      },
      
      insert: async (data: any) => {
        const supabase = createClient()
        await this.guard.guardQuery(tableName, 'INSERT', null);
        return supabase.from(tableName).insert(data);
      },
      
      update: async (data: any) => {
        const supabase = createClient()
        await this.guard.guardQuery(tableName, 'UPDATE', null);
        return supabase.from(tableName).update(data);
      },
      
      delete: async () => {
        await this.guard.guardQuery(tableName, 'DELETE', null);
        throw new Error('🚨 DELETE操作は保護されています');
      }
    };
  }
}

export const protectedSupabase = new ProtectedSupabaseClient();
export const dataGuard = new DataGuard();