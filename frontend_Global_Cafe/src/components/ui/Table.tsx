import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Table Container
type TableProps = {
  children: React.ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-neutral-200 ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

// Table Header
export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-neutral-50 border-b border-neutral-200">{children}</thead>;
}

// Table Body
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-neutral-200">{children}</tbody>;
}

// Table Row
type TableRowProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function TableRow({ children, onClick, className = "" }: TableRowProps) {
  return (
    <tr
      className={`
        bg-white hover:bg-neutral-50 transition-colors
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// Table Head Cell
type TableHeadProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
};

export function TableHead({ children, className = "", align = "left" }: TableHeadProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      className={`
        px-4 py-3 font-semibold text-neutral-700 whitespace-nowrap
        ${alignClass[align]}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

// Table Data Cell
type TableCellProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
};

export function TableCell({ children, className = "", align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      className={`
        px-4 py-3 text-neutral-900
        ${alignClass[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

// Pagination Component
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
};

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-white">
      <div className="text-sm text-neutral-600">
        {totalItems !== undefined && (
          <span>
            Mostrando {startItem} a {endItem} de {totalItems} registros
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-3 py-1 text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Empty State
export function TableEmpty({ message = "No hay datos para mostrar" }: { message?: string }) {
  return (
    <tr>
      <td colSpan={100} className="px-4 py-12 text-center text-neutral-500">
        {message}
      </td>
    </tr>
  );
}
