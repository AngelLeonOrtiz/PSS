import { useState } from "react";
import { FileText, Search, Printer, Download } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockNotas = [
  { id: "NP-2024-0001", remision: "R-2024-0001", proveedor: "Finca El Paraíso", fecha: "2024-01-15", pesoNeto: 6700, precioQQ: 850, total: 126.65, estado: "liquidado" },
  { id: "NP-2024-0002", remision: "R-2024-0002", proveedor: "Cooperativa Café Alto", fecha: "2024-01-15", pesoNeto: 10300, precioQQ: 860, total: 196.83, estado: "pendiente" },
  { id: "NP-2024-0003", remision: "R-2024-0003", proveedor: "Hacienda Santa Rosa", fecha: "2024-01-14", pesoNeto: 8700, precioQQ: 855, total: 165.32, estado: "liquidado" },
];

export default function NotaPesoPage() {
  const [selectedNota, setSelectedNota] = useState<typeof mockNotas[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Nota de Peso" subtitle="Liquidación de entregas de café" icon={FileText} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">8</p>
            <p className="text-sm text-neutral-600">Pendientes de Liquidar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">$45,280</p>
            <p className="text-sm text-neutral-600">Liquidado Hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-coffee-700">156</p>
            <p className="text-sm text-neutral-600">Notas del Mes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar nota de peso..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Nota</TableHead>
              <TableHead>Remisión</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="right">Peso Neto (kg)</TableHead>
              <TableHead align="right">Precio/QQ</TableHead>
              <TableHead align="right">Total (QQ)</TableHead>
              <TableHead align="center">Estado</TableHead>
              <TableHead align="center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNotas.filter(n => n.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) || n.id.toLowerCase().includes(searchTerm.toLowerCase())).map((nota) => (
              <TableRow key={nota.id}>
                <TableCell className="font-medium text-coffee-700">{nota.id}</TableCell>
                <TableCell>{nota.remision}</TableCell>
                <TableCell>{nota.proveedor}</TableCell>
                <TableCell>{nota.fecha}</TableCell>
                <TableCell align="right">{nota.pesoNeto.toLocaleString()}</TableCell>
                <TableCell align="right">${nota.precioQQ}</TableCell>
                <TableCell align="right" className="font-semibold">{nota.total.toFixed(2)}</TableCell>
                <TableCell align="center"><StatusBadge status={nota.estado === "liquidado" ? "completado" : "pendiente"} /></TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-neutral-100" title="Ver detalle" onClick={() => setSelectedNota(nota)}>
                      <FileText className="w-4 h-4 text-neutral-600" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-neutral-100" title="Imprimir">
                      <Printer className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockNotas.length} />
      </Card>

      <Modal isOpen={!!selectedNota} onClose={() => setSelectedNota(null)} title="Nota de Peso" size="lg">
        {selectedNota && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-neutral-900">NOTA DE PESO</h3>
                <p className="text-coffee-700 font-semibold">{selectedNota.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-neutral-500">Proveedor:</span><br/><span className="font-medium">{selectedNota.proveedor}</span></div>
                <div><span className="text-neutral-500">Fecha:</span><br/><span className="font-medium">{selectedNota.fecha}</span></div>
                <div><span className="text-neutral-500">Remisión:</span><br/><span className="font-medium">{selectedNota.remision}</span></div>
                <div><span className="text-neutral-500">Peso Neto:</span><br/><span className="font-medium">{selectedNota.pesoNeto.toLocaleString()} kg</span></div>
              </div>
              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Precio por Quintal:</span>
                  <span className="font-medium">${selectedNota.precioQQ}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                  <span className="font-semibold">Total Quintales:</span>
                  <span className="font-bold text-coffee-700">{selectedNota.total.toFixed(2)} QQ</span>
                </div>
              </div>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedNota(null)}>Cerrar</Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Descargar PDF</Button>
              <Button leftIcon={<Printer className="w-4 h-4" />}>Imprimir</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
