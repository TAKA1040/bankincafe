import styles from './CalculationSection.module.css'
import { formatCurrency } from '../../../lib/utils'

interface CalculationSectionProps {
  subtotal: number
  tax: number
  total: number
}

export default function CalculationSection({
  subtotal,
  tax,
  total
}: CalculationSectionProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>🧮 合計金額</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.calculationList}>
          <div className={styles.calculationRow}>
            <span className={`${styles.calculationLabel} ${styles.subtotalLabel}`}>
              小計
            </span>
            <span className={styles.calculationValue}>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.calculationRow}>
            <span className={`${styles.calculationLabel} ${styles.taxLabel}`}>
              消費税 (10%)
            </span>
            <span className={styles.calculationValue}>{formatCurrency(tax)}</span>
          </div>
          <div className={`${styles.calculationRow} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>合計</span>
            <span className={styles.totalValue}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}