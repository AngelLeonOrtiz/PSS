import { useState } from "react";
import { Receipt, Search, Printer, Download } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Input, Modal, ModalFooter, Button } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.ventas;
const mockSalidas = [
  { id: "SVL-2024-0001", orden: "OVL-2024-0001", cliente: "Distribuidora Local SA", producto: "Cisco", peso: 502, total: 7530, fecha: "2024-01-16", estado: "completado" },
  { id: "SVL-2024-0002", orden: "OVL-2024-0002", cliente: "Café Regional", producto: "Pasilla", peso: 198, total: 3960, fecha: "2024-01-15", estado: "completado" },
];

export default function SalidaVentaPage() {
  const [selectedSalida, setSelectedSalida] = useState<typeof mockSalidas[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <PageHeader title="Salida Venta Local" subtitle="Registro de despachos locales" icon={Receipt} iconBg={colors.bg} iconColor={colors.icon} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">156</p><p className="text-sm text-neutral-600">Salidas (Mes)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-coffee-700">12,450</p><p className="text-sm text-neutral-600">Kg Despachados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">$186,750</p><p className="text-sm text-neutral-600">Valor Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">45</p><p className="text-sm text-neutral-600">Clientes</p></CardContent></Card>
      </div>
      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar salida..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>No. Salida</TableHead><TableHead>Orden</TableHead><TableHead>Cliente</TableHead><TableHead>Producto</TableHead><TableHead align="right">Peso (kg)</TableHead><TableHead align="right">Total ($)</TableHead><TableHead>Fecha</TableHead><TableHead align="center">Estado</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockSalidas.map((s) => (<TableRow key={s.id}><TableCell className="font-medium text-red-700">{s.id}</TableCell><TableCell>{s.orden}</TableCell><TableCell>{s.cliente}</TableCell><TableCell>{s.producto}</TableCell><TableCell align="right">{s.peso}</TableCell><TableCell align="right" className="font-semibold">${s.total.toLocaleString()}</TableCell><TableCell>{s.fecha}</TableCell><TableCell align="center"><StatusBadge status="completado" /></TableCell><TableCell align="center"><div className="flex items-center justify-center gap-1"><button className="p-1.5 rounded-lg hover:bg-neutral-100" onClick={() => setSelectedSalida(s)}><Receipt className="w-4 h-4 text-neutral-600" /></button><button className="p-1.5 rounded-lg hover:bg-neutral-100"><Printer className="w-4 h-4 text-neutral-600" /></button></div></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockSalidas.length} />
      </Card>
      <Modal isOpen={!!selectedSalida} onClose={() => setSelectedSalida(null)} title="Comprobante de Salida" size="md">
        {selectedSalida && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6">
              <div className="text-center mb-4"><h3 className="text-xl font-bold">COMPROBANTE DE SALIDA</h3><p className="text-red-700 font-semibold">{selectedSalida.id}</p></div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-neutral-500">Cliente:</span><br/><span className="font-medium">{selectedSalida.cliente}</span></div>
                <div><span className="text-neutral-500">Fecha:</span><br/><span className="font-medium">{selectedSalida.fecha}</span></div>
                <div><span className="text-neutral-500">Producto:</span><br/><span className="font-medium">{selectedSalida.producto}</span></div>
                <div><span className="text-neutral-500">Peso:</span><br/><span className="font-medium">{selectedSalida.peso} kg</span></div>
              </div>
              <div className="border-t border-neutral-200 mt-4 pt-4 text-lg flex justify-between"><span className="font-semibold">TOTAL:</span><span className="font-bold text-red-700">${selectedSalida.total.toLocaleString()}</span></div>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedSalida(null)}>Cerrar</Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>PDF</Button>
              <Button leftIcon={<Printer className="w-4 h-4" />}>Imprimir</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
