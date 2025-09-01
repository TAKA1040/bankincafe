'use client'

export interface CustomerCategory {
  id: string
  name: string
  companyName: string
  isDefault?: boolean
}

// 顧客カテゴリーDBクラス
export class CustomerCategoryDB {
  private readonly STORAGE_KEY = 'bankin_customer_categories'

  getCategories(): CustomerCategory[] {
    if (typeof window === 'undefined') {
        return this.getDefaultCategories();
    }
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultCategories()
    } catch {
      return this.getDefaultCategories()
    }
  }

  private getDefaultCategories(): CustomerCategory[] {
    return [
      {
        id: 'ud',
        name: 'UD',
        companyName: '株式会社UDトラックス',
        isDefault: true
      },
      {
        id: 'other',
        name: 'その他',
        companyName: '',
        isDefault: true
      }
    ]
  }

  saveCategories(categories: CustomerCategory[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error('Failed to save customer categories:', error)
    }
  }

  reorderCategories(categories: CustomerCategory[]): void {
    this.saveCategories(categories)
  }

  addCategory(category: Omit<CustomerCategory, 'id'>): CustomerCategory {
    const categories = this.getCategories()
    const newCategory: CustomerCategory = {
      ...category,
      id: Date.now().toString()
    }
    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  }

  updateCategory(id: string, updates: Partial<CustomerCategory>): void {
    const categories = this.getCategories()
    const index = categories.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      this.saveCategories(categories)
    }
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories()
    const filtered = categories.filter(cat => cat.id !== id && !cat.isDefault)
    this.saveCategories(filtered)
  }
}
