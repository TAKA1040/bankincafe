import { createClient } from '@/lib/supabase/client'

export interface FiscalYearInfo {
  fiscalYearEndMonth: number
  currentFiscalYear: number
  previousFiscalYear: number
}

/**
 * 会社情報から決算月を取得し、現在の決算期を計算する
 */
export async function getFiscalYearInfo(): Promise<FiscalYearInfo> {
  try {
    const supabase = createClient()
    
    // 会社情報から決算月を取得
    const { data: companyData, error } = await supabase
      .from('company_info')
      .select('fiscal_year_end_month')
      .limit(1)
      .single()
    
    if (error) {
      console.warn('会社情報の取得に失敗、デフォルト値(3月決算)を使用:', error.message)
    }
    
    // 決算月（デフォルト: 3月）
    const fiscalYearEndMonth = parseInt(companyData?.fiscal_year_end_month || '3')
    // // console.log('📅 決算月:', fiscalYearEndMonth + '月')
    
    // 現在日時
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-12
    
    // 現在の決算期を計算
    let currentFiscalYear: number
    if (currentMonth > fiscalYearEndMonth) {
      // 決算月を過ぎている場合、来年度が現在の決算期
      currentFiscalYear = currentYear + 1
    } else {
      // 決算月前の場合、今年度が現在の決算期
      currentFiscalYear = currentYear
    }
    
    const previousFiscalYear = currentFiscalYear - 1
    
    // // console.log('📊 決算期情報:', { 決算月: fiscalYearEndMonth + '月', 今期: previousFiscalYear + '年度', 前期: (previousFiscalYear - 1) + '年度', 現在: currentYear + '年' + currentMonth + '月' })
    
    return {
      fiscalYearEndMonth,
      currentFiscalYear,
      previousFiscalYear
    }
  } catch (error) {
    console.error('決算期情報の取得エラー:', error)
    
    // エラー時はデフォルト（3月決算）を返す
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentFiscalYear = currentMonth > 3 ? currentYear + 1 : currentYear
    
    return {
      fiscalYearEndMonth: 3,
      currentFiscalYear,
      previousFiscalYear: currentFiscalYear - 1
    }
  }
}

/**
 * 指定した決算期の期間（開始日〜終了日）を取得
 * @param fiscalYear 決算期（終了年度）
 * @param fiscalYearEndMonth 決算月
 * @returns {startDate, endDate}
 */
export function getFiscalYearRange(fiscalYear: number, fiscalYearEndMonth: number): {startDate: string, endDate: string} {
  const startYear = fiscalYear - 1
  const startMonth = (fiscalYearEndMonth % 12) + 1 // 決算月の翌月が期首
  
  const startDate = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`
  const endDate = `${fiscalYear}-${fiscalYearEndMonth.toString().padStart(2, '0')}-${getLastDayOfMonth(fiscalYear, fiscalYearEndMonth)}`
  
  return { startDate, endDate }
}

/**
 * 指定した年月の最終日を取得
 */
function getLastDayOfMonth(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate()
  return lastDay.toString().padStart(2, '0')
}

/**
 * 決算期の表示名を取得
 * 例: 2024年度
 */
export function getFiscalYearDisplayName(fiscalYear: number, fiscalYearEndMonth: number): string {
  return `${fiscalYear}年度`
}