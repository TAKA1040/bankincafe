interface WorkItem {
  id: string
  type: 'individual' | 'set'
  name: string
  quantity: number
  unitPrice: number
  amount: number
  setDetails?: string[]
}

interface ValidationErrors {
  [key: string]: string
}

export function validateBasicInfo(
  customerCategory: 'UD' | 'その他',
  customerName: string,
  subject: string
): ValidationErrors {
  const errors: ValidationErrors = {}

  if (customerCategory === 'その他' && !customerName.trim()) {
    errors.customerName = '顧客名を入力してください'
  }

  if (!subject.trim()) {
    errors.subject = '件名を入力してください'
  }

  return errors
}

export function validateWorkItems(workItems: WorkItem[]): ValidationErrors {
  const errors: ValidationErrors = {}

  if (workItems.length === 0) {
    errors.workItems = '作業項目を1つ以上追加してください'
    return errors
  }

  workItems.forEach((item, index) => {
    if (!item.name.trim()) {
      errors[`workItem_${item.id}_name`] = '作業内容を入力してください'
    }

    if (item.quantity < 1) {
      errors[`workItem_${item.id}_quantity`] = '数量は1以上で入力してください'
    }

    if (item.unitPrice <= 0) {
      errors[`workItem_${item.id}_unitPrice`] = '単価は0より大きい値を入力してください'
    }

    if (item.type === 'set') {
      const validDetails = item.setDetails?.filter(detail => detail.trim()) || []
      if (validDetails.length === 0) {
        errors[`workItem_${item.id}_setDetails`] = 'セット作業の詳細を1つ以上入力してください'
      }
    }
  })

  return errors
}

export function validateInvoiceForm(
  customerCategory: 'UD' | 'その他',
  customerName: string,
  subject: string,
  workItems: WorkItem[]
): ValidationErrors {
  const basicInfoErrors = validateBasicInfo(customerCategory, customerName, subject)
  const workItemsErrors = validateWorkItems(workItems)

  return { ...basicInfoErrors, ...workItemsErrors }
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000) // Limit input length
}

export function sanitizeNumber(value: string | number, min: number = 0, max: number = 999999999): number {
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value
  return Math.max(min, Math.min(max, numValue))
}