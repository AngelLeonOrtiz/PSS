import { useState } from "react";
import { FileSignature, Plus, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.comercial;

const mockContratos = [
  { id: "CV-2024-0001", cliente: "Starbucks Corp", fecha: "2024-01-10", cantidad: 5000, precio: 220, destino: "Seattle, USA", estado: "aprobado" },
  { id: "CV-2024-0002", cliente: "Nestle AG", fecha: "2024-01-12", cantidad: 8000, precio: 215, destino: "Vevey, Suiza", estado: "pendiente" },
  { id: "CV-2024-0003", cliente: "Lavazza SpA", fecha: "2024-01-08", cantidad: 3500, precio: 225, destino: "Turin, Italia", estado: "en_proceso" },
];

export default function ContratosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Contratos de Venta" subtitle="Gestión de contratos con clientes" icon={FileSignature} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nuevo Contrato", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar contrato..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="right">Cantidad (sacos)</TableHead>
              <TableHead align="right">Precio/saco</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContratos.filter(c => c.cliente.toLowerCase().includes(searchTerm.toLowerCase())).map((contrato) => (
              <TableRow key={contrato.id}>
                <TableCell className="font-medium text-purple-700">{contrato.id}</TableCell>
                <TableCell>{contrato.cliente}</TableCell>
                <TableCell>{contrato.fecha}</TableCell>
                <TableCell align="right">{contrato.cantidad.toLocaleString()}</TableCell>
                <TableCell align="right">${contrato.precio}</TableCell>
                <TableCell>{contrato.destino}</TableCell>
                <TableCell align="center"><StatusBadge status={contrato.estado as "pendiente" | "aprobado" | "en_proceso"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockContratos.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Contrato" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Cliente" placeholder="Seleccione cliente" options={[{ value: "1", label: "Starbucks Corp" }, { value: "2", label: "Nestle AG" }]} />
            <Input label="Cantidad (sacos)" type="number" placeholder="0" />
            <Input label="Precio por Saco ($)" type="number" placeholder="0.00" />
            <Input label="Fecha de Entrega" type="date" />
            <Input label="Puerto de Destino" placeholder="Nombre del puerto" />
            <Input label="País Destino" placeholder="País" />
          </div>
          <Input label="Términos Especiales" placeholder="Condiciones adicionales..." />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear Contrato</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
