# UI スタイリングルール 🎨

## 🎯 基本方針：CSS Modules主軸 + 最小限グローバルトークン

### 現実的なアプローチ
- **CSS Modules**を主軸とした安全なページ固有スタイリング
- **デザイントークン**（CSS変数）による一貫性の担保
- **最小限のグローバル設定**のみ許容
- **アクセシビリティ基準**の統一

## ✅ 推奨スタイリング方法

### 1. **CSS Modules**（主軸・最優先）
```tsx
// ✅ 推奨 - ページ固有の安全なスタイリング
// pages/my-page.module.css
.container {
  background: var(--color-primary-gradient);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.customCard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: transform var(--duration-medium);
}

.customCard:hover {
  transform: translateY(-4px);
}

// pages/my-page.tsx
import styles from './my-page.module.css'
<div className={styles.container}>
  <div className={styles.customCard}>
    完全に安全でスコープされたスタイル
  </div>
</div>
```

### 2. **デザイントークン**（CSS変数）
```css
/* src/styles/globals.css - 最小限の共通トークン */
:root {
  /* 色系 */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  
  /* 間隔系 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* その他 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 3. **Tailwind CSS**（補助的利用）
```tsx
// ✅ OK - 標準的なユーティリティクラス
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <span className="text-lg font-semibold text-gray-900">標準スタイル</span>
</div>
```

### 4. **インラインスタイル**（限定的利用）
```tsx
// ✅ 条件付きOK - 小規模・一時的・動的な値のみ
<div style={{
  transform: `translateX(${position}px)`, // 動的な値
  opacity: isVisible ? 1 : 0, // 条件分岐
  // ただし擬似クラス(:hover)等が必要ならCSS Modulesへ
}}>
  限定的な動的スタイル
</div>
```

## 🚫 禁止事項

### ❌ 破壊的グローバル変更
```css
/* globals.cssでの危険な変更 */
html, body { margin: 0; } /* ✅ リセットは最小限OK */
* { box-sizing: border-box; } /* ✅ 基本設定OK */

.container { width: 100vw; } /* ❌ 既存クラス上書き禁止 */
.btn { background: red; } /* ❌ 既存コンポーネント破壊禁止 */

/* @layer設定の無制限追加 */
@layer components {
  .btn-custom { ... } /* ❌ 新規グローバルクラス禁止 */
}
```

### ❌ セキュリティリスク
```tsx
// ❌ dangerouslySetInnerHTMLでのstyle注入禁止
<style dangerouslySetInnerHTML={{
  __html: userInput // XSSリスク
}} />
```

### ❌ アクセシビリティ違反
```tsx
// ❌ フォーカス可視性の無効化禁止
<button style={{ outline: 'none' }} /> /* focus-visibleは必須 */

// ❌ コントラスト比無視禁止
<div style={{ color: '#ccc', backgroundColor: '#ddd' }} /> /* 読めない */
```

## 🛡️ 許容されるグローバル設定（最小限）

### ✅ CSS変数定義
```css
/* src/styles/globals.css */
:root {
  --color-focus: #3b82f6;
  --focus-ring: 0 0 0 2px var(--color-focus);
}
```

### ✅ 統一フォーカスリング
```css
/* アクセシビリティ必須 */
*:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

### ✅ 基本リセット（最小限）
```css
/* 必要最小限のリセット */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

## 📋 アクセシビリティ基準

### 必須要件
- **フォーカス可視化**: `focus-visible`による統一リング
- **コントラスト比**: 4.5:1以上（AA基準）
- **キーボード操作**: 全インタラクティブ要素対応
- **ARIA属性**: 適切なセマンティクス
- **エラー表示**: 一貫したパターン

### 実装例
```tsx
// ✅ アクセシブルなボタン
<button 
  className={styles.customButton}
  aria-label="設定を保存"
  disabled={isLoading}
>
  {isLoading ? '保存中...' : '保存'}
</button>
```

## 🔧 運用ルール

### PRチェックリスト
- [ ] CSS Modulesを使用（インラインは最小限）
- [ ] デザイントークン（CSS変数）を活用
- [ ] グローバルCSS変更なし（例外は事前相談）
- [ ] アクセシビリティ基準満たす
- [ ] 他ページでの表示確認済み

### コード品質
- [ ] 擬似クラス（:hover, :focus）はCSS Modules
- [ ] メディアクエリはCSS Modules
- [ ] 再利用可能なスタイルはトークン化
- [ ] セキュリティリスク（XSS）なし

## 🎨 実装例

### ✅ 理想的なページ実装
```tsx
// pages/dashboard.tsx
import styles from './dashboard.module.css'

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📊 ダッシュボード</h1>
      </header>
      
      <main className={styles.main}>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2>売上統計</h2>
          </div>
        </div>
      </main>
    </div>
  )
}
```

```css
/* pages/dashboard.module.css */
.container {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: var(--spacing-lg);
}

.header {
  max-width: 1200px;
  margin: 0 auto var(--spacing-xl);
}

.title {
  font-size: 2.5rem;
  color: var(--color-text-primary);
  text-align: center;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-medium);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
  
  .title {
    font-size: 2rem;
  }
}
```

---

**このルールにより、安全性・一貫性・アクセシビリティ・保守性を両立できます！**

## 📋 実装例

### ✅ 良い例：ページ固有デザイン
```tsx
// pages/custom-dashboard.tsx
export default function CustomDashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '32px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#2D3748',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          🌟 カスタムダッシュボード
        </h1>
        
        {/* 既存のCardコンポーネントも使用可能 */}
        <Card style={{
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white'
        }}>
          <CardContent>
            <h2>カスタムカード</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### ❌ 悪い例：グローバル影響
```tsx
// ❌ NG - globals.cssに追加
.my-custom-global {
  background: red; /* 他のページに影響 */
}

// ❌ NG - 既存コンポーネント変更
// components/ui/Button.tsx を変更
```

## 🛡️ 安全性チェックリスト

### 新しいページ作成時
- [ ] インラインスタイルまたはCSS Modules使用
- [ ] globals.css未変更
- [ ] 既存コンポーネント未変更
- [ ] 他ページへの影響なし
- [ ] レスポンシブ対応済み

### スタイル適用前確認
- [ ] グローバルクラス名と競合しない
- [ ] 既存のTailwindクラスを上書きしない
- [ ] 他のページで表示確認済み

## 🎨 デザイン自由度

### 完全に自由に変更可能
- ✅ 背景色・グラデーション
- ✅ フォントサイズ・色
- ✅ レイアウト・配置
- ✅ アニメーション・トランジション
- ✅ カスタムアイコン・画像
- ✅ ブロック要素の配置
- ✅ モバイル・タブレット対応

### 制限事項
- ❌ 全ページ共通部分への影響
- ❌ 他ページのスタイル破綻
- ❌ パフォーマンスへの悪影響

---

**このルールに従って、各ページで完全に独立したデザインを自由に実装してください！**