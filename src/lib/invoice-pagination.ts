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
 * 2パスアプローチ:
 * 1. 総行数を計算して1ページに収まるか判定
 * 2. フッターの有無を考慮して分割
 */
export function paginateLineItems(
  groups: GroupedLineItem[],
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG
): InvoicePage[] {
  // 総行数を計算
  const totalRows = groups.reduce((sum, group) => sum + calculateGroupRowCount(group), 0);

  // 1ページに収まるか判定（フッターありで）
  const fitsInOnePage = totalRows <= config.page1MaxRows;

  // ページごとの最大行数を取得
  // - 1ページ完結: フッターあり → page1MaxRows
  // - 複数ページの1ページ目: フッターなし → page1MaxRows + FOOTER_ROWS
  // - 中間ページ: フッターなし → pageNMaxRows + FOOTER_ROWS
  // - 最終ページ: フッターあり → pageNMaxRows
  const getMaxRows = (pageNum: number, isLastPage: boolean) => {
    if (pageNum === 1) {
      // 1ページ目: フッターがあれば基準行数、なければ+FOOTER_ROWS
      return fitsInOnePage ? config.page1MaxRows : config.page1MaxRows + FOOTER_ROWS;
    } else {
      // 2ページ目以降: 最終ページならフッターあり、そうでなければなし
      return isLastPage ? config.pageNMaxRows : config.pageNMaxRows + FOOTER_ROWS;
    }
  };

  const pages: InvoicePage[] = [];
  let currentPageItems: GroupedLineItem[] = [];
  let currentRowCount = 0;
  let pageNumber = 1;
  let remainingGroups = [...groups];

  while (remainingGroups.length > 0) {
    const group = remainingGroups[0];
    const groupRowCount = calculateGroupRowCount(group);

    // 残りのグループの総行数を計算（これが最終ページかどうかの判定用）
    const remainingRows = remainingGroups.reduce((sum, g) => sum + calculateGroupRowCount(g), 0);

    // このグループを追加した後の行数
    const afterAddRowCount = currentRowCount + groupRowCount;

    // 現在のページが最終ページになるかどうか（残りの全データがこのページに収まるか）
    const wouldBeLastPage = remainingRows <= getMaxRows(pageNumber, true);
    const maxRows = getMaxRows(pageNumber, wouldBeLastPage);

    // このグループを追加すると溢れる場合
    if (afterAddRowCount > maxRows && currentPageItems.length > 0) {
      // 現在のページを確定
      pages.push({
        pageNumber,
        isFirstPage: pageNumber === 1,
        isLastPage: false,
        items: currentPageItems,
        showHeader: pageNumber === 1,
        showFooter: false,
      });
      pageNumber++;
      currentPageItems = [];
      currentRowCount = 0;
      continue; // 同じグループを再評価
    }

    // グループを現在のページに追加
    currentPageItems.push(group);
    currentRowCount += groupRowCount;
    remainingGroups.shift();

    // グループが1ページに収まらないほど大きい場合の警告
    if (groupRowCount > getMaxRows(pageNumber, true) + FOOTER_ROWS) {
      console.warn(`セットが大きすぎます: ${group.setName}, 行数: ${groupRowCount}`);
    }
  }

  // 最後のページを追加
  if (currentPageItems.length > 0) {
    pages.push({
      pageNumber,
      isFirstPage: pageNumber === 1,
      isLastPage: true,
      items: currentPageItems,
      showHeader: pageNumber === 1,
      showFooter: true,
    });
  }

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
