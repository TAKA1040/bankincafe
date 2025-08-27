import styles from './WorkItemsSection.module.css'
import WorkItemCard from './WorkItemCard'

interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

interface WorkItemsSectionProps {
  workItems: WorkItem[]
  addWorkItem: (type: 'individual' | 'set') => void
  updateWorkItem: <K extends keyof WorkItem>(id: string, field: K, value: WorkItem[K]) => void
  removeWorkItem: (id: string) => void
}

export default function WorkItemsSection({
  workItems,
  addWorkItem,
  updateWorkItem,
  removeWorkItem
}: WorkItemsSectionProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.cardTitle}>作業項目</h2>
          <div className={styles.buttonGroup}>
            <button
              className={styles.addButton}
              onClick={() => addWorkItem('individual')}
            >
              + 個別作業
            </button>
            <button
              className={styles.addButton}
              onClick={() => addWorkItem('set')}
            >
              + セット作業
            </button>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        {workItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📝</span>
            <p className={styles.emptyText}>作業項目を追加してください</p>
          </div>
        ) : (
          <div className={styles.workItemsList}>
            {workItems.map((item, index) => (
              <WorkItemCard
                key={item.id}
                item={item}
                index={index}
                updateWorkItem={updateWorkItem}
                removeWorkItem={removeWorkItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}