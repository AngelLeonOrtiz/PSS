import { useState, useEffect } from "react";
import { Shield, Plus, Edit, Loader2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter } from "../../components/ui";
import { getRolesApi, getPermissionsApi, getRoleByIdApi, createRoleApi, updateRoleApi, createPermissionApi, updatePermissionApi, deletePermissionApi, type Role, type PermissionGroup, type Permission } from "../../api/roles.api";
import toast from "react-hot-toast";

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionFormData, setPermissionFormData] = useState({
    codigo: "",
    modulo: "",
    accion: "",
    descripcion: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    permisos: [] as number[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        getRolesApi(),
        getPermissionsApi()
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar roles y permisos");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ codigo: "", nombre: "", descripcion: "", permisos: [] });
  };

  const handleEdit = async (role: Role) => {
    try {
      const fullRole = await getRoleByIdApi(role.id);
      setEditingId(fullRole.id);
      setFormData({
        codigo: fullRole.codigo,
        nombre: fullRole.nombre,
        descripcion: fullRole.descripcion || "",
        permisos: fullRole.permisosIds || [],
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error cargando detalle del rol:", error);
      toast.error("Error al cargar los detalles del rol");
    }
  };

  const handleTogglePermission = (id: number) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(id)
        ? prev.permisos.filter(p => p !== id)
        : [...prev.permisos, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRoleApi(editingId, formData);
        toast.success("Rol actualizado exitosamente");
      } else {
        await createRoleApi(formData);
        toast.success("Rol creado exitosamente");
      }
      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error("Error guardando rol:", error);
      toast.error(error.response?.data?.message || "Error al guardar el rol");
    }
  };

  const handleClosePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setEditingPermissionId(null);
    setPermissionFormData({ codigo: "", modulo: "", accion: "", descripcion: "" });
  };

  const handleEditPermission = (perm: Permission, modulo: string) => {
    setEditingPermissionId(perm.id);
    setPermissionFormData({
      codigo: perm.codigo,
      modulo: modulo,
      accion: perm.accion,
      descripcion: perm.descripcion || "",
    });
    setIsPermissionModalOpen(true);
  };

  const handleDeletePermission = async () => {
    if (!editingPermissionId) return;
    if (!window.confirm(`¿Está seguro de que desea eliminar este permiso? Esto podría afectar a los roles que lo tienen asignado.`)) return;
    try {
      await deletePermissionApi(editingPermissionId);
      toast.success("Permiso eliminado exitosamente");
      handleClosePermissionModal();
      loadData();
    } catch (error: any) {
      console.error("Error eliminando permiso:", error);
      toast.error(error.response?.data?.message || "Error al eliminar el permiso");
    }
  };

  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermissionId) {
        await updatePermissionApi(editingPermissionId, permissionFormData);
        toast.success("Permiso actualizado exitosamente");
      } else {
        await createPermissionApi(permissionFormData);
        toast.success("Permiso creado exitosamente");
      }
      handleClosePermissionModal();
      loadData(); // Refresca las listas
    } catch (error: any) {
      console.error("Error guardando permiso:", error);
      toast.error(error.response?.data?.message || "Error al guardar el permiso");
    }
  };

  return (
    <div>
      <PageHeader title="Roles y Permisos" subtitle="Configuración de accesos" icon={Shield} actions={[{ label: "Nuevo Rol", onClick: () => { setEditingId(null); setFormData({ codigo: "", nombre: "", descripcion: "", permisos: [] }); setIsModalOpen(true); }, icon: Plus }]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="px-4 pt-4"><CardTitle>Roles del Sistema</CardTitle></CardHeader>
            <Table>
              <TableHeader><TableRow><TableHead>Rol</TableHead><TableHead>Descripción</TableHead><TableHead align="center">Usuarios</TableHead><TableHead align="center">Permisos</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  // @ts-ignore
                  <TableRow><TableCell colSpan={5} align="center" className="py-8 text-neutral-500"><Loader2 className="w-6 h-6 animate-spin inline-block mr-2" /> Cargando roles...</TableCell></TableRow>
                ) : roles.length === 0 ? (
                  // @ts-ignore
                  <TableRow><TableCell colSpan={5} align="center" className="py-8 text-neutral-500">No se encontraron roles</TableCell></TableRow>
                ) : (
                  roles.map((r) => (<TableRow key={r.id}><TableCell className="font-medium">{r.nombre}</TableCell><TableCell className="text-neutral-600">{r.descripcion}</TableCell><TableCell align="center"><Badge variant="info" size="sm">{r.usuarios}</Badge></TableCell><TableCell align="center"><Badge variant="neutral" size="sm">{r.permisos}</Badge></TableCell><TableCell align="center"><button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg hover:bg-neutral-100" disabled={r.es_rol_sistema}><Edit className="w-4 h-4 text-neutral-600" /></button></TableCell></TableRow>))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Permisos por Módulo</CardTitle>
                <button type="button" onClick={() => setIsPermissionModalOpen(true)} className="p-1 hover:bg-neutral-100 rounded-md transition-colors" title="Nuevo Permiso"><Plus className="w-5 h-5 text-neutral-600" /></button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {permissions.map((m) => (
                <div key={m.modulo}>
                  <h4 className="font-medium text-sm text-neutral-900 mb-2">{m.modulo}</h4>
                  <div className="flex flex-wrap gap-1">
                    {m.permisos.map((p) => (<span key={p.id} title={p.descripcion} onClick={() => handleEditPermission(p, m.modulo)} className="cursor-pointer hover:opacity-80 transition-opacity"><Badge variant="neutral" size="sm">{p.accion}</Badge></span>))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Rol" : "Nuevo Rol"} size="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Código del Rol" placeholder="Ej: ROL_SUPERVISOR" value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})} required disabled={!!editingId} />
            <Input label="Nombre del Rol" placeholder="Ej: Supervisor de Calidad" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          </div>
          <Input label="Descripción" placeholder="Descripción del rol..." value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">Permisos</label>
            <div className="border rounded-xl p-4 max-h-60 overflow-y-auto space-y-3">
              {permissions.map((m) => (
                <div key={m.modulo}>
                  <h5 className="font-medium text-sm mb-1">{m.modulo}</h5>
                  <div className="flex flex-wrap gap-2">
                    {m.permisos.map((p) => (<label key={p.id} className="flex items-center gap-1.5 text-sm" title={p.descripcion}><input type="checkbox" className="rounded" checked={formData.permisos.includes(p.id)} onChange={() => handleTogglePermission(p.id)} />{p.accion}</label>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ModalFooter><Button variant="outline" type="button" onClick={handleCloseModal}>Cancelar</Button><Button type="submit">{editingId ? "Guardar Cambios" : "Crear Rol"}</Button></ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={isPermissionModalOpen} onClose={handleClosePermissionModal} title={editingPermissionId ? "Editar Permiso" : "Nuevo Permiso"} size="md">
        <form className="space-y-4" onSubmit={handlePermissionSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Módulo" placeholder="Ej: Recepción" value={permissionFormData.modulo} onChange={(e) => setPermissionFormData({...permissionFormData, modulo: e.target.value})} required />
            <Input label="Código" placeholder="Ej: VER_REMISIONES" value={permissionFormData.codigo} onChange={(e) => setPermissionFormData({...permissionFormData, codigo: e.target.value.toUpperCase().replace(/\s+/g, '_')})} required />
          </div>
          <Input label="Acción" placeholder="Ej: Ver remisiones" value={permissionFormData.accion} onChange={(e) => setPermissionFormData({...permissionFormData, accion: e.target.value})} required />
          <Input label="Descripción" placeholder="Descripción breve..." value={permissionFormData.descripcion} onChange={(e) => setPermissionFormData({...permissionFormData, descripcion: e.target.value})} />
          <ModalFooter>
            <div className="flex items-center justify-between w-full">
              <div>
                {editingPermissionId && (<button type="button" onClick={handleDeletePermission} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">Eliminar</button>)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={handleClosePermissionModal}>Cancelar</Button>
                <Button type="submit">{editingPermissionId ? "Guardar" : "Crear"}</Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
