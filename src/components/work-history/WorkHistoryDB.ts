/**
 * 作業履歴データベース管理クラス
 */
import { Invoice, InvoiceItem, SearchResult, WorkStatistics, SearchFilters } from './types'

export class WorkHistoryDB {
  private invoices: Invoice[] = []
  private invoiceItems: InvoiceItem[] = []
  private isInitialized = false

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    if (this.isInitialized) return

    // サンプルデータ
    this.invoices = [
      {
        invoice_no: '25050000-1',
        invoice_date: '2025/5/20',
        customer_name: 'サブル商事',
        subject: 'サブル商事様向け',
        registration: '福岡100005670',
        total_amount_incl_tax: 950000
      },
      {
        invoice_no: '25050001-1',
        invoice_date: '2025/5/15',
        customer_name: 'UDトラック株式会社',
        subject: 'サブル商事様向け',
        registration: '茨城100×1234',
        total_amount_incl_tax: 1100000
      },
      {
        invoice_no: '25050004-1',
        invoice_date: '2025/4/30',
        customer_name: '九州物流',
        subject: '定期メンテナンス',
        registration: '宮崎100×5555',
        total_amount_incl_tax: 930000
      },
      {
        invoice_no: '25050004-1',
        invoice_date: '2025/4/30',
        customer_name: '九州物流',
        subject: '定期メンテナンス',
        registration: '宮崎100×5555',
        total_amount_incl_tax: 622500
      }
    ]

    this.invoiceItems = [
      {
        invoice_no: '25050000-1',
        is_set: 0,
        raw_text: 'サイドパネル塗装',
        quantity: 1,
        unit_price: 950000,
        amount: 950000
      },
      {
        invoice_no: '25050001-1',
        is_set: 0,
        raw_text: 'ハンパー修理',
        quantity: 1,
        unit_price: 1100000,
        amount: 1100000
      },
      {
        invoice_no: '25050004-1',
        is_set: 0,
        raw_text: 'フレームパイプ交換',
        quantity: 1,
        unit_price: 930000,
        amount: 930000
      },
      {
        invoice_no: '25050004-1',
        is_set: 0,
        raw_text: 'フレームパイプ交換',
        quantity: 1,
        unit_price: 622500,
        amount: 622500
      }
    ]

    this.isInitialized = true
  }

  search(filters: SearchFilters): SearchResult[] {
    const results: SearchResult[] = []

    for (const invoice of this.invoices) {
      const items = this.invoiceItems.filter(item => item.invoice_no === invoice.invoice_no)
      
      for (const item of items) {
        // フィルター適用
        if (filters.customerFilter && !invoice.customer_name.includes(filters.customerFilter)) continue
        if (filters.searchKeyword && !item.raw_text.includes(filters.searchKeyword)) continue
        
        // 日付フィルター
        if (filters.dateFrom || filters.dateTo) {
          const invoiceDate = new Date(invoice.invoice_date.replace(/\//g, '-'))
          if (filters.dateFrom && invoiceDate < new Date(filters.dateFrom)) continue
          if (filters.dateTo && invoiceDate > new Date(filters.dateTo)) continue
        }

        results.push({
          invoice_no: invoice.invoice_no,
          customer_name: invoice.customer_name,
          subject: invoice.subject,
          registration: invoice.registration,
          date: invoice.invoice_date,
          work_name: item.raw_text,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.amount,
          is_set: item.is_set
        })
      }
    }

    return results
  }

  getWorkSuggestions(): string[] {
    const workNames = [...new Set(
      this.invoiceItems
        .filter(item => item.unit_price > 0 && item.raw_text) // 有料作業のみ
        .map(item => item.raw_text)
    )]
    return workNames.sort().slice(0, 8)
  }

  getCustomerSuggestions(): string[] {
    const customers = this.invoices.map(invoice => invoice.customer_name)
    return [...new Set(customers)]
  }

  getStatistics(results: SearchResult[]): WorkStatistics | null {
    if (results.length === 0) return null

    const prices = results.map(r => r.unit_price).filter(p => typeof p === 'number' && !isNaN(p))
    if (prices.length === 0) return null

    const totalAmount = prices.reduce((sum, price) => sum + price, 0)
    const totalQuantity = results.reduce((sum, r) => sum + r.quantity, 0)

    return {
      count: results.length,
      totalQuantity,
      totalAmount,
      avgPrice: Math.round(totalAmount / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      lastUsed: null
    }
  }
}
