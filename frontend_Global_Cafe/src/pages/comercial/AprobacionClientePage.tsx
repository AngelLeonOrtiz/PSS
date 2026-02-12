import PageTemplate from "../../components/layout/PageTemplate";
import { moduleColors } from "../../config/colors.config";

type AprobacionCliente = {
  id: number;
  codigo: string;
  muestra: string;
  contrato: string;
  cliente: string;
  fechaEnvio: string;
  fechaRespuesta: string | null;
  resultado: string;
  comentarios: string;
  status: string;
};

const mockData: AprobacionCliente[] = [
  { id: 1, codigo: "AC-2025-0001", muestra: "MPE-2025-0001", contrato: "CV-2025-0001", cliente: "Starbucks Corp.", fechaEnvio: "2025-02-07", fechaRespuesta: "2025-02-12", resultado: "Aprobado", comentarios: "Perfil cumple especificaciones", status: "aprobado" },
  { id: 2, codigo: "AC-2025-0002", muestra: "MPE-2025-0002", contrato: "CV-2025-0002", cliente: "Nestlé S.A.", fechaEnvio: "2025-02-09", fechaRespuesta: null, resultado: "Pendiente", comentarios: "", status: "pendiente" },
  { id: 3, codigo: "AC-2025-0003", muestra: "MPE-2025-0003", contrato: "CV-2025-0003", cliente: "Lavazza SpA", fechaEnvio: "2025-02-03", fechaRespuesta: "2025-02-08", resultado: "Rechazado", comentarios: "Muy astringente, ajustar blend", status: "rechazado" },
];

const columns = [
  { key: "codigo", label: "Código" },
  { key: "muestra", label: "Muestra" },
  { key: "cliente", label: "Cliente" },
  { key: "fechaEnvio", label: "Fecha Envío" },
  { key: "fechaRespuesta", label: "Respuesta", render: (row: AprobacionCliente) => row.fechaRespuesta || "Esperando..." },
  { key: "resultado", label: "Resultado" },
  { key: "status", label: "Estado" },
];

const formFields = [
  { name: "muestra", label: "Muestra Enviada", type: "select" as const, required: true, options: [
    { value: "MPE-2025-0001", label: "MPE-2025-0001 - Starbucks" },
    { value: "MPE-2025-0002", label: "MPE-2025-0002 - Nestlé" },
  ]},
  { name: "fechaRespuesta", label: "Fecha de Respuesta", type: "date" as const, required: true },
  { name: "resultado", label: "Resultado", type: "select" as const, required: true, options: [
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
    { value: "aprobado_condiciones", label: "Aprobado con Condiciones" },
  ]},
  { name: "responsable", label: "Contacto Cliente", type: "text" as const, placeholder: "Nombre del contacto" },
  { name: "emailContacto", label: "Email Contacto", type: "text" as const, placeholder: "email@cliente.com" },
  { name: "comentarios", label: "Comentarios del Cliente", type: "textarea" as const, span: 2 as const, required: true },
  { name: "accionesRequeridas", label: "Acciones Requeridas", type: "textarea" as const, span: 2 as const, placeholder: "Si fue rechazado o aprobado con condiciones" },
];

export default function AprobacionClientePage() {
  return (
    <PageTemplate
      title="Aprobación Cliente"
      subtitle="Gestión de respuestas de clientes"
      moduleColor={moduleColors.comercial.border}
      columns={columns}
      data={mockData}
      formFields={formFields}
      entityName="Aprobación"
    />
  );
}
