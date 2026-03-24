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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { moduleColors } from "../../config/colors.config";

const stats = [
  { title: "Remisiones Hoy", value: "24", change: "+12%", changeType: "positive" as const, icon: Package, module: "recepcion" },
  { title: "En Proceso Trilla", value: "8", change: "3 lotes", changeType: "neutral" as const, icon: Factory, module: "industrial" },
  { title: "Contenedores Pendientes", value: "5", change: "2 hoy", changeType: "neutral" as const, icon: Truck, module: "despacho" },
  { title: "Ventas Locales Mes", value: "156", change: "+8%", changeType: "positive" as const, icon: ShoppingCart, module: "ventas" },
];

const pendingTasks = [
  { id: 1, task: "Aprobar muestra lote L-2024-0892", module: "comercial", status: "urgente" },
  { id: 2, task: "Validar peso contenedor CONT-4521", module: "despacho", status: "pendiente" },
  { id: 3, task: "Análisis laboratorio remisión R-1234", module: "recepcion", status: "pendiente" },
  { id: 4, task: "Balance de masas orden O-789", module: "industrial", status: "en_proceso" },
];

const recentActivity = [
  { id: 1, action: "Remisión R-1235 ingresada", time: "Hace 5 min", module: "recepcion" },
  { id: 2, action: "Lote L-2024-0893 generado", time: "Hace 15 min", module: "comercial" },
  { id: 3, action: "Contenedor CONT-4520 despachado", time: "Hace 1 hora", module: "despacho" },
  { id: 4, action: "Trilla completada orden O-788", time: "Hace 2 horas", module: "industrial" },
];

export default function DashboardPage() {
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
            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const colors = moduleColors[task.module as keyof typeof moduleColors];
                return (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
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
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
