/**
 * 請求書ページ分割ロジック
 *
 * 設計:
 * - 1ページ目: ヘッダー + 作業内容 + (収まれば)フッター
 * - 2ページ目以降: 作業内容のみ + (最終ページのみ)フッター
 * - セットは途中で切らない
 */

// 行アイテムの型
export interface LineItem {
  id: string;
  lineNo: number;
  label: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  isSet: boolean;
  setName?: string;
  isFirstOfSet?: boolean;
  children?: LineItem[];
}

// グループ化された行アイテムの型
export interface GroupedLineItem {
  lineNo: number;
  isSet: boolean;
  setName?: string;
  items: {
    label: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    isFirstOfSet: boolean;
  }[];
}

// ページの型
export interface InvoicePage {
  pageNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: GroupedLineItem[];
  showHeader: boolean;
  showFooter: boolean;
}

// ページ分割設定
export interface PaginationConfig {
  // 1ページ目の作業内容エリアに入る最大行数
  page1MaxRows: number;
  // 2ページ目以降の作業内容エリアに入る最大行数
  pageNMaxRows: number;
  // 1行の高さ（px）
  rowHeight: number;
  // セット子行の高さ（px）
  childRowHeight: number;
}

// デフォルト設定（後で調整可能）
// ページ分割用の設定（データをこの行数で分割）
// page.tsx の MAX_DISPLAY_* と一致させること！
const FOOTER_ROWS = 6; // フッターが占める行数

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  // フッターありの場合の行数（基準）
  page1MaxRows: 18,    // 1ページ目（フッターあり）
  pageNMaxRows: 30,    // 2ページ目以降（フッターあり）
  rowHeight: 24,
  childRowHeight: 18,
};

/**
 * グループの行数を計算
 * セット親行は1行、子行は子の数だけカウント
 */
export function calculateGroupRowCount(group: GroupedLineItem): number {
  if (group.isSet) {
    // セット: 親行1 + 子行の数
    return group.items.length;
  }
  // 通常行: 1行
  return 1;
}

/**
 * グループリストをページに分割
 *
 * ルール:
 * - 1ページ目（フッターなし）: 24行まで
 * - 1ページ目（フッターあり＝最終）: 18行まで
 * - 2ページ目以降（フッターなし）: 36行まで
 * - 2ページ目以降（フッターあり＝最終）: 30行まで
 */
export function paginateLineItems(
  groups: GroupedLineItem[],
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG
): InvoicePage[] {
  // 行数設定
  const page1WithFooter = config.page1MaxRows;              // 18行
  const page1NoFooter = config.page1MaxRows + FOOTER_ROWS;  // 24行
  const pageNWithFooter = config.pageNMaxRows;              // 30行
  const pageNNoFooter = config.pageNMaxRows + FOOTER_ROWS;  // 36行

  // まずフッターなしの最大行数で仮分割
  const tempPages: GroupedLineItem[][] = [];
  let currentPageItems: GroupedLineItem[] = [];
  let currentRowCount = 0;
  let pageNumber = 1;

  for (const group of groups) {
    const groupRowCount = calculateGroupRowCount(group);
    const maxRows = pageNumber === 1 ? page1NoFooter : pageNNoFooter;

    if (currentRowCount + groupRowCount > maxRows && currentPageItems.length > 0) {
      tempPages.push(currentPageItems);
      pageNumber++;
      currentPageItems = [];
      currentRowCount = 0;
    }

    currentPageItems.push(group);
    currentRowCount += groupRowCount;
  }

  if (currentPageItems.length > 0) {
    tempPages.push(currentPageItems);
  }

  // 最終ページがフッターありの行数を超えていたら再分割
  if (tempPages.length > 0) {
    const lastPageIndex = tempPages.length - 1;
    const lastPageItems = tempPages[lastPageIndex];
    const lastPageRowCount = lastPageItems.reduce((sum, g) => sum + calculateGroupRowCount(g), 0);
    const lastPageMaxRows = lastPageIndex === 0 ? page1WithFooter : pageNWithFooter;

    // 最終ページが溢れている場合
    if (lastPageRowCount > lastPageMaxRows) {
      // 最終ページを再分割
      const newLastPage: GroupedLineItem[] = [];
      const overflow: GroupedLineItem[] = [];
      let count = 0;

      for (const group of lastPageItems) {
        const groupRowCount = calculateGroupRowCount(group);
        if (count + groupRowCount <= lastPageMaxRows) {
          newLastPage.push(group);
          count += groupRowCount;
        } else {
          overflow.push(group);
        }
      }

      tempPages[lastPageIndex] = newLastPage;
      if (overflow.length > 0) {
        tempPages.push(overflow);
      }
    }
  }

  // InvoicePage形式に変換
  const pages: InvoicePage[] = tempPages.map((items, index) => ({
    pageNumber: index + 1,
    isFirstPage: index === 0,
    isLastPage: index === tempPages.length - 1,
    items,
    showHeader: index === 0,
    showFooter: index === tempPages.length - 1,
  }));

  // ページがない場合は空のページを追加
  if (pages.length === 0) {
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      isLastPage: true,
      items: [],
      showHeader: true,
      showFooter: true,
    });
  }

  return pages;
}

/**
 * 総ページ数を取得
 */
export function getTotalPages(pages: InvoicePage[]): number {
  return pages.length;
}

/**
 * ページ番号文字列を生成 (例: "1/3")
 */
export function formatPageNumber(pageNumber: number, totalPages: number): string {
  return `${pageNumber}/${totalPages}`;
}
