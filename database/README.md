# データベース設計・連携ドキュメント

## 📋 概要

辞書登録機能を含む作業入力システムの完全なデータベース設計とマイグレーション。

**作成日**: 2025-08-29  
**対象**: bankincafe 作業入力システム  
**データベース**: PostgreSQL (Supabase)  

## 🗂️ ファイル構成

```
database/
├── migrations/
│   ├── 001_complete_dictionary_system.sql    # 完全DB設計
│   └── 002_seed_initial_data.sql             # 初期データ投入
├── test/
│   └── database_integration_test.sql         # 連携テスト
└── README.md                                 # このファイル
```

## 🚀 セットアップ手順

### 1. マイグレーション実行

```sql
-- 1. 完全なDB設計を適用
\i database/migrations/001_complete_dictionary_system.sql

-- 2. 初期データを投入
\i database/migrations/002_seed_initial_data.sql
```

### 2. 連携テスト実行

```sql
-- 3. 動作確認テスト
\i database/test/database_integration_test.sql
```

## 📊 データベース構造

### 🎯 マスターテーブル

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| `targets` | 対象マスター | id, name, sort_order, is_active |
| `actions` | 動作マスター | id, name, sort_order, is_active |
| `positions` | 位置マスター | id, name, sort_order, is_active |

### 🔗 関連性管理

| テーブル | 説明 | 関連 |
|---------|------|------|
| `target_actions` | 対象→動作関連 | targets.id ↔ actions.id |
| `action_positions` | 動作→位置関連 | actions.id ↔ positions.id |

### 📝 検索・読み仮名

| テーブル | 説明 | 主要カラム |
|---------|------|-----------|
| `reading_mappings` | 読み仮名マッピング | word, reading_hiragana, reading_katakana, word_type |

### 💼 作業データ

| テーブル | 説明 | 特記事項 |
|---------|------|---------|
| `work_history` | 作業履歴 | position_id NULL = 指定なし |
| `work_sets` | セット作業ヘッダー | - |
| `work_set_details` | セット作業詳細 | position_id NULL = 指定なし |

## 🔍 重要な設計ポイント

### 1. position_id のNULL運用

```sql
-- ❌ 従来: 「（指定なし）」レコードを作成
INSERT INTO positions (name) VALUES ('（指定なし）');

-- ✅ 新設計: NULLで表現、表示時にCOALESCE
position_id IS NULL  -- = 指定なし

-- 表示時
SELECT COALESCE(p.name, '（指定なし）') as position_name
FROM work_history wh
LEFT JOIN positions p ON wh.position_id = p.id;
```

### 2. ENUM → TEXT+CHECK 制約

```sql
-- ❌ 従来: ENUM
word_type ENUM('target', 'action', 'position')

-- ✅ 新設計: TEXT + CHECK
word_type TEXT CHECK (word_type IN ('target', 'action', 'position'))
```

### 3. 正規化ユニーク制約

```sql
-- 重複防止（大文字小文字・全半角吸収）
CREATE UNIQUE INDEX uniq_targets_name_norm ON targets (lower(name));
```

### 4. 全文検索対応

```sql
-- trgm インデックス（英数字・部分的日本語）
CREATE INDEX gin_targets_name_trgm ON targets USING gin (name gin_trgm_ops);

-- 将来: pg_bigm 推奨（完全日本語対応）
-- CREATE INDEX gin_targets_name_bigm ON targets USING gin (name gin_bigm_ops);
```

## 📈 初期データ内容

### マスターデータ件数

- **targets**: 8件（タイヤ、ホイール、ライト等）
- **actions**: 12件（交換、脱着、取付等）  
- **positions**: 10件（右、左、前、後等）

### 関連性データ

- **target_actions**: 23件（対象→動作の組み合わせ）
- **action_positions**: 62件（動作→位置の組み合わせ）

### 読み仮名データ

- **reading_mappings**: 19件（ひらがな・カタカナ読み）

### その他

- **price_suggestions**: 7件（価格提案データ）
- **user_preferences**: 5件（デフォルト設定）

## 🎯 辞書登録機能の準備

### 入力インターフェース

```typescript
interface DictionaryRegistration {
  itemType: 'target' | 'action' | 'position';
  name: string;
  readingHiragana: string;
  readingKatakana: string;
  relatedIds?: number[]; // 関連するID配列
  sortOrder?: number;
}
```

### 出力インターフェース

```typescript
interface DictionaryInsertResult {
  success: boolean;
  insertedId?: number;
  insertedName: string;
  itemType: 'target' | 'action' | 'position';
  message: string;
  relationsCreated?: {
    targetActions?: number;
    actionPositions?: number;
  };
}
```

## 🔧 API実装準備

### 必要なAPI エンドポイント

1. **GET /api/dictionary/search**
   - 曖昧検索（読み仮名対応）
   - 段階的絞り込み用データ取得

2. **POST /api/dictionary/register** 
   - 新規辞書登録
   - UPSERT対応（重複回避）

3. **GET /api/dictionary/relations**
   - 関連性データ取得
   - 対象→動作、動作→位置の関連

## 🚦 次のステップ

### Phase 1: API実装
1. **辞書検索API** - 曖昧検索・関連性取得
2. **辞書登録API** - UPSERT・関連性登録
3. **バリデーション** - 重複チェック・整合性確認

### Phase 2: UI実装  
1. **辞書登録モーダル** - 新規項目登録画面
2. **段階的絞り込み連携** - DB→UI データフロー
3. **リアルタイム検索** - 曖昧検索連携

### Phase 3: 高度機能
1. **同時実行制御** - 複数ユーザー対応
2. **履歴管理** - 変更ログ・バックアップ
3. **外部連携** - 既存システムとの同期

## 📝 運用メモ

### パフォーマンス
- 全文検索には pg_bigm 推奨（日本語完全対応）
- インデックス効果のモニタリング必要
- 大量データでのクエリ最適化

### セキュリティ
- 入力値サニタイゼーション
- SQL インジェクション対策
- トランザクション整合性

### 保守性
- マイグレーション履歴管理
- テストデータの自動生成
- バックアップ・復旧手順

---

**データベース設計完了**: 2025-08-29  
**次回実装**: 辞書登録API → 辞書登録UI → 完全連携テスト