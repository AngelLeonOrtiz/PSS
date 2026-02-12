import { 
  LayoutDashboard,
  // Módulo 1: Recepción
  ClipboardList,
  FlaskConical,
  TestTube,
  Scale,
  Warehouse,
  FileText,
  // Módulo 2: Comercial
  FileSignature,
  PackageSearch,
  CheckCircle,
  Boxes,
  Ship,
  Database,
  // Módulo 3: Industrial
  Calendar,
  Package,
  Factory,
  Calculator,
  PackageCheck,
  Recycle,
  // Módulo 4: Despacho
  Container,
  ClipboardCheck,
  Truck,
  Weight,
  FileStack,
  // Módulo 5: Ventas Locales
  BarChart3,
  ShoppingCart,
  Receipt,
  // Admin
  Users,
  Shield,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
};

export type NavGroup = {
  title: string;
  moduleKey?: string;
  color?: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    title: "INICIO",
    items: [
      { 
        label: "Dashboard", 
        to: "/", 
        icon: LayoutDashboard,
        description: "Vista general del sistema"
      }
    ],
  },
  {
    title: "MÓDULO 1: RECEPCIÓN",
    moduleKey: "recepcion",
    color: "#f59e0b",
    items: [
      { 
        label: "Ingreso de Remisión", 
        to: "/recepcion/remision", 
        icon: ClipboardList,
        description: "Registro en portería"
      },
      { 
        label: "Muestreo", 
        to: "/recepcion/muestreo", 
        icon: FlaskConical,
        description: "Muestreo previo/general"
      },
      { 
        label: "Laboratorio", 
        to: "/recepcion/laboratorio", 
        icon: TestTube,
        description: "Análisis y aprobación"
      },
      { 
        label: "Báscula de Entrada", 
        to: "/recepcion/bascula-entrada", 
        icon: Scale,
        description: "Pesaje inicial"
      },
      { 
        label: "WMS Patio", 
        to: "/recepcion/wms-patio", 
        icon: Warehouse,
        description: "Almacenamiento pergamino"
      },
      { 
        label: "Nota de Peso", 
        to: "/recepcion/nota-peso", 
        icon: FileText,
        description: "Liquidación"
      },
    ],
  },
  {
    title: "MÓDULO 2: GESTIÓN COMERCIAL",
    moduleKey: "comercial",
    color: "#a855f7",
    items: [
      { 
        label: "Contrato de Venta", 
        to: "/comercial/contratos", 
        icon: FileSignature,
        description: "Registro de contratos"
      },
      { 
        label: "Muestra Pre-Embarque", 
        to: "/comercial/muestra-preembarque", 
        icon: PackageSearch,
        description: "Solicitud de muestra"
      },
      { 
        label: "Lab Pre-Embarque", 
        to: "/comercial/lab-preembarque", 
        icon: TestTube,
        description: "Análisis pre-embarque"
      },
      { 
        label: "Aprobación Cliente", 
        to: "/comercial/aprobacion", 
        icon: CheckCircle,
        description: "Gestión de aprobaciones"
      },
      { 
        label: "Generación de Lotes", 
        to: "/comercial/lotes", 
        icon: Boxes,
        description: "Consecutivo global"
      },
      { 
        label: "Instrucciones Embarque", 
        to: "/comercial/instrucciones-embarque", 
        icon: Ship,
        description: "Shipping Instructions (SI)"
      },
      { 
        label: "Inventario Pergamino", 
        to: "/comercial/inventario-pergamino", 
        icon: Database,
        description: "Inventario pergamino seco"
      },
    ],
  },
  {
    title: "MÓDULO 3: PROCESO INDUSTRIAL",
    moduleKey: "industrial",
    color: "#f97316",
    items: [
      { 
        label: "Programa Producción", 
        to: "/industrial/programa", 
        icon: Calendar,
        description: "Programa semanal"
      },
      { 
        label: "Orden de Sacos", 
        to: "/industrial/orden-sacos", 
        icon: Package,
        description: "Cálculo inverso insumo"
      },
      { 
        label: "Proceso de Trilla", 
        to: "/industrial/trilla", 
        icon: Factory,
        description: "Operación maquinaria"
      },
      { 
        label: "Balance de Masas", 
        to: "/industrial/balance-masas", 
        icon: Calculator,
        description: "Registro de resultados"
      },
      { 
        label: "Producto Terminado", 
        to: "/industrial/producto-terminado", 
        icon: PackageCheck,
        description: "Oro exportable"
      },
      { 
        label: "Merma / Remanente", 
        to: "/industrial/merma", 
        icon: Recycle,
        description: "Reasignación"
      },
    ],
  },
  {
    title: "MÓDULO 4: DESPACHO Y EXPORTACIÓN",
    moduleKey: "despacho",
    color: "#22c55e",
    items: [
      { 
        label: "Asignación Contenedores", 
        to: "/despacho/contenedores", 
        icon: Container,
        description: "Asignación naviera"
      },
      { 
        label: "Orden de Carga", 
        to: "/despacho/orden-carga", 
        icon: ClipboardCheck,
        description: "Match lote-contenedor"
      },
      { 
        label: "Carga de Contenedor", 
        to: "/despacho/carga", 
        icon: Truck,
        description: "Proceso de carga"
      },
      { 
        label: "Báscula de Salida", 
        to: "/despacho/bascula-salida", 
        icon: Weight,
        description: "Validación peso idóneo"
      },
      { 
        label: "Documentación Final", 
        to: "/despacho/documentacion", 
        icon: FileStack,
        description: "BL, Packing List"
      },
    ],
  },
  {
    title: "MÓDULO 5: VENTAS LOCALES",
    moduleKey: "ventas",
    color: "#ef4444",
    items: [
      { 
        label: "Kardex Subproductos", 
        to: "/ventas/kardex", 
        icon: BarChart3,
        description: "Control por cosecha"
      },
      { 
        label: "Orden Venta Local", 
        to: "/ventas/orden-venta", 
        icon: ShoppingCart,
        description: "Autorización de venta"
      },
      { 
        label: "Báscula Venta Local", 
        to: "/ventas/bascula", 
        icon: Scale,
        description: "Validación de peso"
      },
      { 
        label: "Salida Venta Local", 
        to: "/ventas/salida", 
        icon: Receipt,
        description: "Registro de salida"
      },
    ],
  },
  {
    title: "ADMINISTRACIÓN",
    items: [
      { 
        label: "Usuarios", 
        to: "/admin/usuarios", 
        icon: Users,
        description: "Gestión de usuarios"
      },
      { 
        label: "Roles y Permisos", 
        to: "/admin/roles", 
        icon: Shield,
        description: "Control de acceso"
      },
      { 
        label: "Configuración", 
        to: "/admin/configuracion", 
        icon: Settings,
        description: "Parámetros del sistema"
      },
    ],
  },
];
