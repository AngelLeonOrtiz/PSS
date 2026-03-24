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
  id_sucursal?: number;
};

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  // Usamos <any> porque la respuesta del backend (access_token, user) 
  // es diferente a la interfaz LoginResponse del frontend por ahora.
  const { data } = await http.post<any>("/auth/login", payload);
  
  // Adaptamos la respuesta del backend al formato del frontend
  return {
    token: data.access_token,
    usuario: data.user.username,
    nombre: data.user.nombre,
    email: "", // El backend aún no envía email
    roles: data.user.roles, // El backend ya envía un array
    permisos: [], // Por defecto vacío
    id_sucursal: data.user.id_sucursal,
  };
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
