import { Truck, CheckCircle } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.despacho;
const mockCargas = [
  { id: "CG-2024-0001", orden: "OC-2024-0001", contenedor: "CONT-4521", sacosTotal: 410, sacosCargados: 280, estado: "en_proceso" },
  { id: "CG-2024-0002", orden: "OC-2024-0002", contenedor: "CONT-4522", sacosTotal: 486, sacosCargados: 486, estado: "completado" },
];

export default function CargaPage() {
  return (
    <div>
      <PageHeader title="Carga de Contenedor" subtitle="Proceso de carga" icon={Truck} iconBg={colors.bg} iconColor={colors.icon} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Carga en Proceso</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-xl">
              <div className="flex justify-between mb-4">
                <div><span className="text-lg font-bold text-green-800">CONT-4521</span><p className="text-sm text-green-600">Orden: OC-2024-0001</p></div>
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">En Carga</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1"><span>280 / 410 sacos</span><span className="font-semibold">68%</span></div>
                <div className="w-full bg-green-200 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: "68%" }} /></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Pausar</Button>
                <Button size="sm" variant="success" leftIcon={<CheckCircle className="w-4 h-4" />}>Finalizar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Estadísticas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-600">Contenedores hoy</span><span className="font-bold">2</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Sacos cargados</span><span className="font-bold">766</span></div>
          </CardContent>
        </Card>
      </div>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Orden</TableHead><TableHead>Contenedor</TableHead><TableHead align="center">Total</TableHead><TableHead align="center">Cargados</TableHead><TableHead align="center">Estado</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockCargas.map((c) => (<TableRow key={c.id}><TableCell className="font-medium text-green-700">{c.id}</TableCell><TableCell>{c.orden}</TableCell><TableCell>{c.contenedor}</TableCell><TableCell align="center">{c.sacosTotal}</TableCell><TableCell align="center">{c.sacosCargados}</TableCell><TableCell align="center"><StatusBadge status={c.estado as "en_proceso" | "completado"} /></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockCargas.length} />
      </Card>
    </div>
  );
}
