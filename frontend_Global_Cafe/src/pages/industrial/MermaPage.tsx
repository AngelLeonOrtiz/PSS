import { useState } from "react";
import { Recycle, Search, ArrowRight } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockMermas = [
  { id: "MR-2024-0001", proceso: "TR-2024-0001", tipo: "Cisco", peso: 854, destino: "Venta Local", estado: "pendiente" },
  { id: "MR-2024-0002", proceso: "TR-2024-0001", tipo: "Pasilla", peso: 244, destino: "Reproceso", estado: "asignado" },
  { id: "MR-2024-0003", proceso: "TR-2024-0002", tipo: "Cisco", peso: 1281, destino: "Venta Local", estado: "asignado" },
];

export default function MermaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Merma / Remanente" subtitle="Gestión de subproductos y reasignación" icon={Recycle} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">2,379</p><p className="text-sm text-neutral-600">Total Merma (kg)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">2,135</p><p className="text-sm text-neutral-600">Cisco (kg)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-neutral-600">244</p><p className="text-sm text-neutral-600">Pasilla (kg)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">1</p><p className="text-sm text-neutral-600">Pendiente Asignar</p></CardContent></Card>
      </div>

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar merma..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Merma</TableHead>
              <TableHead>Proceso</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead align="right">Peso (kg)</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead align="center">Estado</TableHead>
              <TableHead align="center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMermas.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium text-orange-700">{m.id}</TableCell>
                <TableCell>{m.proceso}</TableCell>
                <TableCell>{m.tipo}</TableCell>
                <TableCell align="right">{m.peso.toLocaleString()}</TableCell>
                <TableCell>{m.destino}</TableCell>
                <TableCell align="center"><StatusBadge status={m.estado === "asignado" ? "aprobado" : "pendiente"} /></TableCell>
                <TableCell align="center">
                  {m.estado === "pendiente" && (
                    <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)} rightIcon={<ArrowRight className="w-3 h-3" />}>Asignar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockMermas.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Asignar Destino" size="md">
        <form className="space-y-4">
          <Select label="Destino" placeholder="Seleccione destino" options={[{ value: "venta", label: "Venta Local" }, { value: "reproceso", label: "Reproceso" }, { value: "desecho", label: "Desecho" }]} />
          <Input label="Observaciones" placeholder="Notas adicionales..." />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Asignar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
