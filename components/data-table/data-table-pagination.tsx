
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
  table: {
    pageSize: number;
    setPageSize: (size: number) => void;
    currentPage: number;
    totalPages: number;
    previousPage: () => void;
    nextPage: () => void;
  };
}

export function DataTablePagination({ table }: DataTablePaginationProps) {
  const t = useTranslations("Admin.dataTable");

  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{t('rowsPerPage')}</p>
        <Select
          value={`${table.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[120px] items-center justify-center text-sm font-medium">
          {t('page')} {table.currentPage} {t('of')} {table.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={table.currentPage === 1}
          >
            <span className="sr-only">{t('previous')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={table.currentPage === table.totalPages}
          >
            <span className="sr-only">{t('next')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
