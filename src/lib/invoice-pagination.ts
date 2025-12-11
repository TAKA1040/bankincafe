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
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  page1MaxRows: 15,    // 1ページ目はヘッダー・フッターがあるので少なめ
  pageNMaxRows: 25,    // 2ページ目以降はヘッダーなしで多め
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
 */
export function paginateLineItems(
  groups: GroupedLineItem[],
  config: PaginationConfig = DEFAULT_PAGINATION_CONFIG
): InvoicePage[] {
  const pages: InvoicePage[] = [];
  let currentPageItems: GroupedLineItem[] = [];
  let currentRowCount = 0;
  let pageNumber = 1;

  // 現在のページの最大行数を取得
  const getMaxRows = (pageNum: number) =>
    pageNum === 1 ? config.page1MaxRows : config.pageNMaxRows;

  for (const group of groups) {
    const groupRowCount = calculateGroupRowCount(group);
    const maxRows = getMaxRows(pageNumber);

    // このグループを追加すると溢れる場合
    if (currentRowCount + groupRowCount > maxRows) {
      // 現在のページを確定（まだアイテムがある場合）
      if (currentPageItems.length > 0) {
        pages.push({
          pageNumber,
          isFirstPage: pageNumber === 1,
          isLastPage: false, // 後で更新
          items: currentPageItems,
          showHeader: pageNumber === 1,
          showFooter: false, // 後で更新
        });
        pageNumber++;
        currentPageItems = [];
        currentRowCount = 0;
      }

      // グループが1ページに収まらないほど大きい場合の例外処理
      const newMaxRows = getMaxRows(pageNumber);
      if (groupRowCount > newMaxRows) {
        // セットを分割する（例外ケース）
        // TODO: 大きすぎるセットの分割ロジック
        console.warn(`セットが大きすぎます: ${group.setName}, 行数: ${groupRowCount}`);
      }
    }

    // グループを現在のページに追加
    currentPageItems.push(group);
    currentRowCount += groupRowCount;
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

  // 最後のページのisLastPageを更新
  if (pages.length > 0) {
    pages[pages.length - 1].isLastPage = true;
    pages[pages.length - 1].showFooter = true;
  }

  // 1ページのみの場合、フッターを表示
  if (pages.length === 1) {
    pages[0].showFooter = true;
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
