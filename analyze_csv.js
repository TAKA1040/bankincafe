const fs = require('fs');

function analyzeCSV() {
    console.log('=== CSV分析開始 ===');
    
    const csvPath = 'C:\\Windsurf\\bankincafe\\請求書システム画像\\hondata\\dada2.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // ヘッダー分析
    const headers = lines[0].split(',');
    console.log(`\n📊 基本情報:`);
    console.log(`- 総行数: ${lines.length} (ヘッダー含む)`);
    console.log(`- データ行数: ${lines.length - 1}`);
    console.log(`- 列数: ${headers.length}`);
    
    // ヘッダー構造表示
    console.log(`\n📋 列構造:`);
    headers.forEach((header, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}: ${header}`);
    });
    
    // データサンプル表示（最初の3行）
    console.log(`\n📄 データサンプル（最初の3行）:`);
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
        const columns = lines[i].split(',');
        console.log(`\n--- 行 ${i} ---`);
        headers.forEach((header, index) => {
            const value = columns[index]?.replace(/"/g, '')?.trim() || '';
            if (value) {
                console.log(`${header}: ${value}`);
            }
        });
    }
    
    // データ品質分析
    console.log(`\n📈 データ品質分析:`);
    
    const analysis = {
        invoiceNumbers: new Set(),
        customers: new Set(),
        years: new Set(),
        months: new Set(),
        emptyFields: {},
        invalidDates: 0,
        totalItems: 0,
        itemsWithValues: 0
    };
    
    headers.forEach(header => {
        analysis.emptyFields[header] = 0;
    });
    
    // データ行を分析
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        
        // 請求書番号
        const invoiceNumber = columns[0]?.replace(/"/g, '')?.trim();
        if (invoiceNumber) {
            analysis.invoiceNumbers.add(invoiceNumber);
        }
        
        // 顧客名
        const customer = columns[3]?.replace(/"/g, '')?.trim();
        if (customer) {
            analysis.customers.add(customer);
        }
        
        // 日付分析
        const dateStr = columns[2]?.replace(/"/g, '')?.trim();
        if (dateStr && dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                analysis.years.add(parts[0]);
                analysis.months.add(parts[1]);
            } else {
                analysis.invalidDates++;
            }
        }
        
        // 品名データ分析（品名1〜品名32）
        for (let itemIndex = 11; itemIndex < headers.length; itemIndex += 4) {
            if (headers[itemIndex]?.startsWith('品名')) {
                analysis.totalItems++;
                const itemValue = columns[itemIndex]?.replace(/"/g, '')?.trim();
                if (itemValue) {
                    analysis.itemsWithValues++;
                }
            }
        }
        
        // 空フィールド分析
        columns.forEach((value, index) => {
            if (!value?.replace(/"/g, '')?.trim()) {
                const headerName = headers[index] || `column_${index}`;
                analysis.emptyFields[headerName]++;
            }
        });
    }
    
    // 分析結果表示
    console.log(`- ユニークな請求書番号: ${analysis.invoiceNumbers.size}件`);
    console.log(`- ユニークな顧客: ${analysis.customers.size}社`);
    console.log(`- 対象年: ${Array.from(analysis.years).sort()}`);
    console.log(`- 対象月: ${Array.from(analysis.months).sort().map(m => m + '月').join(', ')}`);
    console.log(`- 無効な日付: ${analysis.invalidDates}件`);
    console.log(`- 品名項目総数: ${analysis.totalItems}`);
    console.log(`- 値が入っている品名: ${analysis.itemsWithValues}件`);
    console.log(`- 品名の利用率: ${((analysis.itemsWithValues / analysis.totalItems) * 100).toFixed(1)}%`);
    
    // 主要顧客TOP10
    console.log(`\n🏢 主要顧客（サンプル）:`);
    const customerList = Array.from(analysis.customers).slice(0, 10);
    customerList.forEach((customer, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}: ${customer}`);
    });
    
    // 空フィールド分析（TOP10）
    console.log(`\n❌ 空フィールド分析（TOP10）:`);
    const emptyFieldsRanked = Object.entries(analysis.emptyFields)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    emptyFieldsRanked.forEach(([field, count]) => {
        const percentage = ((count / (lines.length - 1)) * 100).toFixed(1);
        console.log(`${field}: ${count}件 (${percentage}%)`);
    });
    
    // 最新・最古データ
    const invoiceIds = Array.from(analysis.invoiceNumbers).sort();
    console.log(`\n📅 データ期間:`);
    console.log(`- 最古の請求書ID: ${invoiceIds[0]}`);
    console.log(`- 最新の請求書ID: ${invoiceIds[invoiceIds.length - 1]}`);
    
    console.log(`\n=== CSV分析完了 ===`);
    
    return {
        totalRows: lines.length - 1,
        totalColumns: headers.length,
        headers,
        analysis
    };
}

// スクリプト実行
if (require.main === module) {
    analyzeCSV();
}

module.exports = { analyzeCSV };