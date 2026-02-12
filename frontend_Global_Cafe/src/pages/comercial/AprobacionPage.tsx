import { useState } from "react";
import { CheckCircle, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.comercial;

const mockAprobaciones = [
  { id: "AC-2024-0001", contrato: "CV-2024-0001", cliente: "Starbucks Corp", muestra: "MPE-2024-0001", fechaEnvio: "2024-01-16", estado: "pendiente" },
  { id: "AC-2024-0002", contrato: "CV-2024-0002", cliente: "Nestle AG", muestra: "MPE-2024-0002", fechaEnvio: "2024-01-14", estado: "aprobado" },
  { id: "AC-2024-0003", contrato: "CV-2024-0003", cliente: "Lavazza SpA", muestra: "MPE-2024-0003", fechaEnvio: "2024-01-12", estado: "rechazado" },
];

export default function AprobacionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof mockAprobaciones[0] | null>(null);

  return (
    <div>
      <PageHeader title="Aprobación Cliente" subtitle="Gestión de aprobaciones de muestras" icon={CheckCircle} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">4</p><p className="text-sm text-neutral-600">Pendientes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">18</p><p className="text-sm text-neutral-600">Aprobados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-red-600">2</p><p className="text-sm text-neutral-600">Rechazados</p></CardContent></Card>
      </div>

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Muestra</TableHead>
              <TableHead>Fecha Envío</TableHead>
              <TableHead align="center">Estado</TableHead>
              <TableHead align="center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAprobaciones.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-purple-700">{a.id}</TableCell>
                <TableCell>{a.contrato}</TableCell>
                <TableCell>{a.cliente}</TableCell>
                <TableCell>{a.muestra}</TableCell>
                <TableCell>{a.fechaEnvio}</TableCell>
                <TableCell align="center"><StatusBadge status={a.estado as "pendiente" | "aprobado" | "rechazado"} /></TableCell>
                <TableCell align="center">
                  {a.estado === "pendiente" && (
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" onClick={() => setSelectedItem(a)}><ThumbsUp className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><ThumbsDown className="w-4 h-4" /></button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockAprobaciones.length} />
      </Card>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Registrar Aprobación">
        <div className="space-y-4">
          <Input label="Comentarios del Cliente" placeholder="Observaciones..." />
          <Input label="Fecha de Aprobación" type="date" />
          <ModalFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>Cancelar</Button>
            <Button variant="success">Registrar Aprobación</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
