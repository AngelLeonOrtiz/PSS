import PageTemplate from "../../components/layout/PageTemplate";
import { moduleColors } from "../../config/colors.config";

type LabPreEmbarque = {
  id: number;
  codigo: string;
  muestra: string;
  contrato: string;
  humedad: number;
  scaa: number;
  taza: string;
  defectos: number;
  analista: string;
  fechaAnalisis: string;
  status: string;
};

const mockData: LabPreEmbarque[] = [
  { id: 1, codigo: "LPE-2025-0001", muestra: "MPE-2025-0001", contrato: "CV-2025-0001", humedad: 10.8, scaa: 84, taza: "Limpia, notas cítricas", defectos: 2, analista: "Q-Grader Pérez", fechaAnalisis: "2025-02-08", status: "aprobado" },
  { id: 2, codigo: "LPE-2025-0002", muestra: "MPE-2025-0002", contrato: "CV-2025-0002", humedad: 11.2, scaa: 82, taza: "Balanceada, chocolate", defectos: 3, analista: "Q-Grader López", fechaAnalisis: "2025-02-09", status: "pendiente" },
  { id: 3, codigo: "LPE-2025-0003", muestra: "MPE-2025-0003", contrato: "CV-2025-0003", humedad: 12.5, scaa: 78, taza: "Astringente", defectos: 8, analista: "Q-Grader Pérez", fechaAnalisis: "2025-02-07", status: "rechazado" },
];

const columns = [
  { key: "codigo", label: "Código" },
  { key: "muestra", label: "Muestra" },
  { key: "contrato", label: "Contrato" },
  { key: "humedad", label: "Humedad %", align: "right" as const },
  { key: "scaa", label: "SCAA", align: "right" as const },
  { key: "taza", label: "Perfil de Taza" },
  { key: "defectos", label: "Defectos", align: "right" as const },
  { key: "status", label: "Estado" },
];

const formFields = [
  { name: "muestra", label: "Muestra Pre-Embarque", type: "select" as const, required: true, options: [
    { value: "MPE-2025-0001", label: "MPE-2025-0001 - CV-2025-0001" },
    { value: "MPE-2025-0002", label: "MPE-2025-0002 - CV-2025-0002" },
  ]},
  { name: "fechaAnalisis", label: "Fecha de Análisis", type: "date" as const, required: true },
  { name: "humedad", label: "Humedad (%)", type: "number" as const, required: true },
  { name: "scaa", label: "Puntaje SCAA", type: "number" as const, required: true, placeholder: "0-100" },
  { name: "defectos", label: "Defectos Totales", type: "number" as const, required: true },
  { name: "analista", label: "Q-Grader", type: "select" as const, required: true, options: [
    { value: "1", label: "Q-Grader Pérez" },
    { value: "2", label: "Q-Grader López" },
  ]},
  { name: "perfilTaza", label: "Perfil de Taza", type: "textarea" as const, required: true, span: 2 as const, placeholder: "Describe las notas de cata" },
  { name: "decision", label: "Decisión", type: "select" as const, required: true, options: [
    { value: "aprobar", label: "Aprobar para embarque" },
    { value: "rechazar", label: "Rechazar - requiere ajuste" },
  ]},
  { name: "observaciones", label: "Observaciones", type: "textarea" as const, span: 2 as const },
];

export default function LabPreEmbarquePage() {
  return (
    <PageTemplate
      title="Laboratorio Pre-Embarque"
      subtitle="Análisis de calidad para exportación"
      moduleColor={moduleColors.comercial.border}
      columns={columns}
      data={mockData}
      formFields={formFields}
      entityName="Análisis"
    />
  );
}
