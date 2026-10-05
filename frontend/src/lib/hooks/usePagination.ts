// Responsibility: Client-side pagination state management hook

import { useState, useMemo, useCallback } from "react";

export interface PaginationResult<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export const usePagination = <T>(
  items: T[] = [],
  initialPageSize: number = 10,
): PaginationResult<T> => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(Math.max(1, initialPageSize));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const setPageSafe = useCallback(
    (p: number) => setPage(Math.min(Math.max(1, p), totalPages)),
    [totalPages],
  );
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(Math.max(1, size));
    setPage(1);
  }, []);
  const nextPage = useCallback(() => setPageSafe(currentPage + 1), [currentPage, setPageSafe]);
  const prevPage = useCallback(() => setPageSafe(currentPage - 1), [currentPage, setPageSafe]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage: setPageSafe,
    setPageSize,
    nextPage,
    prevPage,
    canNext: currentPage < totalPages,
    canPrev: currentPage > 1,
  };
};
