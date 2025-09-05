const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 強化された位置情報抽出（複数位置の詳細認識）
function extractEnhancedPositions(text) {
    const positions = [];
    const textLower = text.toLowerCase();
    
    // 左右の判定（優先度順）
    if (textLower.includes('左右') || textLower.includes('両側')) {
        positions.push('左', '右');
    } else {
        if (textLower.includes('左') || textLower.includes('l側') || textLower.includes('レフト')) {
            positions.push('左');
        }
        if (textLower.includes('右') || textLower.includes('r側') || textLower.includes('ライト') || 
            (textLower.includes('r') && !textLower.includes('リア') && !textLower.includes('リヤ'))) {
            positions.push('右');
        }
    }
    
    // 前後の判定
    if (textLower.includes('前後') || textLower.includes('フロントリア') || textLower.includes('フロントリヤ')) {
        positions.push('前', '後');
    } else {
        if (textLower.includes('前') || textLower.includes('フロント') || textLower.includes('f') ||
            textLower.includes('先頭') || textLower.includes('フロントエンド')) {
            positions.push('前');
        }
        if (textLower.includes('後') || textLower.includes('リア') || textLower.includes('リヤ') ||
            textLower.includes('後方') || textLower.includes('テール')) {
            positions.push('後');
        }
    }
    
    // 上下の判定
    if (textLower.includes('上下')) {
        positions.push('上', '下');
    } else {
        if (textLower.includes('上') || textLower.includes('アッパー') || textLower.includes('トップ') ||
            textLower.includes('アップ') || textLower.includes('天井')) {
            positions.push('上');
        }
        if (textLower.includes('下') || textLower.includes('ロア') || textLower.includes('ロワー') ||
            textLower.includes('ボトム') || textLower.includes('アンダー')) {
            positions.push('下');
        }
    }
    
    // 内外の判定
    if (textLower.includes('内外')) {
        positions.push('内側', '外側');
    } else {
        if (textLower.includes('内側') || textLower.includes('内') || textLower.includes('インナー') ||
            textLower.includes('室内') || textLower.includes('インサイド')) {
            positions.push('内側');
        }
        if (textLower.includes('外側') || textLower.includes('外') || textLower.includes('アウター') ||
            textLower.includes('外装') || textLower.includes('アウトサイド')) {
            positions.push('外側');
        }
    }
    
    // 特殊な位置指定
    if (textLower.includes('中央') || textLower.includes('センター') || textLower.includes('ミッド')) {
        positions.push('中央');
    }
    
    // 角度・方向の詳細指定
    if (textLower.includes('角') || textLower.includes('コーナー')) {
        if (textLower.includes('前') && textLower.includes('右')) positions.push('右前角');
        else if (textLower.includes('前') && textLower.includes('左')) positions.push('左前角');
        else if (textLower.includes('後') && textLower.includes('右')) positions.push('右後角');
        else if (textLower.includes('後') && textLower.includes('左')) positions.push('左後角');
    }
    
    // 数字による位置指定（第一、第二など）- ファーストステップは除外
    if ((textLower.includes('第一') || textLower.includes('1番')) && !textLower.includes('ステップ')) {
        positions.push('1番');
    }
    if (textLower.includes('第二') || textLower.includes('2番') || textLower.includes('セカンド')) {
        positions.push('2番');
    }
    
    // 車両特有の位置
    if (textLower.includes('運転席') || textLower.includes('ドライバー')) {
        positions.push('運転席側');
    }
    if (textLower.includes('助手席') || textLower.includes('パッセンジャー')) {
        positions.push('助手席側');
    }
    
    // 位置が見つからない場合のデフォルト
    if (positions.length === 0) {
        positions.push('中央');
    }
    
    // 重複除去
    return [...new Set(positions)];
}

// 対象物抽出（原文から主要部品を抽出、変換はしない）
function extractEnhancedTarget(text) {
    // 主要なキーワードで判別するが、原文の用語をそのまま抽出
    const targetPatterns = [
        // 完全一致優先（固有名詞）
        { pattern: /ファーストステップ/i, target: 'ファーストステップ' },
        { pattern: /セカンドステップ/i, target: 'セカンドステップ' },
        { pattern: /ロアカバー/i, target: 'ロアカバー' },
        { pattern: /リフレクター/i, target: 'リフレクター' },
        
        // ASSY系（完全な部品名を抽出）
        { pattern: /([^\s・、/]*ASSY)/i, target: '$1' },
        
        // 一般的な部品名（原文のまま）
        { pattern: /(バンパー)/i, target: '$1' },
        { pattern: /(ドア)/i, target: '$1' },
        { pattern: /(フード)/i, target: '$1' },
        { pattern: /(ミラー)/i, target: '$1' },
        { pattern: /(ライト)/i, target: '$1' },
        { pattern: /(ランプ)/i, target: '$1' },
        { pattern: /(フラッシャー)/i, target: '$1' },
        { pattern: /(マフラー)/i, target: '$1' },
        { pattern: /(センサー)/i, target: '$1' },
        { pattern: /(ブラケット)/i, target: '$1' },
        { pattern: /(ステップ)/i, target: '$1' },
        { pattern: /(グリル)/i, target: '$1' },
        { pattern: /(パネル)/i, target: '$1' },
        { pattern: /(カバー)/i, target: '$1' },
        { pattern: /(マウント)/i, target: '$1' }
    ];
    
    for (const { pattern, target } of targetPatterns) {
        const match = text.match(pattern);
        if (match) {
            if (target.includes('$1')) {
                return target.replace('$1', match[1]);
            }
            return target;
        }
    }
    
    // 対象物が特定できない場合は空文字（デフォルト値は設定しない）
    return '';
}

// アクション抽出（原文の動作をそのまま抽出）
function extractEnhancedAction(text) {
    const actionPatterns = [
        // 原文の表現をそのまま抽出
        { pattern: /(取替|取り替え)/i, action: '$1' },
        { pattern: /(交換)/i, action: '$1' },
        { pattern: /(修理)/i, action: '$1' },
        { pattern: /(脱着)/i, action: '$1' },
        { pattern: /(調整)/i, action: '$1' },
        { pattern: /(点検)/i, action: '$1' },
        { pattern: /(清掃)/i, action: '$1' },
        { pattern: /(塗装)/i, action: '$1' },
        { pattern: /(溶接)/i, action: '$1' },
        { pattern: /(研磨)/i, action: '$1' },
        { pattern: /(張替)/i, action: '$1' },
        { pattern: /(組付)/i, action: '$1' },
        { pattern: /(取付)/i, action: '$1' },
        { pattern: /(分解)/i, action: '$1' },
        { pattern: /(組立)/i, action: '$1' },
        { pattern: /(装着)/i, action: '$1' },
        { pattern: /(切断)/i, action: '$1' },
        { pattern: /(取外し)/i, action: '$1' },
        { pattern: /(外し)/i, action: '$1' },
        
        // 複合的な表現
        { pattern: /(折れ込み[^\s・、/]*)/i, action: '$1' },
        { pattern: /(嚙み込み[^\s・、/]*)/i, action: '$1' },
        { pattern: /(鈑金[^\s・、/]*)/i, action: '$1' }
    ];
    
    for (const { pattern, action } of actionPatterns) {
        const match = text.match(pattern);
        if (match) {
            if (action.includes('$1')) {
                return action.replace('$1', match[1]);
            }
            return action;
        }
    }
    
    // アクションが特定できない場合は空文字
    return '';
}

// 原文尊重の作業名生成（専門用語はそのまま保持）
function generateFriendlyWorkName(originalPart, action, target, positions) {
    // 原文をそのまま使用（専門用語を勝手に変換しない）
    // 位置情報の重複のみ整理
    let workName = originalPart.trim();
    
    // 明らかな重複位置のみ除去（例：「左左バンパー」→「左バンパー」）
    workName = workName.replace(/([左右前後上下内外])(\1)/g, '$1');
    
    return workName;
}

// 位置情報を読みやすい文字列にフォーマット
function formatPositions(positions) {
    if (!positions || positions.length === 0) return '';
    if (positions.length === 1) return positions[0];
    
    // 論理的な順序で並び替え
    const orderMap = {
        '左': 1, '右': 2, '前': 3, '後': 4, 
        '上': 5, '下': 6, '内側': 7, '外側': 8,
        '運転席側': 9, '助手席側': 10, '中央': 11,
        '左前角': 12, '右前角': 13, '左後角': 14, '右後角': 15,
        '1番': 16, '2番': 17
    };
    
    const sortedPositions = positions.sort((a, b) => 
        (orderMap[a] || 999) - (orderMap[b] || 999)
    );
    
    // 自然な表現に変換
    if (sortedPositions.includes('左') && sortedPositions.includes('右')) {
        const others = sortedPositions.filter(p => p !== '左' && p !== '右');
        return others.length > 0 ? `左右${others.join('')}` : '左右';
    }
    
    if (sortedPositions.includes('前') && sortedPositions.includes('後')) {
        const others = sortedPositions.filter(p => p !== '前' && p !== '後');
        return others.length > 0 ? `前後${others.join('')}` : '前後';
    }
    
    return sortedPositions.join('');
}

// 左右・前後などの同一作業の複数箇所実施かを判定
function isSameWorkMultipleLocations(rawLabel) {
    // 左右・前後などの同一作業パターン
    const locationPairs = ['左右', '前後', '上下', '内外'];
    return locationPairs.some(pair => rawLabel.includes(pair));
}

// セット作業かどうかを判定
function isSetWork(lineItem) {
    const rawLabel = lineItem.raw_label || '';
    const quantity = lineItem.quantity || 1;
    
    // 数量が2以上の場合は個別作業（数量違い）
    // セット作業ではない
    if (quantity > 1) return false;
    
    // 左右・前後などは個別作業（同一作業の複数箇所）
    if (isSameWorkMultipleLocations(rawLabel)) return false;
    
    // テキストにセット作業を示すキーワードが含まれている
    const setKeywords = [
        '一式', 'セット', 'SET', 'set', '複数', 
        '全体', '全面', '４枚', '4枚', '２個', '2個', '複数個'
    ];
    
    return setKeywords.some(keyword => rawLabel.includes(keyword));
}

// 新しいtask_typeを決定
function determineTaskType(lineItem, parsedItems) {
    const rawLabel = lineItem.raw_label || '';
    const quantity = lineItem.quantity || 1;
    
    // 1. 明示的なセット作業の判定
    if (isSetWork(lineItem)) {
        return 'set';
    }
    
    // 2. 左右・前後などの同一作業複数箇所 = 個別作業（数量複数）
    if (isSameWorkMultipleLocations(rawLabel)) {
        return 'individual';
    }
    
    // 3. 数量が2以上 = 個別作業（数量複数）
    if (quantity > 1) {
        return 'individual';
    }
    
    // 4. 複数項目に分割された場合 = セット作業（異なる作業の組み合わせ）
    if (parsedItems.length > 1) {
        return 'set';
    }
    
    // 5. 分割されなかった単一項目の場合
    if (parsedItems.length === 1) {
        const item = parsedItems[0];
        // アクションとターゲットが明確な場合は個別作業
        if (item.action && item.target) {
            return 'individual';
        }
        // 明確でない場合は非構造化
        return 'fuzzy';
    }
    
    // デフォルトはfuzzy
    return 'fuzzy';
}

// 強化された作業項目分割
function parseWorkItemEnhanced(rawLabel) {
    if (!rawLabel || rawLabel.trim() === '') return [];
    
    // 分割文字: ・、/で区切る
    const separators = /[・、\/]/;
    const parts = rawLabel.split(separators).map(part => part.trim()).filter(part => part.length > 0);
    
    const results = [];
    
    parts.forEach((part, index) => {
        const action = extractEnhancedAction(part);
        const target = extractEnhancedTarget(part);
        const positions = extractEnhancedPositions(part);
        const friendlyName = generateFriendlyWorkName(part, action, target, positions);
        
        const workItem = {
            raw_label_part: part,  // 原文そのまま
            friendly_name: part.trim(),  // 原文をそのまま使用（専門用語保持）
            action: action,
            target: target,
            positions: positions,
            sub_no: index + 1
        };
        results.push(workItem);
    });
    
    return results;
}

// 強化された変換処理
async function transformDataBatchEnhanced(batchData, batchNumber) {
    console.log(`=== バッチ ${batchNumber} 処理開始 (${batchData.length}件) ===`);
    
    try {
        const splitItems = [];
        const positionItems = [];
        
        // バッチ内の元テーブル更新用データ
        const lineItemUpdates = [];
        
        for (const lineItem of batchData) {
            const parsedItems = parseWorkItemEnhanced(lineItem.raw_label);
            const amounts = distributeAmount(lineItem.amount || 0, parsedItems.length);
            const unitPrices = distributeAmount(lineItem.unit_price || 0, parsedItems.length);
            
            // 新しいtask_typeを決定
            const newTaskType = determineTaskType(lineItem, parsedItems);
            
            // 元テーブル更新データ
            lineItemUpdates.push({
                id: lineItem.id,
                task_type: newTaskType
            });
            
            console.log(`  ${lineItem.raw_label} → ${newTaskType} (${parsedItems.length}分割)`);
            
            parsedItems.forEach((parsed, index) => {
                // invoice_line_items_split用データ
                const splitItem = {
                    invoice_id: lineItem.invoice_id,
                    line_no: lineItem.line_no,
                    sub_no: parsed.sub_no,
                    raw_label_part: parsed.raw_label_part, // 原文をそのまま使用
                    action: parsed.action,
                    target: parsed.target,
                    unit_price: unitPrices[index],
                    quantity: lineItem.quantity || 1,
                    amount: amounts[index],
                    is_cancelled: false,
                    confidence_score: 0.9, // 強化されたルールで信頼度アップ
                    extraction_method: 'enhanced_auto_split',
                    notes: `元明細ID:${lineItem.id}から強化ルールで分割`
                };
                
                splitItems.push(splitItem);
                
                // work_item_positions用データ（複数位置対応）
                parsed.positions.forEach(position => {
                    positionItems.push({
                        temp_key: `${lineItem.invoice_id}_${lineItem.line_no}_${parsed.sub_no}`,
                        position: position
                    });
                });
            });
        }
        
        // invoice_line_items_splitに挿入
        if (splitItems.length > 0) {
            const { data: insertedSplit, error: splitError } = await supabase
                .from('invoice_line_items_split')
                .insert(splitItems)
                .select('id, invoice_id, line_no, sub_no');
                
            if (splitError) {
                console.error(`バッチ ${batchNumber} split挿入エラー:`, splitError);
                return false;
            }
            
            console.log(`バッチ ${batchNumber}: ${splitItems.length}件のsplit項目を挿入`);
            
            // work_item_positionsに挿入（split_item_idを取得してから）
            const positionInserts = [];
            
            for (const insertedItem of insertedSplit) {
                const tempKey = `${insertedItem.invoice_id}_${insertedItem.line_no}_${insertedItem.sub_no}`;
                const matchingPositions = positionItems.filter(p => p.temp_key === tempKey);
                
                matchingPositions.forEach(pos => {
                    positionInserts.push({
                        split_item_id: insertedItem.id,
                        position: pos.position
                    });
                });
            }
            
            if (positionInserts.length > 0) {
                const { error: posError } = await supabase
                    .from('work_item_positions')
                    .insert(positionInserts);
                    
                if (posError) {
                    console.error(`バッチ ${batchNumber} position挿入エラー:`, posError);
                    return false;
                }
                
                console.log(`バッチ ${batchNumber}: ${positionInserts.length}件のposition項目を挿入`);
            }
            
            // 元のinvoice_line_itemsテーブルのtask_type更新
            for (const update of lineItemUpdates) {
                const { error: updateError } = await supabase
                    .from('invoice_line_items')
                    .update({ task_type: update.task_type })
                    .eq('id', update.id);
                    
                if (updateError) {
                    console.error(`ID:${update.id} のtask_type更新エラー:`, updateError);
                }
            }
            
            console.log(`バッチ ${batchNumber}: ${lineItemUpdates.length}件のtask_type更新`);
        }
        
        return true;
        
    } catch (error) {
        console.error(`バッチ ${batchNumber} 処理エラー:`, error);
        return false;
    }
}

// 金額分割関数（既存のまま）
function distributeAmount(totalAmount, itemCount) {
    if (!totalAmount || totalAmount === 0) return Array(itemCount).fill(0);
    
    const baseAmount = Math.floor(totalAmount / itemCount);
    const remainder = totalAmount % itemCount;
    
    const amounts = Array(itemCount).fill(baseAmount);
    if (remainder > 0) {
        amounts[amounts.length - 1] += remainder;
    }
    
    return amounts;
}

// 変換結果の詳細検証
async function verifyTransformationResult() {
    console.log('\n=== 変換結果の詳細検証 ===');
    
    try {
        // 分割項目の統計
        const { count: splitCount, error: splitError } = await supabase
            .from('invoice_line_items_split')
            .select('*', { count: 'exact', head: true });
            
        if (splitError) {
            console.error('分割項目数取得エラー:', splitError);
            return;
        }
        
        // 位置項目の統計
        const { count: positionCount, error: positionError } = await supabase
            .from('work_item_positions')
            .select('*', { count: 'exact', head: true });
            
        if (positionError) {
            console.error('位置項目数取得エラー:', positionError);
            return;
        }
        
        console.log(`✅ 生成された分割項目: ${splitCount}件`);
        console.log(`✅ 生成された位置項目: ${positionCount}件`);
        
        // 更新後のtask_type分布確認
        const { data: updatedLineItems, error: lineItemsError } = await supabase
            .from('invoice_line_items')
            .select('task_type');
            
        if (!lineItemsError) {
            const taskTypeCounts = {};
            updatedLineItems.forEach(item => {
                taskTypeCounts[item.task_type] = (taskTypeCounts[item.task_type] || 0) + 1;
            });
            
            console.log('\n📊 更新後のtask_type分布:');
            Object.entries(taskTypeCounts).forEach(([type, count]) => {
                const typeLabels = {
                    'set': 'セット作業',
                    'individual': '個別作業', 
                    'structured': '構造化済み',
                    'fuzzy': '非構造化'
                };
                console.log(`  ${typeLabels[type] || type}: ${count}件`);
            });
        }
        
        // アクションとターゲットの分布確認
        const { data: actionStats, error: actionError } = await supabase
            .from('invoice_line_items_split')
            .select('action')
            .not('action', 'is', null)
            .neq('action', '');
            
        const { data: targetStats, error: targetError } = await supabase
            .from('invoice_line_items_split')
            .select('target')
            .not('target', 'is', null)
            .neq('target', '');
            
        if (!actionError && !targetError) {
            const actionCounts = {};
            actionStats.forEach(item => {
                actionCounts[item.action] = (actionCounts[item.action] || 0) + 1;
            });
            
            const targetCounts = {};
            targetStats.forEach(item => {
                targetCounts[item.target] = (targetCounts[item.target] || 0) + 1;
            });
            
            console.log('\n📊 アクション分布:');
            Object.entries(actionCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .forEach(([action, count]) => {
                    console.log(`  ${action}: ${count}件`);
                });
            
            console.log('\n📊 対象物分布:');
            Object.entries(targetCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .forEach(([target, count]) => {
                    console.log(`  ${target}: ${count}件`);
                });
        }
        
        // 実際のデータサンプル表示
        const { data: samples, error: sampleError } = await supabase
            .from('invoice_line_items_split')
            .select(`
                id,
                invoice_id,
                line_no,
                sub_no,
                raw_label_part,
                action,
                target,
                work_item_positions(position)
            `)
            .order('id')
            .limit(10);
            
        if (sampleError) {
            console.error('サンプル取得エラー:', sampleError);
            return;
        }
        
        console.log('\n📋 生成データサンプル:');
        samples.forEach((item, index) => {
            const positions = item.work_item_positions.map(p => p.position).join('|') || '位置なし';
            console.log(`${index + 1}. ${item.raw_label_part}`);
            console.log(`   ID: ${item.invoice_id}-${item.line_no}-${item.sub_no}`);
            console.log(`   アクション: ${item.action || '未設定'} / 対象: ${item.target || '未設定'} / 位置: ${positions}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('検証中にエラーが発生:', error);
    }
}

// サンプルデータでのテスト関数
async function testEnhancedTransformation() {
    console.log('=== 強化された変換ルールのテスト ===');
    
    const testCases = [
        "リヤフラッシャーASSY取替・ブラケット鈑金修理",
        "左ファーストステップ・ロアカバー・リフレクター取替・ステップブラケット脱着修正・左ドアフラッシャー取替",
        "フロントリッド・グリル脱着・フロントキャブサスマウントリンク脱着リンクブッシュ嚙み込み取外し交換",
        "右前バンパー修理・左後ドア調整",
        "上下ミラー清掃・内外ガラス交換"
    ];
    
    testCases.forEach((testCase, index) => {
        console.log(`\nテストケース ${index + 1}: "${testCase}"`);
        const parsed = parseWorkItemEnhanced(testCase);
        parsed.forEach(item => {
            console.log(`  ${item.sub_no}. ${item.friendly_name}`);
            console.log(`     アクション:${item.action}, 対象:${item.target}, 位置:${item.positions.join('|')}`);
        });
    });
}

async function main() {
    console.log('強化された作業項目変換スクリプト開始');
    console.log('複数位置対応と親切な作業名生成機能を搭載');
    
    // テスト実行
    await testEnhancedTransformation();
    
    console.log('\n実際のデータ変換を実行します...');
    
    // 実際のデータ変換実行部分
    const { data: lineItems, error } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('task_type', 'fuzzy')
        .not('raw_label', 'is', null)
        .neq('raw_label', '')
        .order('id');
        
    if (error) {
        console.error('データ取得エラー:', error);
        return;
    }
    
    console.log(`取得した明細項目: ${lineItems.length}件`);
    
    // 既存データクリア
    console.log('既存の分割データをクリア中...');
    await supabase.from('work_item_positions').delete().neq('id', 0);
    await supabase.from('invoice_line_items_split').delete().neq('id', 0);
    
    // バッチ処理実行
    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(lineItems.length / BATCH_SIZE);
    console.log(`バッチ処理開始: ${totalBatches}バッチで処理`);
    
    let successCount = 0;
    for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * BATCH_SIZE;
        const batchData = lineItems.slice(startIndex, startIndex + BATCH_SIZE);
        
        const success = await transformDataBatchEnhanced(batchData, i + 1);
        if (success) successCount++;
        
        // 進捗表示
        console.log(`進捗: ${i + 1}/${totalBatches} (${Math.round((i + 1) / totalBatches * 100)}%)`);
        await new Promise(resolve => setTimeout(resolve, 300)); // 少し短縮
    }
    
    console.log(`\n変換処理完了: ${successCount}/${totalBatches} バッチ成功`);
    
    // 最終結果確認
    await verifyTransformationResult();
}

main().catch(console.error);