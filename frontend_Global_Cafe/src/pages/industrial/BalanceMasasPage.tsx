import { useState } from "react";
import { Calculator, Search, Save } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import { Button, Input, Select } from "../../components/ui";
import { moduleColors } from "../../config/colors.config";

const colors = moduleColors.industrial;

const mockBalances = [
  { id: "BM-2024-0001", proceso: "TR-2024-0001", fecha: "2024-01-15", pesoEntrada: 6100, pesoOro: 5002, pesoCiscos: 854, pesoMerma: 244, rendimiento: 82.0 },
  { id: "BM-2024-0002", proceso: "TR-2024-0002", fecha: "2024-01-14", pesoEntrada: 9150, pesoOro: 7503, pesoCiscos: 1281, pesoMerma: 366, rendimiento: 82.0 },
];

export default function BalanceMasasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader title="Balance de Masas" subtitle="Registro y control de resultados" icon={Calculator} iconBg={colors.bg} iconColor={colors.icon} />

      <Card className="mb-6">
        <CardHeader><CardTitle>Registrar Balance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <Select label="Proceso de Trilla" placeholder="Seleccione" options={[{ value: "TR-2024-0001", label: "TR-2024-0001" }]} />
            <Input label="Peso Oro (kg)" type="number" placeholder="0" />
            <Input label="Peso Ciscos (kg)" type="number" placeholder="0" />
            <Input label="Peso Merma (kg)" type="number" placeholder="0" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Guardar Balance</Button>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Balance</TableHead>
              <TableHead>Proceso</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead align="right">Entrada (kg)</TableHead>
              <TableHead align="right">Oro (kg)</TableHead>
              <TableHead align="right">Ciscos (kg)</TableHead>
              <TableHead align="right">Merma (kg)</TableHead>
              <TableHead align="center">Rendimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBalances.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-orange-700">{b.id}</TableCell>
                <TableCell>{b.proceso}</TableCell>
                <TableCell>{b.fecha}</TableCell>
                <TableCell align="right">{b.pesoEntrada.toLocaleString()}</TableCell>
                <TableCell align="right" className="text-green-600 font-semibold">{b.pesoOro.toLocaleString()}</TableCell>
                <TableCell align="right">{b.pesoCiscos.toLocaleString()}</TableCell>
                <TableCell align="right" className="text-amber-600">{b.pesoMerma.toLocaleString()}</TableCell>
                <TableCell align="center" className="font-bold">{b.rendimiento}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockBalances.length} />
      </Card>
    </div>
  );
}
