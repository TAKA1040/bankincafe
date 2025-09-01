# 段階的絞り込み機能 設計書

## 📋 概要

作業入力システムにおける「対象→動作→位置」の段階的絞り込み機能の詳細設計です。ユーザーが選択した内容に基づいて、次の選択肢を動的に制限することで、直感的で効率的な入力体験を提供します。

## 🎯 機能仕様

### 基本フロー
```
[全対象表示] → [対象選択] → [関連動作のみ表示] → [動作選択] → [関連位置のみ表示] → [位置選択]
```

### 絞り込みルール
1. **初期状態**: 全ての対象を表示、動作・位置は空
2. **対象選択後**: その対象に関連する動作のみ表示、位置は空
3. **動作選択後**: その動作に関連する位置のみ表示
4. **対象変更時**: 動作・位置をリセットし、新しい対象の関連動作を表示

## 🗄️ データベース構造

### 1. マスターテーブル

#### targets（対象マスター）
```sql
CREATE TABLE targets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### actions（動作マスター）
```sql
CREATE TABLE actions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### positions（位置マスター）
```sql
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 関連性管理テーブル

#### target_actions（対象→動作の関連性）
```sql
CREATE TABLE target_actions (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id) ON DELETE CASCADE,
  action_id INTEGER REFERENCES actions(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false, -- よく使う組み合わせ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(target_id, action_id)
);
```

#### action_positions（動作→位置の関連性）
```sql
CREATE TABLE action_positions (
  id SERIAL PRIMARY KEY,
  action_id INTEGER REFERENCES actions(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES positions(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false, -- よく使う組み合わせ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(action_id, position_id)
);
```

## 🔍 絞り込み用クエリ

### 1. 全対象取得（初期表示）
```sql
SELECT id, name, display_name
FROM targets 
WHERE is_active = true 
ORDER BY sort_order, name;
```

### 2. 対象に関連する動作取得
```sql
SELECT a.id, a.name, a.display_name, ta.is_primary
FROM actions a
INNER JOIN target_actions ta ON ta.action_id = a.id
WHERE ta.target_id = :target_id
  AND a.is_active = true
ORDER BY ta.is_primary DESC, a.sort_order, a.name;
```

### 3. 動作に関連する位置取得
```sql
SELECT p.id, p.name, p.display_name, ap.is_primary
FROM positions p
INNER JOIN action_positions ap ON ap.position_id = p.id
WHERE ap.action_id = :action_id
  AND p.is_active = true
ORDER BY ap.is_primary DESC, p.sort_order, p.name;
```

### 4. 複合条件での位置取得（より厳密な絞り込み）
```sql
SELECT DISTINCT p.id, p.name, p.display_name
FROM positions p
INNER JOIN action_positions ap ON ap.position_id = p.id
WHERE ap.action_id = :action_id
  AND p.is_active = true
  AND EXISTS (
    SELECT 1 FROM target_actions ta 
    WHERE ta.target_id = :target_id 
      AND ta.action_id = :action_id
  )
ORDER BY p.sort_order, p.name;
```

## 🛠️ API設計

### エンドポイント設計

#### 1. 対象一覧取得
```typescript
GET /api/targets
Response: Target[]

interface Target {
  id: number;
  name: string;
  displayName?: string;
}
```

#### 2. 対象に関連する動作取得
```typescript
GET /api/targets/:targetId/actions
Response: Action[]

interface Action {
  id: number;
  name: string;
  displayName?: string;
  isPrimary: boolean; // よく使う動作
}
```

#### 3. 動作に関連する位置取得
```typescript
GET /api/actions/:actionId/positions
Response: Position[]

interface Position {
  id: number;
  name: string;
  displayName?: string;
  isPrimary: boolean; // よく使う位置
}
```

#### 4. 複合条件での位置取得
```typescript
GET /api/positions?targetId=:targetId&actionId=:actionId
Response: Position[]
```

## ⚙️ フロントエンド実装

### 1. 状態管理
```typescript
interface FilterState {
  selectedTarget: Target | null;
  selectedAction: Action | null;
  selectedPosition: Position | null;
  availableTargets: Target[];
  availableActions: Action[];
  availablePositions: Position[];
  isLoading: {
    targets: boolean;
    actions: boolean;
    positions: boolean;
  };
}
```

### 2. 絞り込みロジック
```typescript
// 対象選択時
const handleTargetSelect = async (target: Target) => {
  setSelectedTarget(target);
  setSelectedAction(null); // リセット
  setSelectedPosition(null); // リセット
  
  setIsLoading(prev => ({ ...prev, actions: true }));
  const actions = await fetchActionsByTarget(target.id);
  setAvailableActions(actions);
  setAvailablePositions([]); // クリア
  setIsLoading(prev => ({ ...prev, actions: false }));
};

// 動作選択時
const handleActionSelect = async (action: Action) => {
  setSelectedAction(action);
  setSelectedPosition(null); // リセット
  
  setIsLoading(prev => ({ ...prev, positions: true }));
  const positions = await fetchPositionsByAction(action.id);
  setAvailablePositions(positions);
  setIsLoading(prev => ({ ...prev, positions: false }));
};
```

### 3. UI表示ロジック
```typescript
const FilteredInputs: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* 対象選択 - 常に表示 */}
      <Select
        options={availableTargets}
        value={selectedTarget}
        onChange={handleTargetSelect}
        placeholder="対象を選択"
        disabled={isLoading.targets}
      />
      
      {/* 動作選択 - 対象選択後に表示 */}
      <Select
        options={availableActions}
        value={selectedAction}
        onChange={handleActionSelect}
        placeholder="動作を選択"
        disabled={!selectedTarget || isLoading.actions}
      />
      
      {/* 位置選択 - 動作選択後に表示 */}
      <Select
        options={availablePositions}
        value={selectedPosition}
        onChange={setSelectedPosition}
        placeholder="位置を選択"
        disabled={!selectedAction || isLoading.positions}
      />
    </div>
  );
};
```

## 📊 初期データセットアップ

### 関連性データの定義例

#### 対象→動作の関連性
```sql
-- タイヤ関連
INSERT INTO target_actions (target_id, action_id, is_primary) 
SELECT t.id, a.id, 
  CASE WHEN a.name IN ('交換', '点検') THEN true ELSE false END
FROM targets t, actions a 
WHERE t.name = 'タイヤ' 
  AND a.name IN ('（指定なし）', '交換', '脱着', '点検');

-- バンパー関連  
INSERT INTO target_actions (target_id, action_id, is_primary)
SELECT t.id, a.id,
  CASE WHEN a.name IN ('修理', '塗装') THEN true ELSE false END
FROM targets t, actions a
WHERE t.name = 'バンパー'
  AND a.name IN ('（指定なし）', '修理', '塗装', '脱着');
```

#### 動作→位置の関連性
```sql
-- 交換作業の関連位置
INSERT INTO action_positions (action_id, position_id, is_primary)
SELECT a.id, p.id,
  CASE WHEN p.name IN ('右', '左', '前', '後') THEN true ELSE false END
FROM actions a, positions p
WHERE a.name = '交換'
  AND p.name IN ('右', '左', '前', '後', '右前', '左前', '右後', '左後');

-- 点検作業の関連位置
INSERT INTO action_positions (action_id, position_id, is_primary)
SELECT a.id, p.id,
  CASE WHEN p.name IN ('左右', '前後') THEN true ELSE false END
FROM actions a, positions p
WHERE a.name = '点検'
  AND p.name IN ('右', '左', '前', '後', '左右', '前後');
```

## 🔄 拡張機能

### 1. 学習機能
```sql
-- 使用履歴テーブル
CREATE TABLE usage_history (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id),
  action_id INTEGER REFERENCES actions(id),
  position_id INTEGER REFERENCES positions(id),
  user_id INTEGER, -- 将来のユーザー管理用
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- よく使われる組み合わせの自動更新
CREATE OR REPLACE FUNCTION update_primary_flags()
RETURNS TRIGGER AS $$
BEGIN
  -- 使用回数に基づいてis_primaryを更新
  UPDATE target_actions 
  SET is_primary = (
    SELECT COUNT(*) > 10 
    FROM usage_history 
    WHERE target_id = NEW.target_id AND action_id = NEW.action_id
  )
  WHERE target_id = NEW.target_id AND action_id = NEW.action_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. 条件付き絞り込み
```sql
-- より詳細な条件設定
CREATE TABLE filtering_rules (
  id SERIAL PRIMARY KEY,
  target_id INTEGER REFERENCES targets(id),
  action_id INTEGER REFERENCES actions(id),
  excluded_positions TEXT[], -- 除外する位置
  required_positions TEXT[], -- 必須の位置
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 動的バリデーション
```typescript
// 無効な組み合わせのチェック
const validateCombination = (
  target: Target, 
  action: Action, 
  position?: Position
): ValidationResult => {
  // データベースで関連性をチェック
  // 無効な組み合わせの場合は警告またはエラー
};
```

## 📈 パフォーマンス最適化

### 1. インデックス最適化
```sql
-- 頻繁に使用されるクエリ用
CREATE INDEX idx_target_actions_target ON target_actions(target_id) INCLUDE (action_id, is_primary);
CREATE INDEX idx_action_positions_action ON action_positions(action_id) INCLUDE (position_id, is_primary);
```

### 2. キャッシュ戦略
```typescript
// React Query を使用したキャッシュ
const useFilteredActions = (targetId?: number) => {
  return useQuery(
    ['actions', targetId],
    () => fetchActionsByTarget(targetId!),
    {
      enabled: !!targetId,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );
};
```

## 🧪 テストケース

### 1. 基本フロー
- [ ] 対象未選択時は動作・位置が無効化されている
- [ ] 対象選択後、関連する動作のみ表示される
- [ ] 動作選択後、関連する位置のみ表示される
- [ ] 対象変更時、動作・位置がリセットされる

### 2. エッジケース
- [ ] 関連する動作が存在しない対象の処理
- [ ] 関連する位置が存在しない動作の処理
- [ ] ネットワークエラー時の処理
- [ ] 同時並行リクエストの処理

### 3. パフォーマンス
- [ ] 大量データでの応答速度
- [ ] キャッシュ効果の確認
- [ ] 連続選択時のレスポンス

---

**作成日**: 2024-08-28  
**対象**: bankincafe 作業入力システム  
**バージョン**: 1.0