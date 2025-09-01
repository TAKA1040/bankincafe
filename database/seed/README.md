# UI動作確認用シードデータ

## 📋 概要

作業入力UIの動作確認用の仮データ（シードデータ）を提供します。  

**目的**:
1. **入力フォーム動作確認** - structured/fuzzy/set作業の全パターン
2. **提案単価・raw_label検索テスト** - pricebook + history データ
3. **Supabase本番移行時の流用** - そのまま使える構造

## 🗂️ ファイル構成

```
database/seed/
├── work_history_samples.csv       # 作業履歴サンプル（40件）
├── work_sets_samples.csv          # セット作業ヘッダー（6件）
├── work_set_details_samples.csv   # セット作業詳細（27件）
├── load_seed_data.sql             # データ投入SQL
└── README.md                      # このファイル
```

## 🚀 セットアップ

### 1. 基本マイグレーション実行

```sql
-- 前提: 基本DB設計が完了していること
\i database/migrations/001_complete_dictionary_system.sql
\i database/migrations/002_seed_initial_data.sql
```

### 2. UI動作確認用データ投入

```sql
-- UI動作確認用シードデータ投入
\i database/seed/load_seed_data.sql
```

## 📊 データ内容詳細

### 1. 作業履歴サンプル（40件）

#### structured データ（18件）
- **対象**: タイヤ、ホイール、ライト、コーナーパネル等
- **動作**: 交換、脱着、点検、修理、塗装等  
- **位置**: 右、左、前後、右前等（一部NULL）
- **価格**: 800円〜18,000円の実用的価格帯

#### fuzzy データ（22件）
- **意図的誤記**: 「タイヤ」→「タイア」、「バンパー」→「バンパ」
- **ひらがな表記**: 「こうかん」「だっちゃく」
- **位置表記ゆれ**: 「うしろみぎ」「まえひだり」  
- **スペース混在**: 「ホイール　だっちゃく　ひだり」

### 2. セット作業サンプル（6セット、27詳細）

#### セット構成例

| セット名 | 価格 | 詳細件数 | テスト目的 |
|---------|------|---------|-----------|
| **車検整備一式** | ¥45,000 | 4件 | 点検系統一テスト |
| **タイヤ交換セット** | ¥22,000 | 8件 | 4輪脱着→交換フロー |
| **板金塗装セット** | ¥35,000 | 5件 | 脱着→修理→塗装フロー |
| **ヘッドライト調整セット** | ¥8,500 | 3件 | 小規模セット |
| **内装張替セット** | ¥18,000 | 3件 | 左右対称作業 |
| **定期点検セット** | ¥12,000 | 4件 | 各部位点検 |

## 🎯 UIテストシナリオ

### 1. structured入力テスト

```
1. 対象「タイヤ」選択 → 動作「交換,脱着,点検」が絞り込み表示
2. 動作「交換」選択 → 位置「右,左,前,後,右前,左前,右後,左後」が表示
3. 位置「右」選択 → 提案価格「5500円」が自動表示
4. 保存 → work_historyに正常登録
```

### 2. fuzzy入力テスト

```
1. フリー入力「タイア こうかん みぎ」
2. advancedFuzzySearch → 「タイヤ/交換/右」候補表示
3. 候補選択 → structured化
4. 保存 → raw_label保持で登録
```

### 3. set作業テスト

```
1. セット名「タイヤ交換セット」入力
2. 詳細8件（脱着4件+交換4件）が自動展開
3. 各詳細の編集・削除が可能
4. 保存 → work_sets + work_set_details に分割保存
```

## 🔍 確認クエリ例

### position_id NULL対応確認

```sql
SELECT 
  target_name,
  action_name,
  position_name -- NULLは「（指定なし）」と表示
FROM work_history_view
WHERE position_name = '（指定なし）';
```

### fuzzy検索データ確認

```sql
SELECT raw_label, target_name, action_name
FROM work_history_view
WHERE task_type = 'fuzzy'
ORDER BY raw_label;
```

### セット作業詳細確認

```sql
SELECT 
  ws.set_name,
  ws.unit_price,
  COUNT(wsd.id) as detail_count
FROM work_sets ws
LEFT JOIN work_set_details wsd ON ws.id = wsd.work_set_id
GROUP BY ws.id, ws.set_name, ws.unit_price;
```

## 📋 CSV必須カラム仕様

### work_history_samples.csv

| カラム | 型 | 必須 | 説明 |
|--------|----|----|------|
| `target_name` | VARCHAR | ✅ | 対象名（targetsテーブル参照） |
| `action_name` | VARCHAR | ✅ | 動作名（actionsテーブル参照） |
| `position_name` | VARCHAR | ⚪ | 位置名（NULL可、positionsテーブル参照） |
| `memo` | TEXT | ⚪ | メモ |
| `unit_price` | DECIMAL | ✅ | 単価 |
| `quantity` | INTEGER | ✅ | 数量 |
| `raw_label` | TEXT | ✅ | 元入力（fuzzy解析用） |
| `task_type` | TEXT | ✅ | 'structured' または 'fuzzy' |

### work_sets_samples.csv

| カラム | 型 | 必須 | 説明 |
|--------|----|----|------|
| `set_name` | VARCHAR | ✅ | セット名 |
| `unit_price` | DECIMAL | ✅ | セット価格 |
| `quantity` | INTEGER | ✅ | セット数量 |

### work_set_details_samples.csv

| カラム | 型 | 必須 | 説明 |
|--------|----|----|------|
| `set_name` | VARCHAR | ✅ | 対応するセット名 |
| `target_name` | VARCHAR | ✅ | 対象名 |
| `action_name` | VARCHAR | ✅ | 動作名 |
| `position_name` | VARCHAR | ⚪ | 位置名（NULL可） |
| `memo` | TEXT | ⚪ | 詳細メモ |
| `sort_order` | INTEGER | ✅ | 表示順序 |

## 🚦 fuzzy検索用raw_labelサンプル規模

### 推奨サンプル数

- **最小**: 20-30件（各種パターン網羅）
- **実用**: 40-60件（実運用シミュレーション）
- **最大**: 150件以内（Excel由来データ上限）

### 必須パターン

1. **表記ゆれ**: ひらがな、カタカナ、漢字混在
2. **誤記**: 一般的な打ち間違い
3. **省略**: 「交」「脱」等の略語
4. **位置表記**: 「右」「みぎ」「右側」等
5. **スペース**: 全角・半角・混在
6. **複合**: 「タイヤ交換右前」等

## 📈 次のステップ

### Phase 1: UI連携テスト
1. **プロトタイプでのデータ表示確認**
2. **段階的絞り込み動作テスト**  
3. **fuzzy検索精度評価**

### Phase 2: 本格データ準備
1. **Excel由来150件データの精査**
2. **本番想定のraw_labelパターン拡充**
3. **セット作業の実用パターン追加**

### Phase 3: Supabase移行準備
1. **CSVインポート手順確立**
2. **本番データクリーニング**
3. **移行用バッチスクリプト作成**

---

**シードデータ作成完了**: 2025-08-29  
**UI動作確認準備完了**: ✅  
**Supabase移行対応**: ✅