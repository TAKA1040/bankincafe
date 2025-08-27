import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './sample-design.module.css'

export default function SampleDesignPage() {
  const router = useRouter()
  const [activeCard, setActiveCard] = useState<string | null>(null)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={`${styles.title} ${styles.fadeInUp}`}>
          🎨 CSS Modules デザインサンプル
        </h1>
        <p className={styles.subtitle}>
          デザイントークン + CSS Modules による安全で一貫したスタイリング
        </p>
      </header>

      <main className={styles.cardGrid}>
        <div 
          className={styles.card}
          onMouseEnter={() => setActiveCard('features')}
          onMouseLeave={() => setActiveCard(null)}
        >
          <h2 className={styles.cardTitle}>
            ⚡ 主要機能
          </h2>
          <div className={styles.cardContent}>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>完全スコープ化されたスタイル</li>
              <li className={styles.featureItem}>CSS変数による一貫性</li>
              <li className={styles.featureItem}>レスポンシブデザイン対応</li>
              <li className={styles.featureItem}>アクセシビリティ準拠</li>
              <li className={styles.featureItem}>ダークモード対応</li>
            </ul>
          </div>
          <button 
            className={styles.button}
            onClick={() => router.push('/')}
            aria-label="ホームページに戻る"
          >
            ホームに戻る
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            🛡️ 安全性
          </h2>
          <div className={styles.cardContent}>
            <p>CSS Modulesにより、スタイルが他のページに影響することはありません。</p>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <span className={styles.statusBadge + ' ' + styles.statusSuccess}>
                セキュア
              </span>
            </div>
          </div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>グローバルスコープ汚染なし</li>
            <li className={styles.featureItem}>名前衝突の回避</li>
            <li className={styles.featureItem}>XSS脆弱性対策</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            🎯 一貫性
          </h2>
          <div className={styles.cardContent}>
            <p>デザイントークン（CSS変数）により、色・間隔・影などが統一されています。</p>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-md)'
          }}>
            <span className={styles.statusBadge + ' ' + styles.statusSuccess}>
              統一
            </span>
            <span className={styles.statusBadge + ' ' + styles.statusWarning}>
              保守性
            </span>
            <span className={styles.statusBadge + ' ' + styles.statusDanger}>
              高品質
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            🚀 パフォーマンス
          </h2>
          <div className={styles.cardContent}>
            <p>CSS Modulesは静的解析により、未使用スタイルの除去が可能です。</p>
          </div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>バンドルサイズ最適化</li>
            <li className={styles.featureItem}>キャッシュ効率向上</li>
            <li className={styles.featureItem}>CSS-in-JS よりも高速</li>
          </ul>
          
          {/* 動的スタイルの例（インラインスタイル使用） */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: activeCard === 'features' 
              ? 'var(--color-primary-50)' 
              : 'var(--color-secondary-50)',
            borderRadius: 'var(--radius-md)',
            transition: 'background var(--duration-medium)',
            fontSize: '0.875rem',
            color: 'var(--color-secondary-600)'
          }}>
            💡 この背景色は動的に変更されています（インラインスタイル使用例）
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            ♿ アクセシビリティ
          </h2>
          <div className={styles.cardContent}>
            <p>統一されたフォーカスリング、コントラスト比、キーボード操作に対応。</p>
          </div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>フォーカス可視化</li>
            <li className={styles.featureItem}>WCAG AA準拠</li>
            <li className={styles.featureItem}>スクリーンリーダー対応</li>
          </ul>
          <button 
            className={styles.button}
            tabIndex={0}
            aria-label="アクセシビリティテスト用ボタン"
          >
            Tab キーでフォーカス確認
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            📱 レスポンシブ
          </h2>
          <div className={styles.cardContent}>
            <p>CSS Modulesでのメディアクエリにより、全デバイス対応を実現。</p>
          </div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>モバイルファースト</li>
            <li className={styles.featureItem}>タブレット最適化</li>
            <li className={styles.featureItem}>デスクトップ対応</li>
          </ul>
          <div style={{ 
            fontSize: '0.75rem',
            color: 'var(--color-secondary-500)',
            marginTop: 'var(--spacing-md)'
          }}>
            画面サイズを変更して確認してください
          </div>
        </div>
      </main>
    </div>
  )
}