const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parse/sync');

// Supabase設定
const supabaseUrl = 'https://auwmmosfteomieyexkeh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1d21tb3NmdGVvbWlleWV4a2VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzNzE1NiwiZXhwIjoyMDcxMDEzMTU2fQ.XKwCDb2pndGMMpp2aaUNVWkpXnOZYV3-IXMwd75s6Wc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 既存の作業タイプ判定ロジック
function isSameWorkMultipleLocations(rawLabel) {
    const locationPairs = ['左右', '前後', '上下', '内外'];
    return locationPairs.some(pair => rawLabel.includes(pair));
}

function isSetWork(lineItem) {
    const rawLabel = lineItem.raw_label || '';
    const quantity = lineItem.quantity || 1;
    
    if (quantity > 1) return false;
    if (isSameWorkMultipleLocations(rawLabel)) return false;
    
    const setKeywords = [
        '一式', 'セット', 'SET', 'set', '複数', 
        '全体', '全面', '４枚', '4枚', '２個', '2個', '複数個'
    ];
    
    return setKeywords.some(keyword => rawLabel.includes(keyword));
}

function parseWorkItemEnhanced(rawLabel) {
    if (!rawLabel || rawLabel.trim() === '') return [];
    
    const separators = /[・、\/]/;
    const parts = rawLabel.split(separators).map(part => part.trim()).filter(part => part.length > 0);
    
    const results = [];
    
    parts.forEach((part, index) => {
        const action = extractEnhancedAction(part);
        const target = extractEnhancedTarget(part);
        const positions = extractEnhancedPositions(part);
        
        const workItem = {
            raw_label_part: part,
            action: action,
            target: target,
            positions: positions,
            sub_no: index + 1
        };
        results.push(workItem);
    });
    
    return results;
}

function extractEnhancedAction(text) {
    const actionPatterns = [
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
        { pattern: /(折れ込み[^\\s・、/]*)/i, action: '$1' },
        { pattern: /(嚙み込み[^\\s・、/]*)/i, action: '$1' },
        { pattern: /(鈑金[^\\s・、/]*)/i, action: '$1' }
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
    
    return '';
}

function extractEnhancedTarget(text) {
    const targetPatterns = [
        { pattern: /ファーストステップ/i, target: 'ファーストステップ' },
        { pattern: /セカンドステップ/i, target: 'セカンドステップ' },
        { pattern: /ロアカバー/i, target: 'ロアカバー' },
        { pattern: /リフレクター/i, target: 'リフレクター' },
        { pattern: /([^\\s・、/]*ASSY)/i, target: '$1' },
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
    
    return '';
}

function extractEnhancedPositions(text) {
    const positions = [];
    const textLower = text.toLowerCase();
    
    if (textLower.includes('左右') || textLower.includes('両側')) {
        positions.push('左', '右');
    } else {
        if (textLower.includes('左')) positions.push('左');
        if (textLower.includes('右')) positions.push('右');
    }
    
    if (textLower.includes('前後')) {
        positions.push('前', '後');
    } else {
        if (textLower.includes('前') || textLower.includes('フロント')) positions.push('前');
        if (textLower.includes('後') || textLower.includes('リア') || textLower.includes('リヤ')) positions.push('後');
    }
    
    if (textLower.includes('上下')) {
        positions.push('上', '下');
    } else {
        if (textLower.includes('上') || textLower.includes('アッパー')) positions.push('上');
        if (textLower.includes('下') || textLower.includes('ロア')) positions.push('下');
    }
    
    if (textLower.includes('内外')) {
        positions.push('内側', '外側');
    } else {
        if (textLower.includes('内側') || textLower.includes('内')) positions.push('内側');
        if (textLower.includes('外側') || textLower.includes('外')) positions.push('外側');
    }
    
    if (textLower.includes('中央') || textLower.includes('センター')) positions.push('中央');
    
    if (positions.length === 0) positions.push('中央');
    
    return [...new Set(positions)];
}

function determineTaskType(lineItem, parsedItems) {
    const rawLabel = lineItem.raw_label || '';
    const quantity = lineItem.quantity || 1;
    
    if (isSetWork(lineItem)) return 'set';
    if (isSameWorkMultipleLocations(rawLabel)) return 'individual';
    if (quantity > 1) return 'individual';
    if (parsedItems.length > 1) return 'set';
    
    if (parsedItems.length === 1) {
        const item = parsedItems[0];
        if (item.action && item.target) return 'individual';
        return 'fuzzy';
    }
    
    return 'fuzzy';
}

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

async function importCSVToDatabase() {
    console.log('=== CSV強化インポート開始 ===');
    console.log('新しいデータベース構造と作業タイプ判定ロジック適用');
    
    try {
        // CSVファイル読み込み
        const csvFilePath = 'C:\\\\Windsurf\\\\bankincafe\\\\請求書システム画像\\\\hondata\\\\dada2.csv';
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            bom: true // BOM対応
        });
        
        // BOMを完全に除去（念のため）
        if (records.length > 0) {
            const firstRecord = records[0];
            const keys = Object.keys(firstRecord);
            if (keys[0].includes('請求書番号')) {
                const cleanKey = '請求書番号';
                if (keys[0] !== cleanKey) {
                    records.forEach(record => {
                        record[cleanKey] = record[keys[0]];
                        delete record[keys[0]];
                    });
                }
            }
        }
        
        console.log(`📁 CSV読み込み完了: ${records.length}件`);
        
        // 重複チェック
        const invoiceIds = records.map(r => r['請求書番号']).filter(id => id);
        const uniqueIds = [...new Set(invoiceIds)];
        if (invoiceIds.length !== uniqueIds.length) {
            console.log(`⚠️  重複データ検出: 総件数${invoiceIds.length}件, ユニーク${uniqueIds.length}件`);
            // 重複除去
            const seenIds = new Set();
            const uniqueRecords = records.filter(record => {
                const id = record['請求書番号'];
                if (seenIds.has(id)) {
                    return false;
                }
                seenIds.add(id);
                return true;
            });
            records.length = 0;
            records.push(...uniqueRecords);
            console.log(`✅ 重複除去後: ${records.length}件`);
        }
        
        // 既存データクリアはスキップ（事前に手動で実行済み）
        console.log('🧹 既存データクリア：スキップ（事前実行済み）');
        
        const invoices = [];
        const lineItems = [];
        const splitItems = [];
        const positionItems = [];
        const legacyItems = [];
        
        for (const record of records) {
            // 請求書ヘッダー作成
            const invoice = {
                invoice_id: record['請求書番号'],
                invoice_number: record['請求書番号'],
                billing_date: parseDate(record['請求日']),
                issue_date: parseDate(record['請求日']),
                customer_category: 'UD',
                customer_name: record['請求先'],
                subject: record['件名'],
                registration_number: record['登録番号'],
                purchase_order_number: record['発注番号'],
                order_number: record['オーダー番号'],
                subtotal: parseInt(record['小計']) || 0,
                tax: parseInt(record['消費税']) || 0,
                total: parseInt(record['請求金額']) || 0,
                total_amount: parseInt(record['請求金額']) || 0,
                billing_month: record['請求月'],
                status: 'finalized',
                payment_status: 'unpaid',
                invoice_type: 'standard',
                remarks: record['備考'] || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            invoices.push(invoice);
            
            // 明細項目処理（品名1-32）
            for (let i = 1; i <= 32; i++) {
                const itemName = record[`品名${i}`];
                const quantity = parseInt(record[`数量${i}`]) || 0;
                const unitPrice = parseInt(record[`単価${i}`]) || 0;
                const amount = parseInt(record[`金額${i}`]) || 0;
                
                if (!itemName || itemName.trim() === '') continue;
                
                // invoice_line_items作成
                const lineItem = {
                    invoice_id: record['請求書番号'],
                    line_no: i,
                    raw_label: itemName.trim(),
                    quantity: quantity,
                    unit_price: unitPrice,
                    amount: amount,
                    task_type: 'fuzzy', // 後で更新
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                // 作業項目解析
                const parsedItems = parseWorkItemEnhanced(itemName);
                const taskType = determineTaskType(lineItem, parsedItems);
                lineItem.task_type = taskType;
                
                lineItems.push(lineItem);
                
                // legacy_line_item_raws作成（fuzzyの場合）
                if (taskType === 'fuzzy') {
                    legacyItems.push({
                        line_item_id: `${record['請求書番号']}_${i}`, // 仮ID、後で実際のIDに更新
                        raw_text: itemName.trim()
                    });
                }
                
                // invoice_line_items_split作成
                if (parsedItems.length > 0) {
                    const amounts = distributeAmount(amount, parsedItems.length);
                    const unitPrices = distributeAmount(unitPrice, parsedItems.length);
                    
                    parsedItems.forEach((parsed, index) => {
                        const splitId = `${record['請求書番号']}_${i}_${parsed.sub_no}`;
                        
                        const splitItem = {
                            invoice_id: record['請求書番号'],
                            line_no: i,
                            sub_no: parsed.sub_no,
                            raw_label_part: parsed.raw_label_part,
                            action: parsed.action,
                            target: parsed.target,
                            unit_price: unitPrices[index],
                            quantity: quantity,
                            amount: amounts[index],
                            is_cancelled: false,
                            confidence_score: 0.9,
                            extraction_method: 'enhanced_csv_import',
                            notes: `CSV自動インポート (${record['請求書番号']})`,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };
                        
                        splitItems.push(splitItem);
                        
                        // work_item_positions作成
                        parsed.positions.forEach(position => {
                            positionItems.push({
                                temp_split_id: splitId, // 後で実際のIDに更新
                                position: position
                            });
                        });
                    });
                }
            }
        }
        
        console.log(`📊 処理結果:`);
        console.log(`  請求書: ${invoices.length}件`);
        console.log(`  明細項目: ${lineItems.length}件`);
        console.log(`  分割項目: ${splitItems.length}件`);
        console.log(`  位置情報: ${positionItems.length}件`);
        console.log(`  旧原文: ${legacyItems.length}件`);
        
        // バッチ挿入実行
        await executeInsertBatches(invoices, lineItems, splitItems, positionItems, legacyItems);
        
        // 最終検証
        await verifyImportResults();
        
    } catch (error) {
        console.error('CSVインポートエラー:', error);
        throw error;
    }
}

function parseDate(dateString) {
    if (!dateString) return null;
    
    // 2021/11/4 -> 2021-11-04
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    return null;
}

async function executeInsertBatches(invoices, lineItems, splitItems, positionItems, legacyItems) {
    console.log('📥 データベースへの挿入開始...');
    
    // 1. 請求書挿入
    const BATCH_SIZE = 50;
    for (let i = 0; i < invoices.length; i += BATCH_SIZE) {
        const batch = invoices.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('invoices').insert(batch);
        if (error) {
            console.error(`請求書挿入エラー (バッチ ${Math.floor(i/BATCH_SIZE) + 1}):`, error);
            throw error;
        }
        console.log(`  請求書バッチ ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(invoices.length/BATCH_SIZE)} 完了`);
    }
    
    // 2. 明細項目挿入
    for (let i = 0; i < lineItems.length; i += BATCH_SIZE) {
        const batch = lineItems.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('invoice_line_items').insert(batch);
        if (error) {
            console.error(`明細項目挿入エラー (バッチ ${Math.floor(i/BATCH_SIZE) + 1}):`, error);
            throw error;
        }
        console.log(`  明細項目バッチ ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(lineItems.length/BATCH_SIZE)} 完了`);
    }
    
    // 3. 分割項目挿入（split_item_idを取得）
    const splitIdMapping = new Map();
    for (let i = 0; i < splitItems.length; i += BATCH_SIZE) {
        const batch = splitItems.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase
            .from('invoice_line_items_split')
            .insert(batch)
            .select('id, invoice_id, line_no, sub_no');
            
        if (error) {
            console.error(`分割項目挿入エラー (バッチ ${Math.floor(i/BATCH_SIZE) + 1}):`, error);
            throw error;
        }
        
        // IDマッピングを保存
        data.forEach(item => {
            const tempId = `${item.invoice_id}_${item.line_no}_${item.sub_no}`;
            splitIdMapping.set(tempId, item.id);
        });
        
        console.log(`  分割項目バッチ ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(splitItems.length/BATCH_SIZE)} 完了`);
    }
    
    // 4. 位置情報挿入
    const positionInserts = positionItems.map(item => ({
        split_item_id: splitIdMapping.get(item.temp_split_id),
        position: item.position
    })).filter(item => item.split_item_id); // IDが見つからない場合は除外
    
    for (let i = 0; i < positionInserts.length; i += BATCH_SIZE) {
        const batch = positionInserts.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('work_item_positions').insert(batch);
        if (error) {
            console.error(`位置情報挿入エラー (バッチ ${Math.floor(i/BATCH_SIZE) + 1}):`, error);
            throw error;
        }
        console.log(`  位置情報バッチ ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(positionInserts.length/BATCH_SIZE)} 完了`);
    }
    
    console.log('✅ 全データ挿入完了');
}

async function verifyImportResults() {
    console.log('\n=== インポート結果検証 ===');
    
    // 各テーブルの件数確認
    const { count: invoiceCount } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
    const { count: lineItemCount } = await supabase.from('invoice_line_items').select('*', { count: 'exact', head: true });
    const { count: splitCount } = await supabase.from('invoice_line_items_split').select('*', { count: 'exact', head: true });
    const { count: positionCount } = await supabase.from('work_item_positions').select('*', { count: 'exact', head: true });
    
    console.log(`📊 インポート結果:`);
    console.log(`  請求書: ${invoiceCount}件`);
    console.log(`  明細項目: ${lineItemCount}件`);
    console.log(`  分割項目: ${splitCount}件`);
    console.log(`  位置情報: ${positionCount}件`);
    
    // task_type分布確認
    const { data: taskTypes } = await supabase.from('invoice_line_items').select('task_type');
    const taskTypeCounts = {};
    taskTypes.forEach(item => {
        taskTypeCounts[item.task_type] = (taskTypeCounts[item.task_type] || 0) + 1;
    });
    
    console.log('\\n📋 Task Type分布:');
    Object.entries(taskTypeCounts).forEach(([type, count]) => {
        const labels = { set: 'セット作業', individual: '個別作業', fuzzy: '非構造化' };
        console.log(`  ${labels[type] || type}: ${count}件`);
    });
    
    // サンプル確認
    const { data: samples } = await supabase
        .from('invoices')
        .select(`
            invoice_id,
            customer_name,
            subject,
            total,
            invoice_line_items(raw_label, task_type, amount)
        `)
        .limit(3);
        
    console.log('\\n📝 インポートサンプル:');
    samples.forEach(invoice => {
        console.log(`${invoice.invoice_id}: ${invoice.customer_name}`);
        console.log(`  件名: ${invoice.subject} / 金額: ¥${invoice.total.toLocaleString()}`);
        invoice.invoice_line_items.forEach(item => {
            console.log(`    [${item.task_type}] ${item.raw_label} - ¥${item.amount}`);
        });
        console.log('');
    });
    
    console.log('✅ インポート検証完了');
}

if (require.main === module) {
    importCSVToDatabase()
        .then(() => console.log('🎉 CSV強化インポート成功'))
        .catch(error => console.error('❌ CSV強化インポート失敗:', error));
}

module.exports = { importCSVToDatabase };