import styles from './InvoiceHeader.module.css'

interface InvoiceHeaderProps {
  onBack: () => void
}

export default function InvoiceHeader({ onBack }: InvoiceHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          📄 請求書作成
        </h1>
        <p className={styles.subtitle}>
          新しい請求書を作成します
        </p>
      </div>
      <button
        className={styles.backButton}
        onClick={onBack}
        aria-label="前のページに戻る"
      >
        ← 戻る
      </button>
    </div>
  )
}