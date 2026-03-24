import { http } from "./http";

// ==========================================
// INTERFACES (Tipos de datos)
// ==========================================

export interface DetalleRecepcion {
  id_detalle_recepcion: number;
  id_recepcion: number;
  id_proveedor: number;
  id_estado_transaccion: number;
  cantidad_sacos: number;
  cantidad_qq: number; // Decimal en backend, puede llegar como string o number
  remision: string;
  fecha_entrada_bascula?: string;
  pesada_entrada?: number;
  fecha_salida_bascula?: string;
  pesada_salida?: number;
  id_bodega_descargada?: number;
  cantidad_sacos_descargados?: number;
  peso_bruto?: number;
  tara?: number;
  peso_neto?: number;
  estado: boolean;
  observaciones?: string;
  estado_transaccion?: {
    id_estado_transaccion: number;
    nombre: string;
  };
}

export interface Recepcion {
  id_recepcion: number;
  id_sucursal: number;
  id_cosecha: number;
  numero_entrada: string;
  fecha_entrada: string;
  tipo_vehiculo: string;
  id_placa_cabezal: number;
  id_placa_furgon?: number;
  id_conductor: number;
  id_municipio: number;
  marchamo?: string;
  estado: boolean;
  cantidad_impresiones: number;
  observaciones?: string;
  detalles: DetalleRecepcion[];
}

// Tipos para Crear / Editar (Payloads)
export interface CreateReceptionDetalleRequest {
  id_detalle_recepcion?: number; // Opcional, solo viene si estamos editando un detalle existente
  id_proveedor: number;
  // No enviamos id_estado_transaccion porque el backend lo asigna como "Pendiente de Muestrear"
  cantidad_sacos: number;
  cantidad_qq: number;
  remision: string;
  observaciones?: string;
}

export interface CreateReceptionRequest {
  id_sucursal?: number;
  id_cosecha: number;
  tipo_vehiculo: string;
  id_placa_cabezal: number;
  id_placa_furgon?: number;
  id_conductor: number;
  id_municipio: number;
  marchamo?: string;
  observaciones?: string;
  detalles: CreateReceptionDetalleRequest[];
}

// ==========================================
// FUNCIONES API
// ==========================================

export async function createReceptionApi(payload: CreateReceptionRequest): Promise<Recepcion> {
  const { data } = await http.post<Recepcion>("/reception", payload);
  return data;
}

export async function getReceptionsApi(): Promise<Recepcion[]> {
  const { data } = await http.get<Recepcion[]>("/reception");
  return data;
}

export async function updateReceptionApi(id: number, payload: Partial<CreateReceptionRequest>): Promise<Recepcion> {
  const { data } = await http.patch<Recepcion>(`/reception/${id}`, payload);
  return data;
}

export async function deleteReceptionApi(id: number): Promise<void> {
  await http.delete(`/reception/${id}`);
}

export async function registrarImpresionApi(id: number): Promise<void> {
  await http.patch(`/reception/${id}/print`);
}

export async function cambiarEstadoDetalleApi(id_detalle: number, estado: string): Promise<void> {
  await http.patch(`/reception/detalle/${id_detalle}/estado`, { estado });
}
