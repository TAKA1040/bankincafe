import React from 'react';
import { FileText, Eye, BarChart3, Search, Settings } from 'lucide-react';

function BankinMenuPage() {
  const menuItems = [
    { 
      id: 'create-invoice', 
      title: '請求書新規作成', 
      desc: '新しい請求書を作成する', 
      color: 'bg-cyan-400',
      icon: FileText
    },
    { 
      id: 'invoice-list', 
      title: '請求書一覧', 
      desc: '請求書の確認・編集', 
      color: 'bg-cyan-400',
      icon: Eye
    },
    { 
      id: 'sales-management', 
      title: '売上管理', 
      desc: '売上データの確認', 
      color: 'bg-cyan-400',
      icon: BarChart3
    },
    { 
      id: 'work-search', 
      title: '作業内容履歴', 
      desc: '過去の作業価格などの確認', 
      color: 'bg-cyan-400',
      icon: Search
    },
    { 
      id: 'settings', 
      title: '設定', 
      desc: '各種設定画面', 
      color: 'bg-cyan-400',
      icon: Settings
    }
  ];

  const handleMenuClick = (menuId) => {
    // メニュークリック時の処理
    console.log(`メニュー選択: ${menuId}`);
    alert(`「${menuItems.find(item => item.id === menuId)?.title}」が選択されました`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">請求書システム</h1>
          <p className="text-gray-600">鈑金Cafe - トラック専門鈑金塗装業</p>
        </div>
        
        {/* メニューボタン */}
        <div className="space-y-4">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full ${item.color} text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md group`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <IconComponent className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xl font-bold">{item.title}</div>
                    <div className="text-sm mt-1 opacity-90">{item.desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 鈑金Cafe - 請求書管理システム</p>
          <p className="mt-1">現場の声から生まれた実用的なツール</p>
        </div>
      </div>
    </div>
  );
}

export default BankinMenuPage;