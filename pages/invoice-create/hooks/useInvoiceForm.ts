import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { generateInvoiceNumber } from '../../../lib/utils'
import { validateInvoiceForm, hasErrors, sanitizeInput } from '../utils/validation'

interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

export function useInvoiceForm() {
  const router = useRouter()
  
  // Basic form state
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0])
  const [customerCategory, setCustomerCategory] = useState<'UD' | 'その他'>('UD')
  const [customerName, setCustomerName] = useState('株式会社UDトラックス')
  const [subject, setSubject] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  
  // Form validation and state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleCustomerTypeChange = useCallback((type: 'UD' | 'その他') => {
    setCustomerCategory(type)
    if (type === 'UD') {
      setCustomerName('株式会社UDトラックス')
    } else {
      setCustomerName('')
    }
    setErrors(prev => ({ ...prev, customerName: '' }))
  }, [])

  const handleSave = useCallback(async (isDraft = false, workItems: WorkItem[]) => {
    // バリデーション実行
    const validationErrors = validateInvoiceForm(
      customerCategory,
      customerName,
      subject,
      workItems
    )

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      alert('入力内容に不備があります。修正してください。')
      return
    }

    setLoading(true)
    setErrors({}) // エラーをクリア
    
    try {
      const subtotal = workItems.reduce((sum, item) => sum + item.amount, 0)
      const tax = Math.floor(subtotal * 0.1)
      const total = subtotal + tax

      // 入力値をサニタイズ
      const sanitizedCustomerName = sanitizeInput(customerCategory === 'UD' ? '株式会社UDトラックス' : customerName)
      const sanitizedSubject = sanitizeInput(subject)
      const sanitizedRegistrationNumber = sanitizeInput(registrationNumber)
      const sanitizedOrderNumber = sanitizeInput(orderNumber)

      const invoice = {
        invoiceNumber: generateInvoiceNumber(),
        billingDate,
        customerCategory,
        customerName: sanitizedCustomerName,
        subject: sanitizedSubject,
        registrationNumber: sanitizedRegistrationNumber,
        orderNumber: sanitizedOrderNumber,
        items: workItems.map(item => ({
          ...item,
          name: sanitizeInput(item.name),
          setDetails: item.setDetails?.map(detail => sanitizeInput(detail))
        })),
        subtotal,
        tax,
        total,
        status: isDraft ? 'draft' : 'finalized',
        createdAt: new Date().toISOString()
      }

      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Invoice saved:', invoice)
      alert(isDraft ? '下書きを保存しました' : '請求書を確定しました')
      
      router.push('/')
    } catch (error) {
      console.error('Save error:', error)
      alert('保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [router, customerCategory, customerName, subject, registrationNumber, orderNumber, billingDate])

  return {
    // Basic form state
    billingDate,
    setBillingDate,
    customerCategory,
    customerName,
    setCustomerName,
    subject,
    setSubject,
    registrationNumber,
    setRegistrationNumber,
    orderNumber,
    setOrderNumber,
    
    // Form validation and state
    errors,
    setErrors,
    loading,
    
    // Handlers
    handleCustomerTypeChange,
    handleSave
  }
}