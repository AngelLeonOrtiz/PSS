import { useState } from "react";
import { Warehouse, Search, MapPin, Package } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import Badge from "../../components/ui/Badge";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.recepcion;

const mockUbicaciones = [
  { id: "UB-A01", sector: "A", fila: "01", capacidad: 500, ocupado: 350, lotes: 3 },
  { id: "UB-A02", sector: "A", fila: "02", capacidad: 500, ocupado: 500, lotes: 4 },
  { id: "UB-B01", sector: "B", fila: "01", capacidad: 600, ocupado: 200, lotes: 2 },
  { id: "UB-B02", sector: "B", fila: "02", capacidad: 600, ocupado: 0, lotes: 0 },
];

const mockInventario = [
  { id: "INV-0001", ubicacion: "UB-A01", remision: "R-2024-0001", proveedor: "Finca El Paraíso", sacos: 150, peso: 6700, fechaIngreso: "2024-01-15" },
  { id: "INV-0002", ubicacion: "UB-A01", remision: "R-2024-0002", proveedor: "Cooperativa Café Alto", sacos: 200, peso: 9000, fechaIngreso: "2024-01-15" },
  { id: "INV-0003", ubicacion: "UB-A02", remision: "R-2024-0003", proveedor: "Hacienda Santa Rosa", sacos: 180, peso: 8100, fechaIngreso: "2024-01-14" },
];

export default function WMSPatioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getOcupacionColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "danger";
    if (porcentaje >= 70) return "warning";
    if (porcentaje > 0) return "success";
    return "neutral";
  };

  return (
    <div>
      <PageHeader title="WMS Patio" subtitle="Gestión de almacenamiento de pergamino" icon={Warehouse} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Asignar Ubicación", onClick: () => setIsModalOpen(true), icon: MapPin }]} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockUbicaciones.map((ub) => {
          const porcentaje = Math.round((ub.ocupado / ub.capacidad) * 100);
          return (
            <Card key={ub.id} hover className="cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{ub.id}</span>
                  <Badge variant={getOcupacionColor(porcentaje)} size="sm">{porcentaje}%</Badge>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${porcentaje >= 90 ? "bg-red-500" : porcentaje >= 70 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${porcentaje}%` }} />
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{ub.ocupado} / {ub.capacidad} sacos</span>
                  <span>{ub.lotes} lotes</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input placeholder="Buscar en inventario..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <Card padding="none">
        <CardHeader className="px-4 pt-4"><CardTitle>Inventario en Patio</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Remisión</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead align="center">Sacos</TableHead>
              <TableHead align="right">Peso (kg)</TableHead>
              <TableHead>Fecha Ingreso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventario.filter(inv => inv.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) || inv.remision.toLowerCase().includes(searchTerm.toLowerCase())).map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium text-coffee-700">{inv.id}</TableCell>
                <TableCell><Badge variant="info" size="sm">{inv.ubicacion}</Badge></TableCell>
                <TableCell>{inv.remision}</TableCell>
                <TableCell>{inv.proveedor}</TableCell>
                <TableCell align="center">{inv.sacos}</TableCell>
                <TableCell align="right">{inv.peso.toLocaleString()}</TableCell>
                <TableCell>{inv.fechaIngreso}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockInventario.length} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Asignar Ubicación" size="md">
        <form className="space-y-4">
          <Select label="Remisión" placeholder="Seleccione remisión" options={[{ value: "R-2024-0004", label: "R-2024-0004 - Finca Los Alpes" }]} />
          <Select label="Ubicación Destino" placeholder="Seleccione ubicación" options={mockUbicaciones.filter(u => (u.ocupado / u.capacidad) < 1).map(u => ({ value: u.id, label: `${u.id} - Disponible: ${u.capacidad - u.ocupado} sacos` }))} />
          <Input label="Cantidad de Sacos" type="number" placeholder="0" />
          <Input label="Observaciones" placeholder="Notas adicionales..." />
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" leftIcon={<Package className="w-4 h-4" />}>Asignar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
