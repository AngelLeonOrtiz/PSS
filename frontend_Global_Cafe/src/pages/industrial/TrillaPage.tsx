import { useState } from "react";
import { Factory, Play, Pause, Search } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockProcesos = [
  { id: "TR-2024-0001", orden: "OS-2024-0001", maquina: "Trilladora 1", inicio: "08:00", sacosEntrada: 100, sacosOro: 82, merma: 18, estado: "en_proceso" },
  { id: "TR-2024-0002", orden: "OS-2024-0002", maquina: "Trilladora 2", inicio: "07:30", sacosEntrada: 150, sacosOro: 123, merma: 27, estado: "completado" },
];

export default function TrillaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Proceso de Trilla" subtitle="Operación de maquinaria" icon={Factory} iconBg={colors.bg} iconColor={colors.icon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Control de Máquinas</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {["Trilladora 1", "Trilladora 2"].map((maq, idx) => (
                <div key={maq} className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{maq}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${idx === 0 ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
                      {idx === 0 ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 mb-3">
                    <div>Orden: {idx === 0 ? "OS-2024-0001" : "-"}</div>
                    <div>Avance: {idx === 0 ? "82 sacos" : "-"}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={idx === 0 ? "danger" : "success"} leftIcon={idx === 0 ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}>
                      {idx === 0 ? "Pausar" : "Iniciar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumen del Día</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-600">Sacos procesados</span><span className="font-bold">250</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Sacos de oro</span><span className="font-bold text-green-600">205</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Merma total</span><span className="font-bold text-amber-600">45</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Rendimiento</span><span className="font-bold text-coffee-700">82%</span></div>
          </CardContent>
        </Card>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Proceso</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Máquina</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead align="center">Entrada</TableHead>
              <TableHead align="center">Oro</TableHead>
              <TableHead align="center">Merma</TableHead>
              <TableHead align="center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProcesos.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-orange-700">{p.id}</TableCell>
                <TableCell>{p.orden}</TableCell>
                <TableCell>{p.maquina}</TableCell>
                <TableCell>{p.inicio}</TableCell>
                <TableCell align="center">{p.sacosEntrada}</TableCell>
                <TableCell align="center" className="text-green-600 font-semibold">{p.sacosOro}</TableCell>
                <TableCell align="center" className="text-amber-600">{p.merma}</TableCell>
                <TableCell align="center"><StatusBadge status={p.estado as "en_proceso" | "completado"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockProcesos.length} />
      </Card>
    </div>
  );
}
