import { Scale, Save } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.ventas;
const mockPesajes = [
  { id: "PVL-2024-0001", orden: "OVL-2024-0001", producto: "Cisco", pesoOrden: 500, pesoReal: 502, fecha: "2024-01-16", estado: "completado" },
  { id: "PVL-2024-0002", orden: "OVL-2024-0002", producto: "Pasilla", pesoOrden: 200, pesoReal: 198, fecha: "2024-01-15", estado: "completado" },
];

export default function BasculaVentaPage() {
  return (
    <div>
      <PageHeader title="Báscula Venta Local" subtitle="Validación de peso para ventas" icon={Scale} iconBg={colors.bg} iconColor={colors.icon} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pesaje Actual</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select label="Seleccionar Orden" options={[{ value: "OVL-2024-0001", label: "OVL-2024-0001 - Cisco 500kg" }]} />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-neutral-50 rounded-xl"><p className="text-4xl font-bold text-neutral-900">500</p><p className="text-sm text-neutral-600 mt-1">Peso Orden (kg)</p></div>
              <div className="p-4 bg-neutral-50 rounded-xl"><p className="text-4xl font-bold text-neutral-900">502</p><p className="text-sm text-neutral-600 mt-1">Peso Real (kg)</p></div>
              <div className="p-4 bg-green-50 rounded-xl"><p className="text-4xl font-bold text-green-700">+2</p><p className="text-sm text-green-600 mt-1">Diferencia (kg)</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1">Capturar Peso</Button>
              <Button className="flex-1" leftIcon={<Save className="w-4 h-4" />}>Guardar</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Estadísticas Hoy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-600">Pesajes realizados</span><span className="font-bold">8</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Total despachado</span><span className="font-bold">2,450 kg</span></div>
          </CardContent>
        </Card>
      </div>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>ID Pesaje</TableHead><TableHead>Orden</TableHead><TableHead>Producto</TableHead><TableHead align="right">Peso Orden</TableHead><TableHead align="right">Peso Real</TableHead><TableHead>Fecha</TableHead><TableHead align="center">Estado</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockPesajes.map((p) => (<TableRow key={p.id}><TableCell className="font-medium text-red-700">{p.id}</TableCell><TableCell>{p.orden}</TableCell><TableCell>{p.producto}</TableCell><TableCell align="right">{p.pesoOrden} kg</TableCell><TableCell align="right">{p.pesoReal} kg</TableCell><TableCell>{p.fecha}</TableCell><TableCell align="center"><StatusBadge status="completado" /></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockPesajes.length} />
      </Card>
    </div>
  );
}
