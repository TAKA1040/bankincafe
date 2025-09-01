# 📊 Supabase データベース構造・テーブル一覧

## 📋 テーブル構造概要

### 🎯 1. 辞書系テーブル（マスターデータ）

#### **targets（対象マスター）**
- **役割**: 作業対象物の管理（タイヤ、ホイール等）
- **利用箇所**: 
  - `src/app/work-dictionary/page.tsx` - マスター設定画面
  - `src/hooks/useWorkDictionary.ts` - 辞書データ取得
  - `src/hooks/useProgressiveFilter.ts` - プログレッシブフィルタリング

#### **actions（動作マスター）**
- **役割**: 作業動作の管理（交換、脱着、取付等）
- **利用箇所**: 
  - `src/app/work-dictionary/page.tsx` - マスター設定画面
  - `src/hooks/useWorkDictionary.ts` - 辞書データ取得

#### **positions（位置マスター）**
- **役割**: 作業位置の管理（右、左、前、後等）※「指定なし」はNULLで表現
- **利用箇所**: マスター設定での選択肢制御

#### **target_actions（対象→動作関連性）**
- **役割**: 対象と動作の組み合わせ可能性を管理
- **利用箇所**:
  - `src/app/work-dictionary/page.tsx` - 関連性設定
  - `src/hooks/useProgressiveFilter.ts` - 選択肢の絞り込み

#### **reading_mappings（読み仮名マッピング）**
- **役割**: 曖昧検索支援のための読み仮名管理
- **利用箇所**: オートコンプリート・曖昧検索機能（将来実装）

#### **price_suggestions（価格提案マスター）**
- **役割**: 対象・動作組み合わせの推奨価格管理
- **利用箇所**: 価格入力時の推奨価格表示（将来実装）

---

### 💰 2. 請求書系テーブル

#### **invoices（請求書ヘッダー）**
- **役割**: 請求書の基本情報管理
- **主要カラム**:
  - `invoice_id` (TEXT PRIMARY KEY) - 請求書ID
  - `customer_name` (TEXT) - 顧客名
  - `total_amount` (NUMERIC) - 総額
  - `payment_status` ('paid'/'unpaid'/'partial') - 支払状況
  - `status` ('draft'/'finalized'/'sent'/'paid') - 請求書ステータス
- **利用箇所**:
  - `src/hooks/useInvoiceList.ts` - 請求書一覧表示・フィルタリング
  - `src/hooks/useSalesData.ts` - 売上データ集計・分析
  - `pages/invoice-list.tsx` - 請求書一覧ページ

#### **invoice_line_items（請求書明細）**
- **役割**: 請求書の作業項目詳細管理
- **主要カラム**:
  - `task_type` ('fuzzy'/'structured'/'set') - 作業種別
  - `raw_label` (TEXT) - 元の作業内容
  - `unit_price`, `quantity`, `amount` - 価格情報
- **利用箇所**:
  - `src/hooks/useInvoiceList.ts` - 明細データ取得・表示

#### **invoice_line_items_split（請求書明細分割）**
- **役割**: 複雑な作業項目の細分化管理
- **主要カラム**:
  - `confidence_score` - AI抽出信頼度
  - `extraction_method` - 抽出方法
  - `is_cancelled` - 取消フラグ
- **利用箇所**:
  - `src/hooks/useInvoiceList.ts` - 分割明細データ取得

---

### 📝 3. 作業履歴系テーブル

#### **work_history（作業履歴）**
- **役割**: 個別作業の履歴記録管理
- **利用箇所**:
  - `src/hooks/useWorkHistory.ts` - 作業履歴表示
  - `src/hooks/useWorkDictionary.ts` - 履歴ベース価格提案

#### **work_sets（セット作業ヘッダー）**
- **役割**: 複数作業をまとめたセット管理
- **利用箇所**: セット作業入力機能（将来実装）

#### **work_set_details（セット作業詳細）**
- **役割**: セット作業の個別項目管理
- **利用箇所**: セット作業詳細表示（将来実装）

---

### 👤 4. 設定系テーブル

#### **user_preferences（ユーザー設定）**
- **役割**: ユーザー固有設定の管理
- **利用箇所**: 将来のマルチユーザー対応時

---

## 🔗 主要なテーブル間リレーション

```
# 辞書系
targets ←→ target_actions ←→ actions
actions ←→ action_positions ←→ positions

# 作業履歴系
targets ←← work_history →→ actions
positions ←← work_history

# 請求書系
invoices ←← invoice_line_items
invoice_line_items ←← invoice_line_items_split

# 横断的関係
work_history → invoices (invoice_id)
work_sets → invoices (invoice_id)
```

---

## 📱 フロントエンド機能とテーブル利用マップ

### **🏠 ダッシュボード**
- `invoices` - 最近の請求書表示
- `work_history` - 最近の作業履歴表示

### **📋 請求書管理**
- **一覧画面**: `invoices` + `invoice_line_items`
- **詳細画面**: `invoice_line_items` + `invoice_line_items_split`
- **作成画面**: `src/app/invoice-create/page.tsx` (ローカル管理)

### **📊 売上管理**
- `invoices` - 月別・顧客別集計
- `invoice_line_items` - 作業項目別分析

### **🔧 作業辞書管理**
- `targets`, `actions`, `positions` - マスターデータCRUD
- `target_actions` - 関連性設定

### **📝 作業履歴**
- `work_history` - 個別作業記録
- `work_sets` + `work_set_details` - セット作業記録

### **⚙️ 設定画面**
- `src/app/customer-settings/page.tsx` - 顧客設定（ローカルストレージ）
- `src/app/subject-settings/page.tsx` - 科目設定（ローカルストレージ）

---

## 🧪 テストデータ作成時の重要ポイント

### **優先度 HIGH（必須データ）**
1. **`targets`** - 10-15件程度のリアルな対象物
2. **`actions`** - 10-12件程度の作業動作
3. **`target_actions`** - 現実的な組み合わせ関係
4. **`invoices`** - 様々なステータス・顧客の請求書（30-50件）
5. **`invoice_line_items`** - 各請求書に2-5件の明細

### **優先度 MEDIUM（機能拡張時に必要）**
1. **`positions`** - 位置情報マスター
2. **`work_history`** - 過去作業の蓄積データ
3. **`invoice_line_items_split`** - AI解析結果のサンプル

### **優先度 LOW（将来対応）**
1. **`reading_mappings`** - 読み仮名データ
2. **`price_suggestions`** - 価格提案データ
3. **`work_sets` + `work_set_details`** - セット作業データ

---

## 📈 データボリューム目安

| テーブル | 本番想定 | テスト推奨 | 備考 |
|---------|---------|-----------|------|
| targets | 20-30件 | 15件 | 車両部品中心 |
| actions | 15-20件 | 12件 | 整備作業中心 |
| positions | 8-12件 | 8件 | 基本位置のみ |
| target_actions | 100-150件 | 50件 | 現実的組み合わせ |
| invoices | 1000+件/年 | 50件 | 多様なパターン |
| invoice_line_items | 5000+件/年 | 150件 | 1請求書あたり2-5件 |
| work_history | 10000+件/年 | 200件 | 過去実績データ |

---

## 🎯 テストデータ作成の推奨アプローチ

1. **実データ分析**: 既存の請求書PDFや作業記録から実際の作業パターンを抽出
2. **段階的作成**: 辞書系 → 請求書系 → 作業履歴系の順で作成
3. **リレーション検証**: 外部キー制約を活用した整合性確保
4. **業務パターン反映**: 実際の業務フローに沿ったリアルなデータ作成
5. **パフォーマンステスト**: 検索・集計処理の性能検証用データ

このDB構造とデータ利用マップを基に、現実的で包括的なテストデータを作成することで、システム全体の動作検証が可能になります。