import PageTemplate from "../../components/layout/PageTemplate";
import { moduleColors } from "../../config/colors.config";

type ProgramaProduccion = {
  id: number;
  codigo: string;
  semana: string;
  contrato: string;
  lotes: string;
  sacosAProcesar: number;
  fechaInicio: string;
  fechaFin: string;
  turno: string;
  status: string;
};

const mockData: ProgramaProduccion[] = [
  { id: 1, codigo: "PP-2025-W07", semana: "Semana 7", contrato: "CV-2025-0001", lotes: "L-2025-0001, L-2025-0002", sacosAProcesar: 500, fechaInicio: "2025-02-10", fechaFin: "2025-02-14", turno: "Diurno", status: "en_proceso" },
  { id: 2, codigo: "PP-2025-W07B", semana: "Semana 7", contrato: "CV-2025-0002", lotes: "L-2025-0003", sacosAProcesar: 400, fechaInicio: "2025-02-12", fechaFin: "2025-02-15", turno: "Nocturno", status: "pendiente" },
  { id: 3, codigo: "PP-2025-W06", semana: "Semana 6", contrato: "CV-2025-0003", lotes: "L-2025-0004", sacosAProcesar: 350, fechaInicio: "2025-02-03", fechaFin: "2025-02-07", turno: "Diurno", status: "completado" },
];

const columns = [
  { key: "codigo", label: "Programa" },
  { key: "semana", label: "Semana" },
  { key: "contrato", label: "Contrato" },
  { key: "lotes", label: "Lotes" },
  { key: "sacosAProcesar", label: "Sacos", align: "right" as const },
  { key: "fechaInicio", label: "Inicio" },
  { key: "fechaFin", label: "Fin" },
  { key: "status", label: "Estado" },
];

const formFields = [
  { name: "semana", label: "Semana", type: "select" as const, required: true, options: [
    { value: "W07", label: "Semana 7 (10-14 Feb)" },
    { value: "W08", label: "Semana 8 (17-21 Feb)" },
    { value: "W09", label: "Semana 9 (24-28 Feb)" },
  ]},
  { name: "contrato", label: "Contrato", type: "select" as const, required: true, options: [
    { value: "CV-2025-0001", label: "CV-2025-0001 - Starbucks" },
    { value: "CV-2025-0002", label: "CV-2025-0002 - Nestlé" },
  ]},
  { name: "lotes", label: "Lotes a Procesar", type: "select" as const, required: true, options: [
    { value: "L-2025-0001", label: "L-2025-0001 (250 sacos)" },
    { value: "L-2025-0002", label: "L-2025-0002 (250 sacos)" },
    { value: "L-2025-0003", label: "L-2025-0003 (400 sacos)" },
  ]},
  { name: "fechaInicio", label: "Fecha de Inicio", type: "date" as const, required: true },
  { name: "fechaFin", label: "Fecha de Fin", type: "date" as const, required: true },
  { name: "turno", label: "Turno", type: "select" as const, required: true, options: [
    { value: "diurno", label: "Diurno (6:00 - 18:00)" },
    { value: "nocturno", label: "Nocturno (18:00 - 6:00)" },
    { value: "completo", label: "24 Horas" },
  ]},
  { name: "maquina", label: "Línea de Trilla", type: "select" as const, required: true, options: [
    { value: "1", label: "Línea 1 - Pinhalense" },
    { value: "2", label: "Línea 2 - Penagos" },
  ]},
  { name: "supervisor", label: "Supervisor", type: "select" as const, required: true, options: [
    { value: "1", label: "Roberto Mejía" },
    { value: "2", label: "Sandra Castro" },
  ]},
  { name: "observaciones", label: "Observaciones", type: "textarea" as const, span: 2 as const },
];

export default function ProgramaProduccionPage() {
  return (
    <PageTemplate
      title="Programa de Producción"
      subtitle="Planificación semanal de trilla"
      moduleColor={moduleColors.industrial.border}
      columns={columns}
      data={mockData}
      formFields={formFields}
      entityName="Programa"
    />
  );
}
