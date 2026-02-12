import { Weight, CheckCircle, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { Button } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.despacho;
const mockPesajes = [
  { id: "PS-2024-0001", contenedor: "CONT-4521", esperado: 25010, real: 24980, diff: -30, estado: "ok" },
  { id: "PS-2024-0002", contenedor: "CONT-4522", esperado: 29646, real: 29500, diff: -146, estado: "error" },
];

export default function BasculaSalidaPage() {
  return (
    <div>
      <PageHeader title="Báscula de Salida" subtitle="Validación de peso" icon={Weight} iconBg={colors.bg} iconColor={colors.icon} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pesaje Actual</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-neutral-50 rounded-xl"><p className="text-4xl font-bold">25,010</p><p className="text-sm text-neutral-600">Esperado (kg)</p></div>
              <div className="p-4 bg-neutral-50 rounded-xl"><p className="text-4xl font-bold">24,980</p><p className="text-sm text-neutral-600">Real (kg)</p></div>
              <div className="p-4 bg-green-50 rounded-xl"><p className="text-4xl font-bold text-green-700">-30</p><p className="text-sm text-green-600">Diferencia</p></div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /><span className="text-green-700 font-medium">Dentro de tolerancia (±50 kg)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-600">Validados</span><span className="font-bold">5</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Correctos</span><span className="font-bold text-green-600">4</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Con diferencia</span><span className="font-bold text-red-600">1</span></div>
          </CardContent>
        </Card>
      </div>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Contenedor</TableHead><TableHead align="right">Esperado</TableHead><TableHead align="right">Real</TableHead><TableHead align="right">Diferencia</TableHead><TableHead align="center">Estado</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockPesajes.map((p) => (<TableRow key={p.id}><TableCell className="font-medium text-green-700">{p.id}</TableCell><TableCell>{p.contenedor}</TableCell><TableCell align="right">{p.esperado.toLocaleString()} kg</TableCell><TableCell align="right">{p.real.toLocaleString()} kg</TableCell><TableCell align="right" className={p.estado === "ok" ? "text-green-600" : "text-red-600"}>{p.diff} kg</TableCell><TableCell align="center">{p.estado === "ok" ? <span className="flex items-center justify-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> OK</span> : <span className="flex items-center justify-center gap-1 text-red-600"><AlertTriangle className="w-4 h-4" /> Revisar</span>}</TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockPesajes.length} />
      </Card>
    </div>
  );
}
