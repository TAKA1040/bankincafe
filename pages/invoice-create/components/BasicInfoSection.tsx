import React from 'react'
import styles from './BasicInfoSection.module.css'

interface BasicInfoSectionProps {
  billingDate: string
  setBillingDate: (date: string) => void
  customerCategory: 'UD' | 'その他'
  handleCustomerTypeChange: (type: 'UD' | 'その他') => void
  customerName: string
  setCustomerName: (name: string) => void
  subject: string
  setSubject: (subject: string) => void
  registrationNumber: string
  setRegistrationNumber: (number: string) => void
  orderNumber: string
  setOrderNumber: (number: string) => void
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const BasicInfoSection = React.memo(function BasicInfoSection({
  billingDate,
  setBillingDate,
  customerCategory,
  handleCustomerTypeChange,
  customerName,
  setCustomerName,
  subject,
  setSubject,
  registrationNumber,
  setRegistrationNumber,
  orderNumber,
  setOrderNumber,
  errors,
  setErrors
}: BasicInfoSectionProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>基本情報</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              請求日<span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              className={styles.input}
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.radioGroup}>
            <label className={styles.label}>顧客タイプ</label>
            <div className={styles.radioOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="customerType"
                  value="UD"
                  checked={customerCategory === 'UD'}
                  onChange={() => handleCustomerTypeChange('UD')}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>UD</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="customerType"
                  value="その他"
                  checked={customerCategory === 'その他'}
                  onChange={() => handleCustomerTypeChange('その他')}
                  className={styles.radioInput}
                />
                <span className={styles.radioLabel}>その他</span>
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              顧客名<span className={styles.required}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.customerName ? styles.hasError : ''}`}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={customerCategory === 'UD'}
              placeholder={customerCategory === 'UD' ? '株式会社UDトラックス' : '顧客名を入力'}
              required
            />
            {errors.customerName && (
              <div className={styles.errorMessage}>{errors.customerName}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              件名<span className={styles.required}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.subject ? styles.hasError : ''}`}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                setErrors(prev => ({ ...prev, subject: '' }))
              }}
              placeholder="件名を入力"
              required
            />
            {errors.subject && (
              <div className={styles.errorMessage}>{errors.subject}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>登録番号</label>
            <input
              className={styles.input}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="登録番号 (任意)"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>発注番号</label>
            <input
              className={styles.input}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="発注番号 (任意)"
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default BasicInfoSection