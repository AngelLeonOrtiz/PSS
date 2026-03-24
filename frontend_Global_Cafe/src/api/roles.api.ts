import { http } from "./http";

export interface Permission {
  id: number;
  codigo: string;
  accion: string;
  descripcion?: string;
}

export interface PermissionGroup {
  modulo: string;
  permisos: Permission[];
}

export interface Role {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  usuarios: number;
  permisos: number;
  es_rol_sistema: boolean;
  permisosIds?: number[];
}

export interface CreateRoleRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  permisos?: number[];
}

export interface CreatePermissionRequest {
  codigo: string;
  modulo: string;
  accion: string;
  descripcion?: string;
}

export async function getRolesApi(): Promise<Role[]> {
  const { data } = await http.get<Role[]>("/roles");
  return data;
}

export async function getPermissionsApi(): Promise<PermissionGroup[]> {
  const { data } = await http.get<PermissionGroup[]>("/roles/permissions");
  return data;
}

export async function getRoleByIdApi(id: number): Promise<Role> {
  const { data } = await http.get<Role>(`/roles/${id}`);
  return data;
}

export async function createRoleApi(payload: CreateRoleRequest): Promise<Role> {
  const { data } = await http.post<Role>("/roles", payload);
  return data;
}

export async function updateRoleApi(id: number, payload: Partial<CreateRoleRequest>): Promise<Role> {
  const { data } = await http.patch<Role>(`/roles/${id}`, payload);
  return data;
}

export async function deleteRoleApi(id: number): Promise<void> {
  await http.patch(`/roles/${id}/status`);
}

export async function createPermissionApi(payload: CreatePermissionRequest): Promise<Permission> {
  const { data } = await http.post<Permission>("/roles/permissions", payload);
  return data;
}

export async function updatePermissionApi(id: number, payload: Partial<CreatePermissionRequest>): Promise<Permission> {
  const { data } = await http.patch<Permission>(`/roles/permissions/${id}`, payload);
  return data;
}

export async function deletePermissionApi(id: number): Promise<void> {
  await http.patch(`/roles/permissions/${id}/status`);
}
