import { useState } from "react";
import { Boxes, Plus, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.comercial;

const mockLotes = [
  { id: "L-2024-0150", contrato: "CV-2024-0001", fecha: "2024-01-15", sacos: 500, peso: 30500, calidad: "Excelso", estado: "aprobado" },
  { id: "L-2024-0151", contrato: "CV-2024-0002", fecha: "2024-01-16", sacos: 800, peso: 48800, calidad: "Supremo", estado: "en_proceso" },
];

export default function LotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Generación de Lotes" subtitle="Creación y gestión de lotes de café" icon={Boxes} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nuevo Lote", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar lote..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Lote</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="right">Peso (kg)</TableHead>
              <TableHead>Calidad</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLotes.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium text-purple-700">{l.id}</TableCell>
                <TableCell>{l.contrato}</TableCell>
                <TableCell>{l.fecha}</TableCell>
                <TableCell align="center">{l.sacos}</TableCell>
                <TableCell align="right">{l.peso.toLocaleString()}</TableCell>
                <TableCell>{l.calidad}</TableCell>
                <TableCell align="center"><StatusBadge status={l.estado as "aprobado" | "en_proceso"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockLotes.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generar Nuevo Lote" size="lg">
        <form className="space-y-4">
          <Select label="Contrato" placeholder="Seleccione contrato" options={[{ value: "CV-2024-0001", label: "CV-2024-0001 - Starbucks" }]} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cantidad de Sacos" type="number" placeholder="0" />
            <Select label="Calidad" placeholder="Seleccione" options={[{ value: "excelso", label: "Excelso" }, { value: "supremo", label: "Supremo" }]} />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Generar Lote</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
