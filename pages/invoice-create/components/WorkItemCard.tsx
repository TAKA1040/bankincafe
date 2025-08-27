import React from 'react'
import styles from './WorkItemCard.module.css'
import { formatCurrency } from '../../../lib/utils'

interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

interface WorkItemCardProps {
  item: WorkItem
  index: number
  updateWorkItem: <K extends keyof WorkItem>(id: string, field: K, value: WorkItem[K]) => void
  removeWorkItem: (id: string) => void
}

const WorkItemCard = React.memo(function WorkItemCard({ 
  item, 
  index, 
  updateWorkItem, 
  removeWorkItem 
}: WorkItemCardProps) {
  return (
    <div className={styles.workItem}>
      <div className={styles.itemHeader}>
        <div className={`${styles.typeBadge} ${
          item.type === 'individual' 
            ? styles.typeBadgeIndividual 
            : styles.typeBadgeSet
        }`}>
          {item.type === 'individual' ? '個別作業' : 'セット作業'}
        </div>
        <button
          className={styles.deleteButton}
          onClick={() => removeWorkItem(item.id)}
          aria-label="作業項目を削除"
        >
          削除
        </button>
      </div>

      <div className={styles.itemContent}>
        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              作業内容<span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              value={item.name}
              onChange={(e) => updateWorkItem(item.id, 'name', e.target.value)}
              placeholder="作業内容を入力"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              数量<span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="number"
              value={item.quantity}
              onChange={(e) => updateWorkItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              単価<span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="number"
              value={item.unitPrice}
              onChange={(e) => updateWorkItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>
        </div>

        {/* Set Details for Set Work Type */}
        {item.type === 'set' && (
          <div className={styles.setDetailsSection}>
            <div className={styles.setDetailsTitle}>セット内容詳細</div>
            <div className={styles.setDetailsList}>
              {item.setDetails?.map((detail, detailIndex) => (
                <div key={detailIndex} className={styles.setDetailRow}>
                  <input
                    className={styles.setDetailInput}
                    placeholder="セット内容を入力"
                    value={detail}
                    onChange={(e) => {
                      const newDetails = [...(item.setDetails || [])]
                      newDetails[detailIndex] = e.target.value
                      updateWorkItem(item.id, 'setDetails', newDetails)
                    }}
                  />
                  <button
                    className={styles.removeDetailButton}
                    onClick={() => {
                      const newDetails = item.setDetails?.filter((_, i) => i !== detailIndex) || []
                      updateWorkItem(item.id, 'setDetails', newDetails.length > 0 ? newDetails : [''])
                    }}
                    aria-label="セット詳細を削除"
                  >
                    🗑️
                  </button>
                </div>
              )) || []}
              <button
                className={styles.addDetailButton}
                onClick={() => {
                  const currentDetails = item.setDetails || ['']
                  updateWorkItem(item.id, 'setDetails', [...currentDetails, ''])
                }}
              >
                + 項目を追加
              </button>
            </div>
          </div>
        )}

        <div className={styles.amountSection}>
          <span className={styles.amountLabel}>💰 金額</span>
          <span className={styles.amountValue}>
            {formatCurrency(item.amount)}
          </span>
        </div>
      </div>
    </div>
  )
})

export default WorkItemCard