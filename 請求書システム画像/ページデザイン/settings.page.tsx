import React from 'react';
import { Users, Settings, FileText, Search, Home } from 'lucide-react';

// 各種設定ページ
function SettingsPage({ navigateTo = null }) {
  // navigateToが提供されていない場合のデフォルト処理
  const handleNavigation = (screen) => {
    if (navigateTo) {
      navigateTo(screen);
    } else {
      alert(`${screen}画面への移動が要求されました（実装時にルーティング処理が必要）`);
    }
  };

  const settingsItems = [
    { 
      id: 'customer-management', 
      title: '顧客管理', 
      desc: '顧客情報の登録・編集', 
      color: 'bg-cyan-400',
      icon: Users,
      implemented: true
    },
    { 
      id: 'dictionary', 
      title: '辞書登録・編集', 
      desc: '作業内容辞書の管理', 
      color: 'bg-cyan-400',
      icon: FileText,
      implemented: false
    },
    { 
      id: 'company-settings', 
      title: '会社情報設定', 
      desc: '自社情報の登録・編集', 
      color: 'bg-cyan-400',
      icon: Settings,
      implemented: false
    },
    { 
      id: 'work-search', 
      title: '作業内容履歴', 
      desc: '過去の作業価格などの確認', 
      color: 'bg-cyan-400',
      icon: Search,
      implemented: true
    }
  ];

  const handleItemClick = (item) => {
    if (item.implemented) {
      if (item.id === 'customer-management') {
        handleNavigation('customer-management');
      } else if (item.id === 'work-search') {
        handleNavigation('work-search');
      }
    } else {
      alert('この機能は開発中です');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">各種設定</h1>
          <p className="text-gray-600">システムの各種設定を管理</p>
        </div>
        
        {/* 設定項目一覧 */}
        <div className="space-y-4">
          {settingsItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full ${item.color} text-white py-4 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md relative group`}
              >
                <div className="flex items-center">
                  <IconComponent className="h-6 w-6 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="text-xl font-bold">{item.title}</div>
                    <div className="text-sm mt-1 opacity-90">{item.desc}</div>
                  </div>
                  {!item.implemented && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        開発中
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ホームに戻るボタン */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => handleNavigation('menu')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            ホームに戻る
          </button>
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="border-t pt-4">
            <p>鈑金Cafe 請求書作成・売上管理システム</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用例とデモ
function SettingsPageDemo() {
  const [currentScreen, setCurrentScreen] = React.useState('settings');
  
  const navigateTo = (screen) => {
    console.log(`Navigate to: ${screen}`);
    setCurrentScreen(screen);
    // 実際のアプリケーションでは、ここでルーティング処理を行います
  };

  // デモ用の簡単な画面切り替え
  if (currentScreen === 'customer-management') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">顧客管理画面</h1>
          <p className="text-gray-600 mb-4">ここに顧客管理機能が表示されます</p>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            設定に戻る
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'work-search') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">作業内容履歴画面</h1>
          <p className="text-gray-600 mb-4">ここに作業検索機能が表示されます</p>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            設定に戻る
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">メインメニュー</h1>
          <p className="text-gray-600 mb-4">ここにメインメニューが表示されます</p>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            設定画面を開く
          </button>
        </div>
      </div>
    );
  }

  return <SettingsPage navigateTo={navigateTo} />;
}

export default SettingsPageDemo;