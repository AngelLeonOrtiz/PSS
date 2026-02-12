import { useState } from "react";
import { Scale, Search, Save } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockPesajes = [
  { id: "PE-2024-0001", remision: "R-2024-0001", fecha: "2024-01-15", pesobruto: 15200, tara: 8500, pesoneto: 6700, sacos: 150, estado: "completado" },
  { id: "PE-2024-0002", remision: "R-2024-0002", fecha: "2024-01-15", pesobruto: 18500, tara: 8200, pesoneto: 10300, sacos: 200, estado: "pendiente" },
  { id: "PE-2024-0003", remision: "R-2024-0003", fecha: "2024-01-14", pesobruto: 16800, tara: 8100, pesoneto: 8700, sacos: 180, estado: "completado" },
];

export default function BasculaEntradaPage() {
  const [selectedPesaje, setSelectedPesaje] = useState<typeof mockPesajes[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Báscula de Entrada" subtitle="Pesaje inicial de vehículos" icon={Scale} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pesaje Actual</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-4xl font-bold text-neutral-900">0</p>
                <p className="text-sm text-neutral-600 mt-1">Peso Bruto (kg)</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-4xl font-bold text-neutral-900">0</p>
                <p className="text-sm text-neutral-600 mt-1">Tara (kg)</p>
              </div>
              <div className="p-4 bg-coffee-50 rounded-xl">
                <p className="text-4xl font-bold text-coffee-700">0</p>
                <p className="text-sm text-coffee-600 mt-1">Peso Neto (kg)</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1">Capturar Peso</Button>
              <Button className="flex-1" leftIcon={<Save className="w-4 h-4" />}>Guardar Pesaje</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Estadísticas Hoy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Vehículos pesados</span>
              <span className="font-bold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Total kg recibidos</span>
              <span className="font-bold">156,800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Promedio por vehículo</span>
              <span className="font-bold">6,533 kg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar por remisión..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pesaje</TableHead>
              <TableHead>Remisión</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="right">Peso Bruto</TableHead>
              <TableHead align="right">Tara</TableHead>
              <TableHead align="right">Peso Neto</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPesajes.filter(p => p.remision.toLowerCase().includes(searchTerm.toLowerCase())).map((pesaje) => (
              <TableRow key={pesaje.id} onClick={() => setSelectedPesaje(pesaje)}>
                <TableCell className="font-medium text-coffee-700">{pesaje.id}</TableCell>
                <TableCell>{pesaje.remision}</TableCell>
                <TableCell>{pesaje.fecha}</TableCell>
                <TableCell align="right">{pesaje.pesobruto.toLocaleString()} kg</TableCell>
                <TableCell align="right">{pesaje.tara.toLocaleString()} kg</TableCell>
                <TableCell align="right" className="font-semibold">{pesaje.pesoneto.toLocaleString()} kg</TableCell>
                <TableCell align="center">{pesaje.sacos}</TableCell>
                <TableCell align="center"><StatusBadge status={pesaje.estado as "pendiente" | "completado"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockPesajes.length} />
      </Card>

      <Modal isOpen={!!selectedPesaje} onClose={() => setSelectedPesaje(null)} title="Detalle de Pesaje">
        {selectedPesaje && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm"><span className="text-neutral-500">ID:</span> <span className="font-medium">{selectedPesaje.id}</span></div>
              <div className="text-sm"><span className="text-neutral-500">Remisión:</span> <span className="font-medium">{selectedPesaje.remision}</span></div>
              <div className="text-sm"><span className="text-neutral-500">Peso Bruto:</span> <span className="font-medium">{selectedPesaje.pesobruto.toLocaleString()} kg</span></div>
              <div className="text-sm"><span className="text-neutral-500">Tara:</span> <span className="font-medium">{selectedPesaje.tara.toLocaleString()} kg</span></div>
              <div className="text-sm col-span-2"><span className="text-neutral-500">Peso Neto:</span> <span className="font-bold text-coffee-700 text-lg">{selectedPesaje.pesoneto.toLocaleString()} kg</span></div>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedPesaje(null)}>Cerrar</Button>
              <Button>Imprimir Ticket</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
