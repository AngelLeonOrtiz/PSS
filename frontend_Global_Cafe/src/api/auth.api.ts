import { http } from "./http";

export type LoginRequest = {
  usuario: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  usuario: string;
  nombre: string;
  email: string;
  roles: string[];
  permisos: string[];
};

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function logoutApi(): Promise<void> {
  await http.post("/auth/logout");
}

export async function refreshTokenApi(): Promise<{ token: string }> {
  const { data } = await http.post<{ token: string }>("/auth/refresh");
  return data;
}

export async function cambiarClaveApi(payload: {
  claveActual: string;
  claveNueva: string;
}): Promise<void> {
  await http.post("/auth/cambiar-clave", payload);
}
