import { useState } from "react";
import { Shield, Plus, Edit } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";

const mockRoles = [
  { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema", usuarios: 2, permisos: 45 },
  { id: 2, nombre: "Operador Recepción", descripcion: "Gestión de ingresos y báscula", usuarios: 5, permisos: 12 },
  { id: 3, nombre: "Analista Laboratorio", descripcion: "Análisis y aprobación de muestras", usuarios: 3, permisos: 8 },
  { id: 4, nombre: "Supervisor Trilla", descripcion: "Control de proceso industrial", usuarios: 2, permisos: 15 },
  { id: 5, nombre: "Despachador", descripcion: "Gestión de embarques y documentos", usuarios: 4, permisos: 10 },
];

const mockPermisos = [
  { modulo: "Recepción", permisos: ["Ver remisiones", "Crear remisiones", "Editar remisiones", "Aprobar muestras"] },
  { modulo: "Comercial", permisos: ["Ver contratos", "Crear contratos", "Generar lotes", "Crear SI"] },
  { modulo: "Industrial", permisos: ["Ver programa", "Crear órdenes", "Registrar trilla", "Balance de masas"] },
  { modulo: "Despacho", permisos: ["Ver contenedores", "Asignar contenedores", "Cargar contenedores", "Generar documentos"] },
  { modulo: "Ventas", permisos: ["Ver kardex", "Crear órdenes venta", "Registrar salidas"] },
];

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <PageHeader title="Roles y Permisos" subtitle="Configuración de accesos" icon={Shield} actions={[{ label: "Nuevo Rol", onClick: () => setIsModalOpen(true), icon: Plus }]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="px-4 pt-4"><CardTitle>Roles del Sistema</CardTitle></CardHeader>
            <Table>
              <TableHeader><TableRow><TableHead>Rol</TableHead><TableHead>Descripción</TableHead><TableHead align="center">Usuarios</TableHead><TableHead align="center">Permisos</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {mockRoles.map((r) => (<TableRow key={r.id}><TableCell className="font-medium">{r.nombre}</TableCell><TableCell className="text-neutral-600">{r.descripcion}</TableCell><TableCell align="center"><Badge variant="info" size="sm">{r.usuarios}</Badge></TableCell><TableCell align="center"><Badge variant="neutral" size="sm">{r.permisos}</Badge></TableCell><TableCell align="center"><button className="p-1.5 rounded-lg hover:bg-neutral-100"><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell></TableRow>))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Permisos por Módulo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {mockPermisos.map((m) => (
                <div key={m.modulo}>
                  <h4 className="font-medium text-sm text-neutral-900 mb-2">{m.modulo}</h4>
                  <div className="flex flex-wrap gap-1">
                    {m.permisos.map((p) => (<Badge key={p} variant="neutral" size="sm">{p}</Badge>))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Rol" size="lg">
        <form className="space-y-4">
          <Input label="Nombre del Rol" placeholder="Ej: Supervisor de Calidad" />
          <Input label="Descripción" placeholder="Descripción del rol..." />
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">Permisos</label>
            <div className="border rounded-xl p-4 max-h-60 overflow-y-auto space-y-3">
              {mockPermisos.map((m) => (
                <div key={m.modulo}>
                  <h5 className="font-medium text-sm mb-1">{m.modulo}</h5>
                  <div className="flex flex-wrap gap-2">
                    {m.permisos.map((p) => (<label key={p} className="flex items-center gap-1.5 text-sm"><input type="checkbox" className="rounded" />{p}</label>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ModalFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Crear Rol</Button></ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
