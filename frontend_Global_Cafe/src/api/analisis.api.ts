import { http } from "./http";

export interface AnalisisDefectoDto { id_defecto: number; cantidad: number; }
export interface AnalisisZarandaDto { id_zaranda: number; cantidad: number; }
export interface AnalisisTazaDto { id_tazas: number; cantidad: number; }

export interface CreateAnalisisRequest {
  id_detalle_recepcion: number;
  tipo_analisis: string;
  id_catador: number;
  primer_rendimiento?: number;
  segundo_rendimiento?: number;
  humedad?: number;
  dano?: number;
  id_calidad?: number;
  observaciones?: string;
  defectos?: AnalisisDefectoDto[];
  zarandas?: AnalisisZarandaDto[];
  tazas?: AnalisisTazaDto[];
}

export async function createAnalisisApi(payload: CreateAnalisisRequest): Promise<any> {
  const { data } = await http.post("/analisis", payload);
  return data;
}

export async function getAnalisisPendientesApi(): Promise<any[]> {
  const { data } = await http.get("/analisis/pendientes");
  return data;
}
export interface VeredictoGerenciaRequest {
  veredicto: "APROBAR" | "SEGUNDA_MUESTRA" | "DEVOLUCION";
  observaciones?: string;
}

export const veredictoGerenciaApi = async (idAnalisis: number, data: VeredictoGerenciaRequest) => {
  const response = await http.patch(`/analisis/${idAnalisis}/veredicto`, data);
  return response.data;
};
