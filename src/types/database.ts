export interface Invoice {
  id: string
  invoice_number: string
  billing_date: string
  customer_name: string
  subject: string | null
  registration_number: string | null
  total_amount: number
  tax_amount: number | null
  created_at: string
  updated_at: string
  user_id: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  work_name: string
  quantity: number
  unit_price: number
  amount: number
  item_type: 'individual' | 'set'
  set_details: string[] | null
  created_at: string
}

export interface Customer {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  registration_date: string
  last_transaction_date: string | null
  user_id: string
  created_at: string
}

export interface WorkHistory {
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
  average: number
  min: number
  max: number
  count: number
  frequentWorks: Array<{
    name: string
    frequency: number
    averagePrice: number
  }>
}

export interface SearchFilters {
  customerFilter: string
  searchKeyword: string
  dateFrom: string
  dateTo: string
}