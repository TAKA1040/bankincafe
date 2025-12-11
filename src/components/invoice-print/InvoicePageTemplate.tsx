'use client';

import React from 'react';
import { InvoicePage, formatPageNumber } from '@/lib/invoice-pagination';

/**
 * 請求書ページテンプレート
 *
 * 設計:
 * - 1ページ目: ヘッダー + 作業内容 + (収まれば)フッター
 * - 2ページ目以降: 作業内容のみ + (最終ページのみ)フッター
 * - フッターは最終ページの最下部に固定
 * - 用紙全体を使う（作業内容エリアで余白調整）
 */

interface InvoicePageTemplateProps {
  page: InvoicePage;
  totalPages: number;
  // ヘッダー部分のレンダリング
  renderHeader?: () => React.ReactNode;
  // 作業内容テーブルのレンダリング
  renderLineItems: (items: InvoicePage['items']) => React.ReactNode;
  // フッター部分のレンダリング（合計・振込先・備考）
  renderFooter?: () => React.ReactNode;
  // カスタムスタイル
  className?: string;
}

export function InvoicePageTemplate({
  page,
  totalPages,
  renderHeader,
  renderLineItems,
  renderFooter,
  className = '',
}: InvoicePageTemplateProps) {
  return (
    <div
      className={`invoice-page ${className}`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '15mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        pageBreakAfter: page.isLastPage ? 'auto' : 'always',
        position: 'relative',
      }}
    >
      {/* 1ページ目のみヘッダー表示 */}
      {page.showHeader && renderHeader && (
        <div className="invoice-header" style={{ flexShrink: 0 }}>
          {renderHeader()}
        </div>
      )}

      {/* 作業内容エリア（余白で伸縮） */}
      <div
        className="invoice-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100px', // 内容が少なくても枠は維持
        }}
      >
        <div
          className="invoice-line-items"
          style={{
            flex: 1,
          }}
        >
          {renderLineItems(page.items)}
        </div>
      </div>

      {/* 最終ページのみフッター表示（最下部固定） */}
      {page.showFooter && renderFooter && (
        <div
          className="invoice-footer"
          style={{
            flexShrink: 0,
            marginTop: 'auto',
          }}
        >
          {renderFooter()}
        </div>
      )}

      {/* ページ番号（全ページ表示） */}
      <div
        className="invoice-page-number"
        style={{
          position: 'absolute',
          bottom: '10mm',
          right: '15mm',
          fontSize: '10px',
          color: '#666',
        }}
      >
        {formatPageNumber(page.pageNumber, totalPages)}
      </div>
    </div>
  );
}

/**
 * 複数ページをレンダリングするコンテナ
 */
interface InvoicePagesContainerProps {
  pages: InvoicePage[];
  renderHeader?: () => React.ReactNode;
  renderLineItems: (items: InvoicePage['items']) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  className?: string;
}

export function InvoicePagesContainer({
  pages,
  renderHeader,
  renderLineItems,
  renderFooter,
  className = '',
}: InvoicePagesContainerProps) {
  const totalPages = pages.length;

  return (
    <div className={`invoice-pages-container ${className}`}>
      {pages.map((page) => (
        <InvoicePageTemplate
          key={page.pageNumber}
          page={page}
          totalPages={totalPages}
          renderHeader={renderHeader}
          renderLineItems={renderLineItems}
          renderFooter={renderFooter}
        />
      ))}
    </div>
  );
}
