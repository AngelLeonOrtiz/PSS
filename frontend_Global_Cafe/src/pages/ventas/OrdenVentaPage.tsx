import { useState } from "react";
import { ShoppingCart, Plus, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.ventas;
const mockOrdenes = [
  { id: "OVL-2024-0001", cliente: "Distribuidora Local SA", producto: "Cisco", cantidad: 500, precio: 15, total: 7500, fecha: "2024-01-16", estado: "pendiente" },
  { id: "OVL-2024-0002", cliente: "Café Regional", producto: "Pasilla", cantidad: 200, precio: 20, total: 4000, fecha: "2024-01-15", estado: "aprobado" },
];

export default function OrdenVentaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <PageHeader title="Orden de Venta Local" subtitle="Autorización de ventas locales" icon={ShoppingCart} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Nueva Orden", onClick: () => setIsModalOpen(true), icon: Plus }]} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">5</p><p className="text-sm text-neutral-600">Pendientes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">28</p><p className="text-sm text-neutral-600">Aprobadas (Mes)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">$45,800</p><p className="text-sm text-neutral-600">Valor Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-red-600">2</p><p className="text-sm text-neutral-600">Rechazadas</p></CardContent></Card>
      </div>
      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar orden..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>No. Orden</TableHead><TableHead>Cliente</TableHead><TableHead>Producto</TableHead><TableHead align="right">Cantidad (kg)</TableHead><TableHead align="right">Precio/kg</TableHead><TableHead align="right">Total</TableHead><TableHead>Fecha</TableHead><TableHead align="center">Estado</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockOrdenes.map((o) => (<TableRow key={o.id}><TableCell className="font-medium text-red-700">{o.id}</TableCell><TableCell>{o.cliente}</TableCell><TableCell>{o.producto}</TableCell><TableCell align="right">{o.cantidad}</TableCell><TableCell align="right">${o.precio}</TableCell><TableCell align="right" className="font-semibold">${o.total.toLocaleString()}</TableCell><TableCell>{o.fecha}</TableCell><TableCell align="center"><StatusBadge status={o.estado as "pendiente" | "aprobado"} /></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockOrdenes.length} />
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Orden de Venta" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cliente" placeholder="Nombre del cliente" />
            <Select label="Producto" options={[{ value: "cisco", label: "Cisco" }, { value: "pasilla", label: "Pasilla" }]} />
            <Input label="Cantidad (kg)" type="number" placeholder="0" />
            <Input label="Precio por kg ($)" type="number" placeholder="0.00" />
          </div>
          <Input label="Observaciones" placeholder="Notas adicionales..." />
          <ModalFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Crear Orden</Button></ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
