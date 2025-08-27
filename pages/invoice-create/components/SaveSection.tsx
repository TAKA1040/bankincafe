import styles from './SaveSection.module.css'

interface SaveSectionProps {
  onSave: (isDraft: boolean) => Promise<void>
  loading: boolean
}

export default function SaveSection({ onSave, loading }: SaveSectionProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.saveButton} ${styles.draftButton} ${loading ? styles.loadingButton : ''}`}
        onClick={() => onSave(true)}
        disabled={loading}
      >
        {loading ? (
          <div className={styles.loadingSpinner}></div>
        ) : (
          '💾'
        )}
        下書き保存
      </button>
      <button
        className={`${styles.saveButton} ${styles.confirmButton} ${loading ? styles.loadingButton : ''}`}
        onClick={() => onSave(false)}
        disabled={loading}
      >
        {loading ? (
          <div className={styles.loadingSpinner}></div>
        ) : (
          '📋'
        )}
        請求書を確定
      </button>
    </div>
  )
}