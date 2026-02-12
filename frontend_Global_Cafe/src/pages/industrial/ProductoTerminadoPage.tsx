import { useState } from "react";
import { PackageCheck, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Input } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockProductos = [
  { id: "PT-2024-0001", lote: "L-2024-0150", fecha: "2024-01-15", sacos: 410, peso: 25010, calidad: "Excelso EP", destino: "Exportación", ubicacion: "Bodega Oro A" },
  { id: "PT-2024-0002", lote: "L-2024-0148", fecha: "2024-01-14", sacos: 486, peso: 29646, calidad: "Supremo", destino: "Exportación", ubicacion: "Bodega Oro B" },
];

export default function ProductoTerminadoPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Producto Terminado" subtitle="Inventario de café oro exportable" icon={PackageCheck} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">896</p><p className="text-sm text-neutral-600">Sacos Disponibles</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">54.6t</p><p className="text-sm text-neutral-600">Toneladas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">2</p><p className="text-sm text-neutral-600">Lotes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">410</p><p className="text-sm text-neutral-600">Comprometidos</p></CardContent></Card>
      </div>

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar producto..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="right">Peso (kg)</TableHead>
              <TableHead>Calidad</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Ubicación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProductos.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-orange-700">{p.id}</TableCell>
                <TableCell>{p.lote}</TableCell>
                <TableCell>{p.fecha}</TableCell>
                <TableCell align="center">{p.sacos}</TableCell>
                <TableCell align="right">{p.peso.toLocaleString()}</TableCell>
                <TableCell>{p.calidad}</TableCell>
                <TableCell><Badge variant="success" size="sm">{p.destino}</Badge></TableCell>
                <TableCell>{p.ubicacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockProductos.length} />
      </Card>
    </div>
  );
}
