import React, { useState } from "react";
import { Plus, Search, Filter, Download, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button, Input, Modal, ModalFooter } from "../ui/index";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  TablePagination,
} from "../ui/Table";
import { StatusBadge } from "../ui/Badge";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  span?: 1 | 2; // col-span
};

type PageTemplateProps<T> = {
  title: string;
  subtitle?: string;
  moduleColor: string;
  columns: Column<T>[];
  data: T[];
  formFields: FormField[];
  entityName: string; // "Remisión", "Contrato", etc.
  showFilters?: boolean;
};

export default function PageTemplate<T extends { id: number | string; status?: string }>({
  title,
  subtitle,
  moduleColor,
  columns,
  data,
  formFields,
  entityName,
  showFilters = true,
}: PageTemplateProps<T>) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-8 rounded-full"
              style={{ backgroundColor: moduleColor }}
            />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
              {subtitle && <p className="text-neutral-600">{subtitle}</p>}
            </div>
          </div>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Nuevo {entityName}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card padding="sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                  Filtros
                </Button>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Exportar
                </Button>
                <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Actualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} align={col.align}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead align="center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableEmpty message={`No hay ${entityName.toLowerCase()}s registrados`} />
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} align={col.align}>
                      {col.render
                        ? col.render(row)
                        : col.key === "status"
                        ? <StatusBadge status={row.status as "pendiente" | "aprobado" | "rechazado" | "en_proceso" | "completado"} />
                        : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900">
                        Ver
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900">
                        Editar
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Nuevo ${entityName}`}
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div
                key={field.name}
                className={field.span === 2 ? "sm:col-span-2" : ""}
              >
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "select" ? (
                  <select className="w-full h-11 px-4 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500">
                    <option value="">Seleccione...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 resize-none"
                    rows={3}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full h-11 px-4 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </form>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>
            Guardar {entityName}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
