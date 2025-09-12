import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export async function generateDocumentNumber(
  type: 'invoice' | 'estimate',
  getMaxSequence: (year: string, month: string, type: 'invoice' | 'estimate') => Promise<number>
): Promise<string> {
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2) // 25
  const month = String(now.getMonth() + 1).padStart(2, '0') // 01
  
  // 既存の最大連番を取得
  const maxSequence = await getMaxSequence(year, month, type)
  const nextSequence = maxSequence + 1
  
  if (type === 'estimate') {
    // 見積書: 25年01月M000-1
    const sequence = String(nextSequence).padStart(3, '0')
    return `${year}${month}M${sequence}-1`
  } else {
    // 請求書: 25年01月0000-1  
    const sequence = String(nextSequence).padStart(4, '0')
    return `${year}${month}${sequence}-1`
  }
}

export function parseDocumentNumber(documentNumber: string) {
  // 25年01月M000-1 または 25年01月0000-1 をパース
  const match = documentNumber.match(/^(\d{2})(\d{2})(M?)(\d{3,4})-(\d+)$/)
  if (!match) return null
  
  const [, year, month, estimateFlag, sequence, version] = match
  return {
    year,
    month,
    isEstimate: estimateFlag === 'M',
    sequence: parseInt(sequence, 10),
    version: parseInt(version, 10),
    baseNumber: `${year}${month}${estimateFlag}${sequence}`
  }
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const timestamp = now.getTime().toString().slice(-6)
  return `INV-${year}${month}-${timestamp}`
}

// 見積書・請求書保存時のマスタ登録制御
export function shouldRegisterToMaster(documentType: 'invoice' | 'estimate'): boolean {
  // 【重要ルール】見積書の場合は新規件名・登録番号をマスタに登録しない
  return documentType === 'invoice'
}

export interface MasterRegistrationOptions {
  documentType: 'invoice' | 'estimate'
  subjectName: string
  registrationNumber: string
  skipRegistration?: boolean
}

// 将来のSupabase保存時用のマスタ登録関数（予約）
export async function registerToMasterIfNeeded(options: MasterRegistrationOptions): Promise<void> {
  if (!shouldRegisterToMaster(options.documentType) || options.skipRegistration) {
    // // console.log(`${options.documentType === 'estimate' ? '見積書' : '請求書'}保存: マスタ登録をスキップ`)
    return
  }
  
  // TODO: 将来的にSupabaseでの件名マスタ・登録番号マスタへの登録処理を実装
  // // console.log('請求書保存: 新規件名・登録番号のマスタ登録を実行（未実装）')
}