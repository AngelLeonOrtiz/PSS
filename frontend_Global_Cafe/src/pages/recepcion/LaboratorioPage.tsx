import { useState } from "react";
import { TestTube, Search, CheckCircle, XCircle } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockAnalisis = [
  { id: "AN-2024-0001", muestra: "M-2024-0001", fecha: "2024-01-15", humedad: 12.5, defectos: 2, taza: 84, color: "Verde azulado", estado: "pendiente" },
  { id: "AN-2024-0002", muestra: "M-2024-0002", fecha: "2024-01-15", humedad: 11.8, defectos: 1.5, taza: 86, color: "Verde", estado: "aprobado" },
  { id: "AN-2024-0003", muestra: "M-2024-0003", fecha: "2024-01-14", humedad: 13.2, defectos: 3, taza: 78, color: "Amarillento", estado: "rechazado" },
];

export default function LaboratorioPage() {
  const [selectedAnalisis, setSelectedAnalisis] = useState<typeof mockAnalisis[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Laboratorio" subtitle="Análisis y aprobación de muestras" icon={TestTube} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">5</p>
            <p className="text-sm text-neutral-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-sm text-neutral-600">Aprobados Hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">2</p>
            <p className="text-sm text-neutral-600">Rechazados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-coffee-700">84.5</p>
            <p className="text-sm text-neutral-600">Puntaje Promedio</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar análisis..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Análisis</TableHead>
              <TableHead>Muestra</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="center">Humedad %</TableHead>
              <TableHead align="center">Defectos %</TableHead>
              <TableHead align="center">Taza</TableHead>
              <TableHead>Color</TableHead>
              <TableHead align="center">Estado</TableHead>
              <TableHead align="center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAnalisis.filter(a => a.id.toLowerCase().includes(searchTerm.toLowerCase())).map((analisis) => (
              <TableRow key={analisis.id}>
                <TableCell className="font-medium text-coffee-700">{analisis.id}</TableCell>
                <TableCell>{analisis.muestra}</TableCell>
                <TableCell>{analisis.fecha}</TableCell>
                <TableCell align="center">{analisis.humedad}%</TableCell>
                <TableCell align="center">{analisis.defectos}%</TableCell>
                <TableCell align="center" className="font-semibold">{analisis.taza}</TableCell>
                <TableCell>{analisis.color}</TableCell>
                <TableCell align="center"><StatusBadge status={analisis.estado as "pendiente" | "aprobado" | "rechazado"} /></TableCell>
                <TableCell align="center">
                  {analisis.estado === "pendiente" && (
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Aprobar" onClick={() => setSelectedAnalisis(analisis)}>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Rechazar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockAnalisis.length} />
      </Card>

      <Modal isOpen={!!selectedAnalisis} onClose={() => setSelectedAnalisis(null)} title="Aprobar Análisis" size="md">
        {selectedAnalisis && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Resumen del Análisis</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-neutral-500">ID:</span> <span className="font-medium">{selectedAnalisis.id}</span></div>
                  <div><span className="text-neutral-500">Muestra:</span> <span className="font-medium">{selectedAnalisis.muestra}</span></div>
                  <div><span className="text-neutral-500">Humedad:</span> <span className="font-medium">{selectedAnalisis.humedad}%</span></div>
                  <div><span className="text-neutral-500">Defectos:</span> <span className="font-medium">{selectedAnalisis.defectos}%</span></div>
                  <div><span className="text-neutral-500">Puntaje Taza:</span> <span className="font-bold text-green-600">{selectedAnalisis.taza}</span></div>
                  <div><span className="text-neutral-500">Color:</span> <span className="font-medium">{selectedAnalisis.color}</span></div>
                </div>
              </CardContent>
            </Card>
            <Input label="Observaciones de aprobación" placeholder="Comentarios adicionales..." />
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedAnalisis(null)}>Cancelar</Button>
              <Button variant="success">Confirmar Aprobación</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
