const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 作業項目分割のルール
function parseWorkItem(rawLabel) {
    if (!rawLabel || rawLabel.trim() === '') return [];
    
    // 分割文字: ・、/で区切る
    const separators = /[・、\/]/;
    const parts = rawLabel.split(separators).map(part => part.trim()).filter(part => part.length > 0);
    
    const results = [];
    
    parts.forEach((part, index) => {
        const workItem = {
            raw_label_part: part,
            action: extractAction(part),
            target: extractTarget(part),
            positions: extractPositions(part),
            sub_no: index + 1
        };
        results.push(workItem);
    });
    
    return results;
}

// アクション（動作）を抽出
function extractAction(text) {
    const actionPatterns = [
        '取替', '交換', '修理', '脱着', '調整', '点検', '清掃', '塗装',
        '溶接', '研磨', '補修', '張替', '組付', '分解', '組立', '装着'
    ];
    
    for (const pattern of actionPatterns) {
        if (text.includes(pattern)) {
            return pattern;
        }
    }
    
    // デフォルトアクション判定
    if (text.includes('一式') || text.includes('ASSY')) return '交換';
    if (text.includes('直し') || text.includes('なおし')) return '修理';
    
    return '作業'; // デフォルト
}

// 対象物を抽出
function extractTarget(text) {
    const targetPatterns = [
        'バンパー', 'ドア', 'フード', 'トランク', 'ミラー', 'ライト', 'ランプ',
        'パネル', 'ステップ', 'マフラー', 'タイヤ', 'ホイール', 'ブレーキ',
        'エンジン', 'ラジエーター', 'フィルター', 'センサー', 'ボルト',
        'フェンダー', 'グリル', 'ガラス', 'ワイパー', 'シート'
    ];
    
    for (const pattern of targetPatterns) {
        if (text.includes(pattern)) {
            return pattern;
        }
    }
    
    // ASSY系の処理
    if (text.includes('ASSY')) {
        const assyMatch = text.match(/(\w+)ASSY/);
        if (assyMatch) return assyMatch[1] + 'ASSY';
    }
    
    // デフォルト対象物
    return '部品';
}

// 位置情報を抽出
function extractPositions(text) {
    const positions = [];
    
    // 左右の判定
    if (text.includes('右') || text.includes('R')) positions.push('右');
    if (text.includes('左') || text.includes('L')) positions.push('左');
    
    // 前後の判定
    if (text.includes('前') || text.includes('フロント') || text.includes('F')) positions.push('前');
    if (text.includes('後') || text.includes('リヤ') || text.includes('リア') || text.includes('R')) {
        // 'R'が既に右として使われていない場合のみ
        if (!positions.includes('右')) positions.push('後');
    }
    
    // 上下の判定
    if (text.includes('上')) positions.push('上');
    if (text.includes('下')) positions.push('下');
    
    // 内外の判定
    if (text.includes('内側') || text.includes('内')) positions.push('内側');
    if (text.includes('外側') || text.includes('外')) positions.push('外側');
    
    return positions.length > 0 ? positions : ['中央']; // デフォルト位置
}

// 金額を分割計算（端数は最後の項目に寄せる）
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

async function analyzeExistingData() {
    console.log('=== 既存データ分析開始 ===');
    
    try {
        // 現在のinvoice_line_itemsデータを取得
        const { data: lineItems, error } = await supabase
            .from('invoice_line_items')
            .select('*')
            .order('id');
            
        if (error) {
            console.error('データ取得エラー:', error);
            return null;
        }
        
        console.log(`総明細項目数: ${lineItems.length}`);
        
        // task_type別の分析
        const taskTypes = {};
        const rawLabelStats = { hasRawLabel: 0, empty: 0, null: 0 };
        
        lineItems.forEach(item => {
            // task_type統計
            taskTypes[item.task_type] = (taskTypes[item.task_type] || 0) + 1;
            
            // raw_label統計
            if (item.raw_label && item.raw_label.trim() !== '') {
                rawLabelStats.hasRawLabel++;
            } else if (item.raw_label === '') {
                rawLabelStats.empty++;
            } else {
                rawLabelStats.null++;
            }
        });
        
        console.log('Task Type分布:', taskTypes);
        console.log('Raw Label統計:', rawLabelStats);
        
        // 分割対象データ（raw_labelがあるfuzzyタイプ）を特定
        const splitTargets = lineItems.filter(item => 
            item.task_type === 'fuzzy' && 
            item.raw_label && 
            item.raw_label.trim() !== ''
        );
        
        console.log(`分割対象項目数: ${splitTargets.length}`);
        
        // サンプルデータ表示
        console.log('\n分割対象サンプル:');
        splitTargets.slice(0, 5).forEach(item => {
            const parsed = parseWorkItem(item.raw_label);
            console.log(`ID:${item.id} - "${item.raw_label}"`);
            console.log(`  -> ${parsed.length}個に分割予定:`);
            parsed.forEach(p => {
                console.log(`     ${p.sub_no}. ${p.raw_label_part} [${p.action}/${p.target}] 位置:${p.positions.join(',')}`);
            });
            console.log('');
        });
        
        return { lineItems, splitTargets };
        
    } catch (error) {
        console.error('分析エラー:', error);
        return null;
    }
}

async function transformDataBatch(batchData, batchNumber) {
    console.log(`=== バッチ ${batchNumber} 処理開始 (${batchData.length}件) ===`);
    
    try {
        const splitItems = [];
        const positionItems = [];
        
        for (const lineItem of batchData) {
            const parsedItems = parseWorkItem(lineItem.raw_label);
            const amounts = distributeAmount(lineItem.amount || 0, parsedItems.length);
            const unitPrices = distributeAmount(lineItem.unit_price || 0, parsedItems.length);
            
            parsedItems.forEach((parsed, index) => {
                // invoice_line_items_split用データ
                const splitItem = {
                    invoice_id: lineItem.invoice_id,
                    line_no: lineItem.line_no,
                    sub_no: parsed.sub_no,
                    raw_label_part: parsed.raw_label_part,
                    action: parsed.action,
                    target: parsed.target,
                    unit_price: unitPrices[index],
                    quantity: lineItem.quantity || 1,
                    amount: amounts[index],
                    is_cancelled: false,
                    confidence_score: 0.8, // 自動分割の信頼度
                    extraction_method: 'auto_split',
                    notes: `元明細ID:${lineItem.id}から自動分割`
                };
                
                splitItems.push(splitItem);
                
                // work_item_positions用データ
                // Note: split_item_idは後で取得する必要があるため、一旦識別子を作る
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
        }
        
        return true;
        
    } catch (error) {
        console.error(`バッチ ${batchNumber} 処理エラー:`, error);
        return false;
    }
}

async function executeTransformation(splitTargets) {
    console.log('=== データ変換実行開始 ===');
    
    const BATCH_SIZE = 10; // 安全のため小さなバッチサイズ
    const totalBatches = Math.ceil(splitTargets.length / BATCH_SIZE);
    
    console.log(`総バッチ数: ${totalBatches} (バッチサイズ: ${BATCH_SIZE})`);
    
    // 既存の分割データをクリア
    await supabase.from('work_item_positions').delete().neq('id', 0);
    await supabase.from('invoice_line_items_split').delete().neq('id', 0);
    console.log('既存の分割データをクリア');
    
    let successCount = 0;
    
    for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * BATCH_SIZE;
        const batchData = splitTargets.slice(startIndex, startIndex + BATCH_SIZE);
        
        const success = await transformDataBatch(batchData, i + 1);
        
        if (success) {
            successCount++;
            console.log(`バッチ ${i + 1}/${totalBatches} 完了`);
        } else {
            console.error(`バッチ ${i + 1} 失敗`);
        }
        
        // 安全のため少し待機
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`変換完了: ${successCount}/${totalBatches} バッチ成功`);
    return successCount === totalBatches;
}

async function verifyTransformation() {
    console.log('=== 変換結果検証 ===');
    
    try {
        // 分割項目数確認
        const { count: splitCount, error: splitError } = await supabase
            .from('invoice_line_items_split')
            .select('*', { count: 'exact', head: true });
            
        if (splitError) {
            console.error('分割項目数取得エラー:', splitError);
            return;
        }
        
        // 位置項目数確認
        const { count: posCount, error: posError } = await supabase
            .from('work_item_positions')
            .select('*', { count: 'exact', head: true });
            
        if (posError) {
            console.error('位置項目数取得エラー:', posError);
            return;
        }
        
        console.log(`生成された分割項目: ${splitCount}件`);
        console.log(`生成された位置項目: ${posCount}件`);
        
        // サンプルデータ確認
        const { data: sampleSplit, error: sampleError } = await supabase
            .from('invoice_line_items_split')
            .select(`
                *,
                work_item_positions(position)
            `)
            .limit(5);
            
        if (sampleError) {
            console.error('サンプルデータ取得エラー:', sampleError);
            return;
        }
        
        console.log('\n生成データサンプル:');
        sampleSplit.forEach(item => {
            const positions = item.work_item_positions.map(p => p.position).join(',');
            console.log(`${item.invoice_id}-${item.line_no}-${item.sub_no}: ${item.raw_label_part}`);
            console.log(`  アクション:${item.action}, 対象:${item.target}, 位置:${positions}, 金額:${item.amount}`);
        });
        
    } catch (error) {
        console.error('検証エラー:', error);
    }
}

async function main() {
    console.log('作業項目変換スクリプト開始');
    console.log('新しいデータベース構造に対応した分割処理を実行します');
    
    // 1. 既存データ分析
    const analysisResult = await analyzeExistingData();
    if (!analysisResult) {
        console.error('データ分析に失敗しました');
        return;
    }
    
    const { splitTargets } = analysisResult;
    
    if (splitTargets.length === 0) {
        console.log('分割対象データがありません');
        return;
    }
    
    // 2. データ変換実行
    const transformSuccess = await executeTransformation(splitTargets);
    
    if (!transformSuccess) {
        console.error('データ変換に失敗しました');
        return;
    }
    
    // 3. 結果検証
    await verifyTransformation();
    
    console.log('\n✅ 作業項目変換処理完了');
    console.log('新しいデータベース構造での分割データが生成されました');
}

main().catch(console.error);