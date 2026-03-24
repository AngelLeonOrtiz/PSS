import { http } from "./http";

// ==========================================
// INTERFACES (Tipos de datos)
// ==========================================

export interface Cosecha {
  id_cosecha: number;
  cosecha: string;
  cosecha_actual: boolean;
  estado: boolean;
}

export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  rtn?: string;
  id_municipio: number;
  direccion?: string;
  telefono?: string;
  estado: boolean;
}

export interface Conductor {
  id_conductor: number;
  nombre: string;
  dni?: string;
  licencia?: string;
  id_municipio: number;
  id_transporte: number;
  telefono?: string;
  estado: boolean;
}

export interface PlacaCabezal {
  id_placa_cabezal: number;
  placa: string;
  estado: boolean;
}

export interface PlacaFurgon {
  id_placa_furgon: number;
  placa: string;
  estado: boolean;
}

export interface Departamento {
  id_departamento: number;
  nombre: string;
  estado: boolean;
}

export interface Municipio {
  id_municipio: number;
  nombre: string;
  id_departamento: number;
  estado: boolean;
  departamento?: Departamento; // El backend envía este objeto anidado
}

export interface Transporte {
  id_transporte: number;
  nombre: string;
  rtn?: string;
  id_municipio: number;
  direccion?: string;
  contacto?: string;
  telefono?: string;
  estado: boolean;
}

export interface Catador {
  id_catador: number;
  nombre: string;
  estado: boolean;
}

export interface Calidad {
  id_calidad: number;
  nombre: string;
  estado: boolean;
}

export interface Defecto {
  id_defecto: number;
  nombre: string;
  estado: boolean;
}

export interface Zaranda {
  id_zaranda: number;
  nombre: string;
  estado: boolean;
}

export interface Taza {
  id_tazas: number;
  nombre: string;
  estado: boolean;
}

// ==========================================
// FUNCIONES API
// ==========================================

export async function getCosechasApi(): Promise<Cosecha[]> {
  const { data } = await http.get<Cosecha[]>("/catalogs/cosechas");
  return data;
}

export async function createCosechaApi(payload: Omit<Cosecha, "id_cosecha" | "estado">): Promise<Cosecha> {
  const { data } = await http.post<Cosecha>("/catalogs/cosechas", payload);
  return data;
}

export async function updateCosechaApi(id: number, payload: Partial<Cosecha>): Promise<Cosecha> {
  const { data } = await http.patch<Cosecha>(`/catalogs/cosechas/${id}`, payload);
  return data;
}

export async function getProveedoresApi(): Promise<Proveedor[]> {
  const { data } = await http.get<Proveedor[]>("/catalogs/proveedores");
  return data;
}

export async function createProveedorApi(payload: Omit<Proveedor, "id_proveedor" | "estado">): Promise<Proveedor> {
  const { data } = await http.post<Proveedor>("/catalogs/proveedores", payload);
  return data;
}

export async function updateProveedorApi(id: number, payload: Partial<Proveedor>): Promise<Proveedor> {
  const { data } = await http.patch<Proveedor>(`/catalogs/proveedores/${id}`, payload);
  return data;
}

export async function getConductoresApi(): Promise<Conductor[]> {
  const { data } = await http.get<Conductor[]>("/catalogs/conductores");
  return data;
}

export async function createConductorApi(payload: Omit<Conductor, "id_conductor" | "estado">): Promise<Conductor> {
  const { data } = await http.post<Conductor>("/catalogs/conductores", payload);
  return data;
}

export async function updateConductorApi(id: number, payload: Partial<Conductor>): Promise<Conductor> {
  const { data } = await http.patch<Conductor>(`/catalogs/conductores/${id}`, payload);
  return data;
}

export async function getPlacasCabezalApi(): Promise<PlacaCabezal[]> {
  const { data } = await http.get<PlacaCabezal[]>("/catalogs/placas-cabezal");
  return data;
}

export async function createPlacaCabezalApi(payload: { placa: string }): Promise<PlacaCabezal> {
  const { data } = await http.post<PlacaCabezal>("/catalogs/placas-cabezal", payload);
  return data;
}

export async function updatePlacaCabezalApi(id: number, payload: Partial<PlacaCabezal>): Promise<PlacaCabezal> {
  const { data } = await http.patch<PlacaCabezal>(`/catalogs/placas-cabezal/${id}`, payload);
  return data;
}

export async function getPlacasFurgonApi(): Promise<PlacaFurgon[]> {
  const { data } = await http.get<PlacaFurgon[]>("/catalogs/placas-furgon");
  return data;
}

export async function createPlacaFurgonApi(payload: { placa: string }): Promise<PlacaFurgon> {
  const { data } = await http.post<PlacaFurgon>("/catalogs/placas-furgon", payload);
  return data;
}

export async function updatePlacaFurgonApi(id: number, payload: Partial<PlacaFurgon>): Promise<PlacaFurgon> {
  const { data } = await http.patch<PlacaFurgon>(`/catalogs/placas-furgon/${id}`, payload);
  return data;
}

export async function getMunicipiosApi(): Promise<Municipio[]> {
  const { data } = await http.get<Municipio[]>("/catalogs/municipios");
  return data;
}

export async function createMunicipioApi(payload: Omit<Municipio, "id_municipio" | "estado" | "departamento">): Promise<Municipio> {
  const { data } = await http.post<Municipio>("/catalogs/municipios", payload);
  return data;
}

export async function updateMunicipioApi(id: number, payload: Partial<Municipio>): Promise<Municipio> {
  const { data } = await http.patch<Municipio>(`/catalogs/municipios/${id}`, payload);
  return data;
}

export async function getDepartamentosApi(): Promise<Departamento[]> {
  const { data } = await http.get<Departamento[]>("/catalogs/departamentos");
  return data;
}

export async function createDepartamentoApi(payload: Omit<Departamento, "id_departamento" | "estado">): Promise<Departamento> {
  const { data } = await http.post<Departamento>("/catalogs/departamentos", payload);
  return data;
}

export async function updateDepartamentoApi(id: number, payload: Partial<Departamento>): Promise<Departamento> {
  const { data } = await http.patch<Departamento>(`/catalogs/departamentos/${id}`, payload);
  return data;
}

export async function getTransportesApi(): Promise<Transporte[]> {
  const { data } = await http.get<Transporte[]>("/catalogs/transportes");
  return data;
}

export async function createTransporteApi(payload: Omit<Transporte, "id_transporte" | "estado">): Promise<Transporte> {
  const { data } = await http.post<Transporte>("/catalogs/transportes", payload);
  return data;
}

export async function updateTransporteApi(id: number, payload: Partial<Transporte>): Promise<Transporte> {
  const { data } = await http.patch<Transporte>(`/catalogs/transportes/${id}`, payload);
  return data;
}

// ==========================================
// CATADORES
// ==========================================
export async function getCatadoresApi(): Promise<Catador[]> {
  const { data } = await http.get<Catador[]>("/catalogs/catadores");
  return data;
}

export async function createCatadorApi(payload: { nombre: string }): Promise<Catador> {
  const { data } = await http.post<Catador>("/catalogs/catadores", payload);
  return data;
}

export async function updateCatadorApi(id: number, payload: Partial<Catador>): Promise<Catador> {
  const { data } = await http.patch<Catador>(`/catalogs/catadores/${id}`, payload);
  return data;
}

export async function deleteCatadorApi(id: number): Promise<void> {
  await http.delete(`/catalogs/catadores/${id}`);
}

// ==========================================
// CALIDAD
// ==========================================
export async function getCalidadesApi(): Promise<Calidad[]> {
  const { data } = await http.get<Calidad[]>("/catalogs/calidades");
  return data;
}

export async function createCalidadApi(payload: { nombre: string }): Promise<Calidad> {
  const { data } = await http.post<Calidad>("/catalogs/calidades", payload);
  return data;
}

export async function updateCalidadApi(id: number, payload: Partial<Calidad>): Promise<Calidad> {
  const { data } = await http.patch<Calidad>(`/catalogs/calidades/${id}`, payload);
  return data;
}

export async function deleteCalidadApi(id: number): Promise<void> {
  await http.delete(`/catalogs/calidades/${id}`);
}

// ==========================================
// DEFECTOS
// ==========================================
export async function getDefectosApi(): Promise<Defecto[]> {
  const { data } = await http.get<Defecto[]>("/catalogs/defectos");
  return data;
}

export async function createDefectoApi(payload: { nombre: string }): Promise<Defecto> {
  const { data } = await http.post<Defecto>("/catalogs/defectos", payload);
  return data;
}

export async function updateDefectoApi(id: number, payload: Partial<Defecto>): Promise<Defecto> {
  const { data } = await http.patch<Defecto>(`/catalogs/defectos/${id}`, payload);
  return data;
}

export async function deleteDefectoApi(id: number): Promise<void> {
  await http.delete(`/catalogs/defectos/${id}`);
}

// ==========================================
// ZARANDAS
// ==========================================
export async function getZarandasApi(): Promise<Zaranda[]> {
  const { data } = await http.get<Zaranda[]>("/catalogs/zarandas");
  return data;
}

export async function createZarandaApi(payload: { nombre: string }): Promise<Zaranda> {
  const { data } = await http.post<Zaranda>("/catalogs/zarandas", payload);
  return data;
}

export async function updateZarandaApi(id: number, payload: Partial<Zaranda>): Promise<Zaranda> {
  const { data } = await http.patch<Zaranda>(`/catalogs/zarandas/${id}`, payload);
  return data;
}

export async function deleteZarandaApi(id: number): Promise<void> {
  await http.delete(`/catalogs/zarandas/${id}`);
}

// ==========================================
// TAZAS
// ==========================================
export async function getTazasApi(): Promise<Taza[]> {
  const { data } = await http.get<Taza[]>("/catalogs/tazas");
  return data;
}

export async function createTazaApi(payload: { nombre: string }): Promise<Taza> {
  const { data } = await http.post<Taza>("/catalogs/tazas", payload);
  return data;
}

export async function updateTazaApi(id: number, payload: Partial<Taza>): Promise<Taza> {
  const { data } = await http.patch<Taza>(`/catalogs/tazas/${id}`, payload);
  return data;
}

export async function deleteTazaApi(id: number): Promise<void> {
  await http.delete(`/catalogs/tazas/${id}`);
}