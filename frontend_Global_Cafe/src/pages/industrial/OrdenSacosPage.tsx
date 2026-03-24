import { useState } from "react";
import { Package, Plus, Search, Calculator } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockOrdenes = [
  { id: "OS-2024-0001", lote: "L-2024-0150", fecha: "2024-01-15", sacosEntrada: 500, pesoEntrada: 30500, factor: 0.82, sacosEstimados: 410, estado: "pendiente" },
  { id: "OS-2024-0002", lote: "L-2024-0148", fecha: "2024-01-14", sacosEntrada: 600, pesoEntrada: 36600, factor: 0.81, sacosEstimados: 486, estado: "en_proceso" },
];

export default function OrdenSacosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Orden de Sacos" subtitle="Cálculo inverso de insumos" icon={Package} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva Orden", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input label="Sacos de Entrada" type="number" placeholder="0" />
            <Input label="Peso Total (kg)" type="number" placeholder="0" />
            <Input label="Factor de Rendimiento" type="number" placeholder="0.82" />
            <Button leftIcon={<Calculator className="w-4 h-4" />}>Calcular</Button>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Orden</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="center">Sacos Entrada</TableHead>
              <TableHead align="right">Peso Entrada</TableHead>
              <TableHead align="center">Factor</TableHead>
              <TableHead align="center">Sacos Estimados</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrdenes.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium text-orange-700">{o.id}</TableCell>
                <TableCell>{o.lote}</TableCell>
                <TableCell>{o.fecha}</TableCell>
                <TableCell align="center">{o.sacosEntrada}</TableCell>
                <TableCell align="right">{o.pesoEntrada.toLocaleString()} kg</TableCell>
                <TableCell align="center">{o.factor}</TableCell>
                <TableCell align="center" className="font-semibold">{o.sacosEstimados}</TableCell>
                <TableCell align="center"><StatusBadge status={o.estado as "pendiente" | "en_proceso"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockOrdenes.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Orden de Sacos" size="md">
        <form className="space-y-4">
          <Select label="Lote" placeholder="Seleccione lote" options={[{ value: "L-2024-0150", label: "L-2024-0150" }]} />
          <Input label="Sacos de Entrada" type="number" placeholder="0" />
          <Input label="Factor de Rendimiento" type="number" placeholder="0.82" />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear Orden</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
