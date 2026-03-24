import { useState } from "react";
import { Calendar, Plus, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockProgramas = [
  { id: "PP-2024-W03", semana: "Sem 3", fechaInicio: "2024-01-15", lotes: 5, sacosPlaneados: 2500, sacosCompletados: 1800, estado: "en_proceso" },
  { id: "PP-2024-W02", semana: "Sem 2", fechaInicio: "2024-01-08", lotes: 6, sacosPlaneados: 3000, sacosCompletados: 3000, estado: "completado" },
];

export default function ProgramaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Programa de Producción" subtitle="Planificación semanal de trilla" icon={Calendar} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nuevo Programa", onClick: () => setIsModalOpen(true), icon: Plus }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-orange-600">2,500</p><p className="text-sm text-neutral-600">Sacos Planeados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">1,800</p><p className="text-sm text-neutral-600">Completados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">72%</p><p className="text-sm text-neutral-600">Avance</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">5</p><p className="text-sm text-neutral-600">Lotes en Proceso</p></CardContent></Card>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Programa</TableHead>
              <TableHead>Semana</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead align="center">Lotes</TableHead>
              <TableHead align="center">Planeados</TableHead>
              <TableHead align="center">Completados</TableHead>
              <TableHead align="center">Avance</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProgramas.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-orange-700">{p.id}</TableCell>
                <TableCell>{p.semana}</TableCell>
                <TableCell>{p.fechaInicio}</TableCell>
                <TableCell align="center">{p.lotes}</TableCell>
                <TableCell align="center">{p.sacosPlaneados.toLocaleString()}</TableCell>
                <TableCell align="center">{p.sacosCompletados.toLocaleString()}</TableCell>
                <TableCell align="center">{Math.round((p.sacosCompletados/p.sacosPlaneados)*100)}%</TableCell>
                <TableCell align="center"><StatusBadge status={p.estado as "en_proceso" | "completado"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockProgramas.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Programa Semanal" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Semana" placeholder="Ej: Semana 4" />
            <Input label="Fecha Inicio" type="date" />
          </div>
          <Select label="Lotes a Incluir" placeholder="Seleccione lotes" options={[{ value: "L-2024-0150", label: "L-2024-0150" }]} />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Crear Programa</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
