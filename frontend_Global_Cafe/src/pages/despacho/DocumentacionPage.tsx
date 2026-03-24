import { useState } from "react";
import { FileStack, Download, Printer, Plus } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Modal, ModalFooter, Select, Input } from "../../components/ui";
import Badge from "../../components/ui/Badge";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.despacho;
const mockDocs = [
  { id: "DOC-2024-0001", contenedor: "CONT-4520", bl: "MAEU123456789", packing: "PL-0001", fecha: "2024-01-14", estado: "completo" },
  { id: "DOC-2024-0002", contenedor: "CONT-4521", bl: "Pendiente", packing: "PL-0002", fecha: "2024-01-16", estado: "parcial" },
];

export default function DocumentacionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <PageHeader title="Documentación Final" subtitle="BL, Packing List, Certificados" icon={FileStack} iconBg={colors.bg} iconColor={colors.icon} actions={[{ label: "Generar", onClick: () => setIsModalOpen(true), icon: Plus }]} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">45</p><p className="text-sm text-neutral-600">BL Emitidos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-blue-600">45</p><p className="text-sm text-neutral-600">Packing List</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-purple-600">45</p><p className="text-sm text-neutral-600">Certificados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">2</p><p className="text-sm text-neutral-600">Pendientes</p></CardContent></Card>
      </div>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Contenedor</TableHead><TableHead>BL</TableHead><TableHead>Packing</TableHead><TableHead>Fecha</TableHead><TableHead align="center">Estado</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockDocs.map((d) => (<TableRow key={d.id}><TableCell className="font-medium text-green-700">{d.id}</TableCell><TableCell>{d.contenedor}</TableCell><TableCell>{d.bl === "Pendiente" ? <Badge variant="warning" size="sm">Pendiente</Badge> : d.bl}</TableCell><TableCell>{d.packing}</TableCell><TableCell>{d.fecha}</TableCell><TableCell align="center"><StatusBadge status={d.estado === "completo" ? "completado" : "en_proceso"} /></TableCell><TableCell align="center"><div className="flex items-center justify-center gap-1"><button className="p-1.5 rounded-lg hover:bg-neutral-100"><Download className="w-4 h-4 text-neutral-600" /></button><button className="p-1.5 rounded-lg hover:bg-neutral-100"><Printer className="w-4 h-4 text-neutral-600" /></button></div></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockDocs.length} />
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generar Documentación" size="md">
        <form className="space-y-4">
          <Select label="Contenedor" options={[{ value: "CONT-4521", label: "CONT-4521" }]} />
          <Input label="Número de BL" placeholder="MAEU..." />
          <ModalFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Generar</Button></ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
