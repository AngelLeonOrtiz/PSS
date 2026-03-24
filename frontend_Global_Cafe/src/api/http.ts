import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Adjunta token automáticamente
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Evitamos redirigir si el error viene del login (credenciales incorrectas)
    const isLogin = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_profile");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
