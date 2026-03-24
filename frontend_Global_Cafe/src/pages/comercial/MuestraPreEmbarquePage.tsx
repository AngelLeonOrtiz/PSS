import PageTemplate from "../../components/layout/PageTemplate";
import { moduleColors } from "../../config/colors.config";

type MuestraPreEmbarque = {
  id: number;
  codigo: string;
  contrato: string;
  cliente: string;
  tipoMuestra: string;
  pesoMuestra: number;
  fechaSolicitud: string;
  fechaEnvio: string | null;
  status: string;
};

const mockData: MuestraPreEmbarque[] = [
  { id: 1, codigo: "MPE-2025-0001", contrato: "CV-2025-0001", cliente: "Starbucks Corp.", tipoMuestra: "Aprobación", pesoMuestra: 500, fechaSolicitud: "2025-02-05", fechaEnvio: "2025-02-07", status: "en_proceso" },
  { id: 2, codigo: "MPE-2025-0002", contrato: "CV-2025-0002", cliente: "Nestlé S.A.", tipoMuestra: "Tipo", pesoMuestra: 350, fechaSolicitud: "2025-02-08", fechaEnvio: null, status: "pendiente" },
  { id: 3, codigo: "MPE-2025-0003", contrato: "CV-2025-0003", cliente: "Lavazza SpA", tipoMuestra: "Aprobación", pesoMuestra: 500, fechaSolicitud: "2025-02-01", fechaEnvio: "2025-02-03", status: "aprobado" },
];

const columns = [
  { key: "codigo", label: "Código" },
  { key: "contrato", label: "Contrato" },
  { key: "cliente", label: "Cliente" },
  { key: "tipoMuestra", label: "Tipo" },
  { key: "pesoMuestra", label: "Peso (g)", align: "right" as const },
  { key: "fechaSolicitud", label: "Solicitud" },
  { key: "fechaEnvio", label: "Envío", render: (row: MuestraPreEmbarque) => row.fechaEnvio || "—" },
  { key: "status", label: "Estado" },
];

const formFields = [
  { name: "contrato", label: "Contrato", type: "select" as const, required: true, options: [
    { value: "CV-2025-0001", label: "CV-2025-0001 - Starbucks" },
    { value: "CV-2025-0002", label: "CV-2025-0002 - Nestlé" },
    { value: "CV-2025-0003", label: "CV-2025-0003 - Lavazza" },
  ]},
  { name: "tipoMuestra", label: "Tipo de Muestra", type: "select" as const, required: true, options: [
    { value: "tipo", label: "Muestra Tipo" },
    { value: "aprobacion", label: "Muestra de Aprobación" },
    { value: "embarque", label: "Pre-Embarque" },
  ]},
  { name: "pesoMuestra", label: "Peso de Muestra (g)", type: "number" as const, required: true },
  { name: "fechaSolicitud", label: "Fecha de Solicitud", type: "date" as const, required: true },
  { name: "loteOrigen", label: "Lote de Origen", type: "select" as const, options: [
    { value: "L-2025-0001", label: "L-2025-0001" },
    { value: "L-2025-0002", label: "L-2025-0002" },
  ]},
  { name: "courier", label: "Courier", type: "select" as const, options: [
    { value: "dhl", label: "DHL" },
    { value: "fedex", label: "FedEx" },
    { value: "ups", label: "UPS" },
  ]},
  { name: "guia", label: "Número de Guía", type: "text" as const, placeholder: "Tracking number" },
  { name: "direccionEnvio", label: "Dirección de Envío", type: "text" as const },
  { name: "observaciones", label: "Observaciones", type: "textarea" as const, span: 2 as const },
];

export default function MuestraPreEmbarquePage() {
  return (
    <PageTemplate
      title="Muestra Pre-Embarque"
      subtitle="Solicitud y envío de muestras a clientes"
      moduleColor={moduleColors.comercial.border}
      columns={columns}
      data={mockData}
      formFields={formFields}
      entityName="Muestra"
    />
  );
}
