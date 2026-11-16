export type PaginateOptions = {
  hasPhotoOrSecondLine?: boolean;
  minRowHeight?: number;
  maxRowHeight?: number;
};

export type PaginationPlan = {
  pagesCount: number;
  pageSizes: number[];
  pageItemSlices: { start: number; end: number; count: number }[];
  rowHeight: number;
  rowsThatFit: number;
  minRowHeight: number;
  maxRowHeight: number;
};

/**
 * Pure function implementing the page-filling and balancing algorithm (PRD 4.2).
 * Spreads items evenly so page sizes differ by at most 1, avoiding last-page orphan items (<3).
 * Returns consistent rowHeight for all pages in the category, stretching up to maxRowHeight.
 */
export function calculatePagination(
  totalItems: number,
  containerHeight: number,
  options?: PaginateOptions
): PaginationPlan {
  if (totalItems <= 0) {
    return {
      pagesCount: 1,
      pageSizes: [0],
      pageItemSlices: [{ start: 0, end: 0, count: 0 }],
      rowHeight: 48,
      rowsThatFit: 8,
      minRowHeight: 44,
      maxRowHeight: 64,
    };
  }

  const hasPhotoOrSecond = !!options?.hasPhotoOrSecondLine;
  const minRowHeight = options?.minRowHeight ?? (hasPhotoOrSecond ? 56 : 44);
  const maxRowHeight = options?.maxRowHeight ?? (hasPhotoOrSecond ? 72 : 64);

  // Available height for items (safe default 400px if containerHeight not yet measured)
  const h = containerHeight > 100 ? containerHeight : 420;

  // Rows that fit, clamped to 5-12
  const rowsThatFit = Math.max(5, Math.min(12, Math.floor(h / minRowHeight)));

  let pagesCount = Math.max(1, Math.ceil(totalItems / rowsThatFit));

  // If last page would have fewer than 3 items, adjust pagesCount if possible
  if (pagesCount > 1) {
    const baseItems = Math.floor(totalItems / pagesCount);
    if (baseItems < 3 && Math.floor(totalItems / 3) >= 1) {
      pagesCount = Math.max(1, Math.floor(totalItems / 3));
    }
  }

  // Balanced distribution: each page gets base or base + 1
  const baseCount = Math.floor(totalItems / pagesCount);
  const remainder = totalItems % pagesCount;

  const pageSizes: number[] = [];
  const pageItemSlices: { start: number; end: number; count: number }[] = [];
  let currentStart = 0;

  for (let i = 0; i < pagesCount; i++) {
    // First 'remainder' pages get baseCount + 1, rest get baseCount
    const count = i < remainder ? baseCount + 1 : baseCount;
    pageSizes.push(count);
    pageItemSlices.push({
      start: currentStart,
      end: currentStart + count,
      count,
    });
    currentStart += count;
  }

  // Row height is calculated from the fullest page so layout does not jump
  const maxPageSize = Math.max(...pageSizes);
  const rawRowHeight = maxPageSize > 0 ? h / maxPageSize : minRowHeight;
  const rowHeight = Math.min(maxRowHeight, Math.max(minRowHeight, Math.floor(rawRowHeight)));

  return {
    pagesCount,
    pageSizes,
    pageItemSlices,
    rowHeight,
    rowsThatFit,
    minRowHeight,
    maxRowHeight,
  };
}
