import { useState } from "react";
import { FlaskConical, Plus, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockMuestras = [
  { id: "M-2024-0001", remision: "R-2024-0001", fecha: "2024-01-15", tipo: "Previo", humedad: "12.5%", defectos: "2%", estado: "pendiente" },
  { id: "M-2024-0002", remision: "R-2024-0002", fecha: "2024-01-15", tipo: "General", humedad: "11.8%", defectos: "1.5%", estado: "aprobado" },
  { id: "M-2024-0003", remision: "R-2024-0003", fecha: "2024-01-14", tipo: "Previo", humedad: "13.2%", defectos: "3%", estado: "rechazado" },
];

export default function MuestreoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Muestreo" subtitle="Toma de muestras previas y generales" icon={FlaskConical} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva Muestra", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por ID o remisión..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Muestra</TableHead>
              <TableHead>Remisión</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead align="center">Humedad</TableHead>
              <TableHead align="center">Defectos</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMuestras.filter(m => m.id.toLowerCase().includes(searchTerm.toLowerCase())).map((muestra) => (
              <TableRow key={muestra.id}>
                <TableCell className="font-medium text-coffee-700">{muestra.id}</TableCell>
                <TableCell>{muestra.remision}</TableCell>
                <TableCell>{muestra.fecha}</TableCell>
                <TableCell>{muestra.tipo}</TableCell>
                <TableCell align="center">{muestra.humedad}</TableCell>
                <TableCell align="center">{muestra.defectos}</TableCell>
                <TableCell align="center"><StatusBadge status={muestra.estado as "pendiente" | "aprobado" | "rechazado"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockMuestras.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Muestra" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Remisión" placeholder="Seleccione remisión" options={[{ value: "R-2024-0001", label: "R-2024-0001 - Finca El Paraíso" }]} />
            <Select label="Tipo de Muestra" placeholder="Seleccione tipo" options={[{ value: "previo", label: "Previo" }, { value: "general", label: "General" }]} />
            <Input label="Humedad (%)" type="number" placeholder="0.0" />
            <Input label="Defectos (%)" type="number" placeholder="0.0" />
            <Input label="Peso Muestra (g)" type="number" placeholder="0" />
            <Input label="Temperatura (°C)" type="number" placeholder="0" />
          </div>
          <Input label="Observaciones" placeholder="Notas del muestreo..." />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar Muestra</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
