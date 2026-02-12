import { useState } from "react";
import { Database, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Input } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.comercial;

const mockInventario = [
  { id: "INV-PS-001", ubicacion: "Bodega A", calidad: "Excelso", sacos: 1200, peso: 73200, humedad: 11.5, origen: "Huila" },
  { id: "INV-PS-002", ubicacion: "Bodega A", calidad: "Supremo", sacos: 800, peso: 48800, humedad: 11.2, origen: "Nariño" },
  { id: "INV-PS-003", ubicacion: "Bodega B", calidad: "Excelso", sacos: 1500, peso: 91500, humedad: 11.8, origen: "Antioquia" },
];

export default function InventarioPergaminoPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const totalSacos = mockInventario.reduce((acc, i) => acc + i.sacos, 0);
  const totalPeso = mockInventario.reduce((acc, i) => acc + i.peso, 0);

  return (
    <div>
      <PageHeader title="Inventario Pergamino Seco" subtitle="Control de inventario de café pergamino" icon={Database} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-purple-700">{totalSacos.toLocaleString()}</p><p className="text-sm text-neutral-600">Total Sacos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-purple-700">{(totalPeso/1000).toFixed(1)}t</p><p className="text-sm text-neutral-600">Total Toneladas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">11.5%</p><p className="text-sm text-neutral-600">Humedad Promedio</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">3</p><p className="text-sm text-neutral-600">Orígenes</p></CardContent></Card>
      </div>

      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar en inventario..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Inventario</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Calidad</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="right">Peso (kg)</TableHead>
              <TableHead align="center">Humedad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventario.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium text-purple-700">{inv.id}</TableCell>
                <TableCell><Badge variant="info" size="sm">{inv.ubicacion}</Badge></TableCell>
                <TableCell>{inv.calidad}</TableCell>
                <TableCell>{inv.origen}</TableCell>
                <TableCell align="center">{inv.sacos.toLocaleString()}</TableCell>
                <TableCell align="right">{inv.peso.toLocaleString()}</TableCell>
                <TableCell align="center">{inv.humedad}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockInventario.length} />
      </Card>
    </div>
  );
}
