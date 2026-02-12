
import React, { createContext, useEffect, useMemo, useState } from "react";
import { loginApi, type LoginRequest, type LoginResponse } from "../api/auth.api";

type AuthContextValue = {
  token: string | null;
  profile: LoginResponse | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  hasPermission: (permiso: string) => boolean;
  hasRole: (rol: string) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );

  const [profile, setProfile] = useState<LoginResponse | null>(() => {
    const raw = localStorage.getItem("auth_profile");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [token]);

  useEffect(() => {
    if (profile) localStorage.setItem("auth_profile", JSON.stringify(profile));
    else localStorage.removeItem("auth_profile");
  }, [profile]);

  const login = async (payload: LoginRequest) => {
    const u = (payload.usuario ?? "").trim();
    const p = (payload.password ?? "").trim();

    // ✅ LOGIN TEMPORAL (hardcodeado)
    if (u === "admin" && p === "1234") {
      const fakeResp: LoginResponse = {
        token: "FAKE_TOKEN_ADMIN",
        usuario: "admin",
        nombre: "Administrador",
        roles: ["ADMIN"],
        permisos: ["*"], // o pon permisos reales
      } as LoginResponse;

      setToken(fakeResp.token);
      setProfile(fakeResp);
      return fakeResp;
    }

    // ✅ Si no es el usuario temporal, intenta con la API real
    const resp = await loginApi(payload);
    setToken(resp.token);
    setProfile(resp);
    return resp;
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
  };

  const hasPermission = (permiso: string): boolean => {
    // Si tienes permisos "*" entonces permite todo
    if (profile?.permisos?.includes("*")) return true;
    return profile?.permisos?.includes(permiso) ?? false;
  };

  const hasRole = (rol: string): boolean => {
    return profile?.roles?.includes(rol) ?? false;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      profile,
      isAuthenticated: !!token,
      login,
      logout,
      hasPermission,
      hasRole,
    }),
    [token, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}





// import React, { createContext, useEffect, useMemo, useState } from "react";
// import { loginApi, type LoginRequest, type LoginResponse } from "../api/auth.api";

// type AuthContextValue = {
//   token: string | null;
//   profile: LoginResponse | null;
//   isAuthenticated: boolean;
//   login: (payload: LoginRequest) => Promise<LoginResponse>;
//   logout: () => void;
//   hasPermission: (permiso: string) => boolean;
//   hasRole: (rol: string) => boolean;
// };

// export const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
//   const [profile, setProfile] = useState<LoginResponse | null>(() => {
//     const raw = localStorage.getItem("auth_profile");
//     return raw ? JSON.parse(raw) : null;
//   });

//   useEffect(() => {
//     if (token) localStorage.setItem("auth_token", token);
//     else localStorage.removeItem("auth_token");
//   }, [token]);

//   useEffect(() => {
//     if (profile) localStorage.setItem("auth_profile", JSON.stringify(profile));
//     else localStorage.removeItem("auth_profile");
//   }, [profile]);

//   const login = async (payload: LoginRequest) => {
//     const resp = await loginApi(payload);
//     setToken(resp.token);
//     setProfile(resp);
//     return resp;
//   };

//   const logout = () => {
//     setToken(null);
//     setProfile(null);
//   };

//   const hasPermission = (permiso: string): boolean => {
//     return profile?.permisos?.includes(permiso) ?? false;
//   };

//   const hasRole = (rol: string): boolean => {
//     return profile?.roles?.includes(rol) ?? false;
//   };

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       token,
//       profile,
//       isAuthenticated: !!token,
//       login,
//       logout,
//       hasPermission,
//       hasRole,
//     }),
//     [token, profile]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
