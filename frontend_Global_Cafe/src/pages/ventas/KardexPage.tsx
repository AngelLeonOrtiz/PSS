import { useState } from "react";
import { BarChart3, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { Input } from "../../components/ui";
import Badge from "../../components/ui/Badge";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.ventas;
const mockKardex = [
  { id: "KX-001", producto: "Cisco", cosecha: "2024-A", entradas: 2135, salidas: 1500, stock: 635, unidad: "kg" },
  { id: "KX-002", producto: "Pasilla", cosecha: "2024-A", entradas: 850, salidas: 600, stock: 250, unidad: "kg" },
  { id: "KX-003", producto: "Café Segunda", cosecha: "2024-A", entradas: 500, salidas: 200, stock: 300, unidad: "kg" },
];

export default function KardexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <PageHeader title="Kardex Subproductos" subtitle="Control de inventario por cosecha" icon={BarChart3} iconBg={colors.bg} iconColor={colors.icon} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-red-600">3</p><p className="text-sm text-neutral-600">Productos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">3,485</p><p className="text-sm text-neutral-600">Total Entradas (kg)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">2,300</p><p className="text-sm text-neutral-600">Total Salidas (kg)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">1,185</p><p className="text-sm text-neutral-600">Stock Actual (kg)</p></CardContent></Card>
      </div>
      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar producto..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Producto</TableHead><TableHead>Cosecha</TableHead><TableHead align="right">Entradas</TableHead><TableHead align="right">Salidas</TableHead><TableHead align="right">Stock</TableHead><TableHead>Unidad</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockKardex.map((k) => (<TableRow key={k.id}><TableCell className="font-medium text-red-700">{k.id}</TableCell><TableCell><Badge variant="neutral" size="sm">{k.producto}</Badge></TableCell><TableCell>{k.cosecha}</TableCell><TableCell align="right" className="text-green-600">+{k.entradas.toLocaleString()}</TableCell><TableCell align="right" className="text-red-600">-{k.salidas.toLocaleString()}</TableCell><TableCell align="right" className="font-bold">{k.stock.toLocaleString()}</TableCell><TableCell>{k.unidad}</TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockKardex.length} />
      </Card>
    </div>
  );
}
