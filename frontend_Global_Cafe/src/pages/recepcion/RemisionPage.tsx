import { useState } from "react";
import { ClipboardList, Plus, Search, Filter } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockRemisiones = [
  { id: "R-2024-0001", fecha: "2024-01-15", proveedor: "Finca El Paraíso", placa: "ABC-123", conductor: "Juan Pérez", sacos: 150, estado: "pendiente" },
  { id: "R-2024-0002", fecha: "2024-01-15", proveedor: "Cooperativa Café Alto", placa: "XYZ-789", conductor: "María López", sacos: 200, estado: "en_proceso" },
  { id: "R-2024-0003", fecha: "2024-01-14", proveedor: "Hacienda Santa Rosa", placa: "DEF-456", conductor: "Carlos Ruiz", sacos: 180, estado: "aprobado" },
  { id: "R-2024-0004", fecha: "2024-01-14", proveedor: "Finca Los Alpes", placa: "GHI-321", conductor: "Ana García", sacos: 120, estado: "rechazado" },
];

export default function RemisionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Ingreso de Remisión" subtitle="Registro de vehículos y café en portería" icon={ClipboardList} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva Remisión", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por ID, proveedor o placa..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filtros</Button>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Remisión</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRemisiones.length === 0 ? (
              <TableEmpty message="No hay remisiones registradas" />
            ) : (
              mockRemisiones.filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.proveedor.toLowerCase().includes(searchTerm.toLowerCase())).map((remision) => (
                <TableRow key={remision.id}>
                  <TableCell className="font-medium text-coffee-700">{remision.id}</TableCell>
                  <TableCell>{remision.fecha}</TableCell>
                  <TableCell>{remision.proveedor}</TableCell>
                  <TableCell>{remision.placa}</TableCell>
                  <TableCell>{remision.conductor}</TableCell>
                  <TableCell align="center">{remision.sacos}</TableCell>
                  <TableCell align="center"><StatusBadge status={remision.estado as "pendiente" | "en_proceso" | "aprobado" | "rechazado"} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={3} onPageChange={() => {}} totalItems={mockRemisiones.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Remisión" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Proveedor" placeholder="Seleccione proveedor" options={[{ value: "1", label: "Finca El Paraíso" }, { value: "2", label: "Cooperativa Café Alto" }]} />
            <Input label="Placa del Vehículo" placeholder="ABC-123" />
            <Input label="Nombre del Conductor" placeholder="Nombre completo" />
            <Input label="Cédula del Conductor" placeholder="0000-0000-00000" />
            <Input label="Cantidad de Sacos" type="number" placeholder="0" />
            <Input label="Peso Estimado (qq)" type="number" placeholder="0.00" />
          </div>
          <Input label="Observaciones" placeholder="Notas adicionales..." />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar Ingreso</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
