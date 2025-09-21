
"use client";

import { useState, useMemo, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface DataTableColumn {
    id: string;
    label: string;
    canSort?: boolean;
}

interface UseDataTableProps<T> {
  data: T[];
  columns: DataTableColumn[];
  initialPageSize?: number;
}

export function useDataTable<T extends { id: any }>({ 
    data, 
    columns, 
    initialPageSize = 10 
}: UseDataTableProps<T>) {
  const [tableData, setTableData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const totalPages = Math.ceil(tableData.length / pageSize);

  const sortedData = useMemo(() => {
    if (!sortColumn) return tableData;

    const sorted = [...tableData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [tableData, sortColumn, sortDirection]);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (columnId: keyof T) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const previousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  const setData = useCallback((newData: T[]) => {
    setTableData(newData);
    setCurrentPage(1); // Reset to first page when data changes
  }, []);

  return {
    columns,
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    handleSort,
    nextPage,
    previousPage,
    goToPage,
    setData,
  };
}
