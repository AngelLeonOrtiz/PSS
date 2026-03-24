import { http } from "./http";

export interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  rolCodigo?: string;
  estado: boolean;
}

export interface CreateUserRequest {
  username: string;
  nombre: string;
  email?: string;
  rol: string;
  password?: string;
  activo?: boolean;
}

export async function getUsersApi(): Promise<User[]> {
  const { data } = await http.get<User[]>("/users");
  return data;
}

export async function createUserApi(payload: CreateUserRequest): Promise<User> {
  const { data } = await http.post<User>("/users", payload);
  return data;
}

export async function updateUserApi(id: number, payload: Partial<CreateUserRequest>): Promise<User> {
  const { data } = await http.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUserApi(id: number): Promise<void> {
  await http.patch(`/users/${id}/status`);
}