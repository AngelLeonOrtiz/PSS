import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Package, 
  Truck, 
  Factory,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { moduleColors } from "../../config/colors.config";
import { getResumenHoyApi } from "../../api/reception.api";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getResumenHoyApi();
        setData(res);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-coffee-600 mb-4" />
        <span className="text-lg font-medium text-neutral-600">Cargando métricas operativas...</span>
      </div>
    );
  }

  const stats = [
    { title: "Ingresos Hoy", value: data?.stats?.ingresosHoy || 0, change: "Vehículos", changeType: "neutral" as const, icon: Truck, module: "recepcion" },
    { title: "Sacos Declarados", value: data?.stats?.sacosHoy || 0, change: "Hoy", changeType: "neutral" as const, icon: Package, module: "recepcion" },
    { title: "Volumen Estimado", value: `${data?.stats?.qqHoy ? Number(data.stats.qqHoy).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "0.00"} QQ`, change: "Hoy", changeType: "neutral" as const, icon: TrendingUp, module: "recepcion" },
    { title: "Vehículos en Patio", value: data?.stats?.enProceso || 0, change: "En proceso", changeType: "positive" as const, icon: Clock, module: "recepcion" },
  ];

  // Filtramos para mostrar solo las tareas que tienen algo pendiente (cantidad > 0)
  const pendingTasks = [
    { id: 1, task: `${data?.pendientes?.muestreo || 0} vehículos esperando toma de muestra`, module: "recepcion", status: "pendiente", link: "/recepcion/remision" },
    { id: 2, task: `${data?.pendientes?.laboratorio || 0} muestras en laboratorio por analizar`, module: "recepcion", status: "en_proceso", link: "/recepcion/laboratorio" },
    { id: 3, task: `${data?.pendientes?.gerencia || 0} análisis esperando veredicto de gerencia`, module: "recepcion", status: "urgente", link: "/recepcion/gerencia" },
    { id: 4, task: `${data?.pendientes?.bascula || 0} equipo esperando pesaje en báscula`, module: "recepcion", status: "pendiente", link: "/recepcion/bascula-entrada" },
  ].filter(t => parseInt(t.task.split(' ')[0]) > 0);

  const recentActivity: { id: number; action: string; time: string; module: string; detail: string }[] = data?.actividad?.map((act: any) => ({
    id: act.id,
    action: `Ingreso ${act.numero_entrada} registrado`,
    time: new Date(act.fecha).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    module: "recepcion",
    detail: `${act.transporte} • ${act.sacos || 0} Sacos • ${Number(act.qq || 0).toFixed(2)} QQ`
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Vista general del sistema Global Café</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = moduleColors[stat.module as keyof typeof moduleColors];
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10" style={{ backgroundColor: colors.border }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.changeType === "positive" ? "text-green-600" : "text-neutral-500"}`}>{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.bg }}>
                    <Icon className="w-6 h-6" style={{ color: colors.icon }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tareas Pendientes</CardTitle>
              <span className="text-sm text-neutral-500">{pendingTasks.length} tareas</span>
            </div>
          </CardHeader>
          <CardContent>
        {pendingTasks.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
            <p>No hay tareas pendientes en Recepción</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const colors = moduleColors[task.module as keyof typeof moduleColors];
              return (
                <Link to={task.link} key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors.border }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{task.task}</p>
                  </div>
                  {task.status === "urgente" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Urgente
                    </span>
                  )}
                  {task.status === "en_proceso" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> En proceso
                    </span>
                  )}
                  {task.status === "pendiente" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </Link>
              );
            })}
          </div>
        )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
        {recentActivity.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            <p>No hay actividad reciente hoy.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const colors = moduleColors[activity.module as keyof typeof moduleColors];
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: colors.bg }}>
                    <CheckCircle className="w-4 h-4" style={{ color: colors.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{activity.action}</p>
                    <p className="text-xs text-neutral-500">{activity.detail} • {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "Recepción", to: "/recepcion/remision", module: "recepcion", icon: Package },
            { name: "Comercial", to: "/comercial/contratos", module: "comercial", icon: TrendingUp },
            { name: "Industrial", to: "/industrial/programa", module: "industrial", icon: Factory },
            { name: "Despacho", to: "/despacho/contenedores", module: "despacho", icon: Truck },
            { name: "Ventas", to: "/ventas/kardex", module: "ventas", icon: ShoppingCart },
          ].map((item) => {
            const colors = moduleColors[item.module as keyof typeof moduleColors];
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.to} className="p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                <Icon className="w-8 h-8 mb-2" style={{ color: colors.icon }} />
                <p className="font-medium" style={{ color: colors.text }}>{item.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
