import { useState } from "react";
import { Ship, Plus, Search, FileText } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.comercial;

const mockSI = [
  { id: "SI-2024-0001", contrato: "CV-2024-0001", lote: "L-2024-0150", naviera: "Maersk", buque: "Emma Maersk", eta: "2024-02-01", estado: "aprobado" },
  { id: "SI-2024-0002", contrato: "CV-2024-0002", lote: "L-2024-0151", naviera: "MSC", buque: "MSC Oscar", eta: "2024-02-05", estado: "pendiente" },
];

export default function InstruccionesEmbarquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Instrucciones de Embarque" subtitle="Shipping Instructions (SI)" icon={Ship} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva SI", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar SI..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. SI</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Naviera</TableHead>
              <TableHead>Buque</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSI.map((si) => (
              <TableRow key={si.id}>
                <TableCell className="font-medium text-purple-700">{si.id}</TableCell>
                <TableCell>{si.contrato}</TableCell>
                <TableCell>{si.lote}</TableCell>
                <TableCell>{si.naviera}</TableCell>
                <TableCell>{si.buque}</TableCell>
                <TableCell>{si.eta}</TableCell>
                <TableCell align="center"><StatusBadge status={si.estado as "aprobado" | "pendiente"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockSI.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Instrucción de Embarque" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Contrato" placeholder="Seleccione" options={[{ value: "CV-2024-0001", label: "CV-2024-0001" }]} />
            <Select label="Lote" placeholder="Seleccione" options={[{ value: "L-2024-0150", label: "L-2024-0150" }]} />
            <Select label="Naviera" placeholder="Seleccione" options={[{ value: "maersk", label: "Maersk" }, { value: "msc", label: "MSC" }]} />
            <Input label="Nombre del Buque" placeholder="Nombre" />
            <Input label="Puerto de Embarque" placeholder="Puerto" />
            <Input label="Puerto de Destino" placeholder="Puerto" />
            <Input label="ETD" type="date" />
            <Input label="ETA" type="date" />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear SI</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
