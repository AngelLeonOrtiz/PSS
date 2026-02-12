import { useState } from "react";
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";

const mockUsuarios = [
  { id: 1, usuario: "admin", nombre: "Administrador", email: "admin@globalcafe.com", rol: "Administrador", estado: "activo" },
  { id: 2, usuario: "jperez", nombre: "Juan Pérez", email: "jperez@globalcafe.com", rol: "Operador Recepción", estado: "activo" },
  { id: 3, usuario: "mlopez", nombre: "María López", email: "mlopez@globalcafe.com", rol: "Analista Laboratorio", estado: "activo" },
  { id: 4, usuario: "cruiz", nombre: "Carlos Ruiz", email: "cruiz@globalcafe.com", rol: "Supervisor Trilla", estado: "inactivo" },
];

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <PageHeader title="Gestión de Usuarios" subtitle="Administración de usuarios del sistema" icon={Users} actions={[{ label: "Nuevo Usuario", onClick: () => setIsModalOpen(true), icon: Plus }]} />
      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar usuario..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Rol</TableHead><TableHead align="center">Estado</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockUsuarios.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (<TableRow key={u.id}><TableCell className="font-medium">{u.usuario}</TableCell><TableCell>{u.nombre}</TableCell><TableCell>{u.email}</TableCell><TableCell><Badge variant="info" size="sm">{u.rol}</Badge></TableCell><TableCell align="center"><Badge variant={u.estado === "activo" ? "success" : "neutral"} size="sm">{u.estado}</Badge></TableCell><TableCell align="center"><div className="flex items-center justify-center gap-1"><button className="p-1.5 rounded-lg hover:bg-neutral-100"><Edit className="w-4 h-4 text-neutral-600" /></button><button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-600" /></button></div></TableCell></TableRow>))}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={mockUsuarios.length} />
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Usuario" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Usuario" placeholder="nombre.usuario" />
            <Input label="Nombre Completo" placeholder="Nombre y apellido" />
            <Input label="Email" type="email" placeholder="correo@ejemplo.com" />
            <Select label="Rol" options={[{ value: "admin", label: "Administrador" }, { value: "operador", label: "Operador" }, { value: "supervisor", label: "Supervisor" }]} />
            <Input label="Contraseña" type="password" placeholder="••••••••" />
            <Input label="Confirmar Contraseña" type="password" placeholder="••••••••" />
          </div>
          <ModalFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Crear Usuario</Button></ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
