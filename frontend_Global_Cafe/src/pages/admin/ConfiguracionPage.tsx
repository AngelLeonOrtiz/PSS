import { Settings, Save } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button, Input, Select } from "../../components/ui";

export default function ConfiguracionPage() {
  return (
    <div>
      <PageHeader title="Configuración" subtitle="Parámetros del sistema" icon={Settings} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Información de la Empresa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Nombre de la Empresa" defaultValue="Global Café S.A." />
            <Input label="NIT / RUC" defaultValue="900.123.456-7" />
            <Input label="Dirección" defaultValue="Km 5 Vía al Puerto" />
            <Input label="Teléfono" defaultValue="+57 1 234 5678" />
            <Input label="Email" defaultValue="info@globalcafe.com" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Guardar Cambios</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Parámetros de Operación</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Factor de Rendimiento por Defecto" type="number" defaultValue="0.82" />
            <Input label="Tolerancia Báscula (%)" type="number" defaultValue="0.5" />
            <Input label="Humedad Máxima Aceptable (%)" type="number" defaultValue="12.5" />
            <Input label="Defectos Máximos (%)" type="number" defaultValue="5" />
            <Select label="Moneda Principal" options={[{ value: "USD", label: "Dólar (USD)" }, { value: "COP", label: "Peso Colombiano (COP)" }]} />
            <Button leftIcon={<Save className="w-4 h-4" />}>Guardar Cambios</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Configuración de Notificaciones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded" /><span>Notificar nuevas remisiones</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded" /><span>Notificar aprobaciones pendientes</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded" /><span>Notificar contenedores por despachar</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" className="rounded" /><span>Notificaciones por email</span></label>
            <Button leftIcon={<Save className="w-4 h-4" />}>Guardar Cambios</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Consecutivos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Prefijo Remisiones" defaultValue="R-2024-" />
            <Input label="Prefijo Lotes" defaultValue="L-2024-" />
            <Input label="Prefijo Contratos" defaultValue="CV-2024-" />
            <Input label="Prefijo Contenedores" defaultValue="CONT-" />
            <Button leftIcon={<Save className="w-4 h-4" />}>Guardar Cambios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
