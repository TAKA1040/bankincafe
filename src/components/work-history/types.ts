/**
 * 作業履歴関連の型定義
 */

export interface Invoice {
  invoice_no: string
  invoice_date: string
  customer_name: string
  subject: string
  registration: string
  total_amount_incl_tax: number
}

export interface InvoiceItem {
  invoice_no: string
  is_set: number
  raw_text: string
  quantity: number
  unit_price: number
  amount: number
}

export interface SearchResult {
  invoice_no: string
  customer_name: string
  subject: string
  registration: string
  date: string
  work_name: string
  quantity: number
  unit_price: number
  total: number
  is_set: number
}

export interface WorkStatistics {
  count: number
  totalQuantity: number
  totalAmount: number
  avgPrice: number
  minPrice: number
  maxPrice: number
  lastUsed: number | null
}

export interface SearchFilters {
  customerFilter: string
  searchKeyword: string
  dateFrom: string
  dateTo: string
}
