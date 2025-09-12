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
    // // console.log('getCategories呼び出し')
    if (typeof window === 'undefined') {
        // // console.log('SSRモード - デフォルトカテゴリーを返す')
        return this.getDefaultCategories();
    }
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      // // console.log('localStorage取得データ:', stored)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        // // console.log('パース済みデータを返す:', parsed)
        return parsed
      } else {
        // 初回アクセス時：デフォルトカテゴリーをlocalStorageに保存
        // // console.log('初回アクセス - デフォルトカテゴリーを保存')
        const defaultCategories = this.getDefaultCategories()
        this.saveCategories(defaultCategories)
        return defaultCategories
      }
    } catch (error) {
      // // console.log('エラー発生 - デフォルトカテゴリーを返す:', error)
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
    // // console.log('saveCategories実行:', categories)
    if (typeof window === 'undefined') {
      // // console.log('window未定義のため保存スキップ')
      return;
    }
    try {
      const jsonData = JSON.stringify(categories)
      // // console.log('localStorage保存データ:', jsonData)
      localStorage.setItem(this.STORAGE_KEY, jsonData)
      // // console.log('localStorage保存成功')
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
    // // console.log('updateCategory呼び出し:', { id, updates })
    const categories = this.getCategories()
    // // console.log('現在のカテゴリー一覧:', categories)
    
    const index = categories.findIndex(cat => cat.id === id)
    // // console.log('更新対象のindex:', index)
    
    if (index !== -1) {
      const beforeUpdate = categories[index]
      // // console.log('更新前のカテゴリー:', beforeUpdate)
      
      // デフォルトカテゴリーも更新可能にする
      categories[index] = { ...categories[index], ...updates }
      // // console.log('更新後のカテゴリー:', categories[index])
      
      this.saveCategories(categories)
      // // console.log('localStorage保存完了')
    } else {
      // // console.log('更新対象が見つかりません')
    }
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories()
    // デフォルトカテゴリーは削除不可
    const filtered = categories.filter(cat => cat.id !== id || cat.isDefault)
    this.saveCategories(filtered)
  }

  // 開発用：localStorageをリセットしてデフォルト状態に戻す
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to reset customer categories:', error)
    }
  }
}
