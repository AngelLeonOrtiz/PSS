import { useState, useEffect } from "react";
import { Users, Plus, Search, Edit, Trash2, Loader2, RotateCcw } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { Button, Input, Modal, ModalFooter, Select } from "../../components/ui";
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi, type User } from "../../api/users.api";
import { getRolesApi, type Role } from "../../api/roles.api";
import toast from "react-hot-toast";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [userToReactivate, setUserToReactivate] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    email: "",
    rol: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRolesApi();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      nombre: user.nombre,
      email: "", // El backend no devuelve email en findAll, lo dejamos vacío
      rol: user.rolCodigo || "",
      password: "", // Contraseña vacía al editar
      confirmPassword: ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      username: "",
      nombre: "",
      email: "",
      rol: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserApi(userToDelete.id);
      toast.success("Usuario desactivado exitosamente");
      loadUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error eliminando usuario:", error);
      toast.error(error.response?.data?.message || "Error al desactivar el usuario");
    }
  };

  const handleReactivate = (user: User) => {
    setUserToReactivate(user);
    setIsReactivateModalOpen(true);
  };

  const confirmReactivate = async () => {
    if (!userToReactivate) return;
    try {
      await updateUserApi(userToReactivate.id, { activo: true });
      toast.success("Usuario reactivado exitosamente");
      loadUsers();
      setIsReactivateModalOpen(false);
      setUserToReactivate(null);
    } catch (error) {
      console.error("Error reactivando usuario:", error);
      toast.error("Error al reactivar el usuario");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Si es crear, la contraseña es obligatoria
    if (!editingId && !formData.password) {
      toast.error("La contraseña es obligatoria para nuevos usuarios");
      return;
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, username, ...rest } = formData;
      
      // Mapeamos 'username' del formulario a 'usuario' que espera el backend
      const payload = { ...rest, usuario: username };
      
      if (editingId) {
        // Si la contraseña está vacía, la quitamos del payload para no sobrescribirla
        if (!payload.password) delete (payload as any).password;
        // @ts-ignore
        await updateUserApi(editingId, payload as any);
        toast.success("Usuario actualizado exitosamente");
      } else {
        await createUserApi(payload as any);
        toast.success("Usuario creado exitosamente");
      }
      
      handleCloseModal();
      loadUsers();
    } catch (error: any) {
      console.error("Error guardando usuario:", error);
      // Mostrar el mensaje del backend si existe (ej: "El usuario ya existe")
      toast.error(error.response?.data?.message || "Error al guardar el usuario");
    }
  };

  return (
    <div>
      <PageHeader title="Gestión de Usuarios" subtitle="Administración de usuarios del sistema" icon={Users} actions={[{ label: "Nuevo Usuario", onClick: () => { setEditingId(null); setIsModalOpen(true); }, icon: Plus }]} />
      <Card className="mb-6"><CardContent className="p-4"><Input placeholder="Buscar usuario..." leftIcon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></CardContent></Card>
      <Card padding="none">
        <Table>
          <TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead>Nombre</TableHead><TableHead>Rol</TableHead><TableHead align="center">Estado</TableHead><TableHead align="center">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (
              // @ts-ignore
              <TableRow><TableCell colSpan={5} align="center" className="py-8 text-neutral-500"><Loader2 className="w-6 h-6 animate-spin inline-block mr-2" /> Cargando usuarios...</TableCell></TableRow>
            ) : usuarios.length === 0 ? (
              // @ts-ignore
              <TableRow><TableCell colSpan={5} align="center" className="py-8 text-neutral-500">No se encontraron usuarios</TableCell></TableRow>
            ) : (
              usuarios.filter(u => u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>{u.nombre || "-"}</TableCell>
                  <TableCell><Badge variant="info" size="sm">{u.rol}</Badge></TableCell>
                  <TableCell align="center">
                    <Badge variant={u.estado ? "success" : "neutral"} size="sm">
                      {u.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      {u.estado ? (
                        <>
                          <button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg hover:bg-neutral-100"><Edit className="w-4 h-4 text-neutral-600" /></button>
                          <button onClick={() => handleDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </>
                      ) : (
                        <button onClick={() => handleReactivate(u)} className="p-1.5 rounded-lg hover:bg-green-50" title="Reactivar Usuario"><RotateCcw className="w-4 h-4 text-green-600" /></button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={usuarios.length} />
      </Card>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Usuario" : "Nuevo Usuario"} size="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Usuario" placeholder="nombre.apellido" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <Input label="Nombre Completo" placeholder="Nombre y apellido" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
            <Select 
              label="Rol" 
              options={[{ value: "", label: "Seleccione un rol" }, ...roles.map(r => ({ value: r.codigo, label: r.nombre }))]} 
              value={formData.rol} 
              onChange={(e) => setFormData({...formData, rol: e.target.value})} 
            />
            <Input label="Contraseña" type="password" placeholder={editingId ? "Dejar en blanco para mantener" : "••••••••"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingId} />
            <Input label="Confirmar Contraseña" type="password" placeholder={editingId ? "Dejar en blanco para mantener" : "••••••••"} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required={!editingId} />
          </div>
          <ModalFooter><Button variant="outline" onClick={handleCloseModal}>Cancelar</Button><Button type="submit">{editingId ? "Guardar Cambios" : "Crear Usuario"}</Button></ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Acción" size="sm">
        <div className="space-y-4">
          <p className="text-neutral-600">
            ¿Está seguro que desea desactivar al usuario <span className="font-bold text-neutral-900">{userToDelete?.username}</span>?
          </p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-red-600">Desactivar</Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal isOpen={isReactivateModalOpen} onClose={() => setIsReactivateModalOpen(false)} title="Confirmar Reactivación" size="sm">
        <div className="space-y-4">
          <p className="text-neutral-600">
            ¿Está seguro que desea reactivar al usuario <span className="font-bold text-neutral-900">{userToReactivate?.username}</span>?
          </p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsReactivateModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmReactivate} className="bg-green-600 hover:bg-green-700 text-white border-green-600">Reactivar</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
