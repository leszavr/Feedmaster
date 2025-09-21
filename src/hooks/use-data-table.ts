
"use client";

import { useState, useMemo, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface UseDataTableProps<T> {
  data: T[];
  initialPageSize?: number;
}

export function useDataTable<T extends { id: any }>({
  data,
  initialPageSize = 10,
}: UseDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    totalPages: totalPages > 0 ? totalPages : 1,
    pageSize,
    setPageSize: handleSetPageSize,
    nextPage,
    previousPage,
    goToPage,
  };
}
