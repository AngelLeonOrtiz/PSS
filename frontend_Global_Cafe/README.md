# Frontend Global Café

Sistema de Gestión Integral para Procesamiento y Exportación de Café.



Aqui ire agregando mas cosas a medida  vayamos necesitando, la idea es tener un imagen general del sistema por los momentos
Obviamnete  he  pedido ayuda  a la IA para que me generara este documento

## Estructura del Proyecto

```
frontend_Global_Cafe/
├── src/
│   ├── api/                    # Configuración de API y servicios
│   │   ├── http.ts             # Cliente Axios configurado
│   │   └── auth.api.ts         # API de autenticación
│   ├── auth/                   # Autenticación y autorización
│   │   ├── AuthProvider.tsx    # Context de autenticación
│   │   ├── useAuth.ts          # Hook de autenticación
│   │   └── ProtectedRoute.tsx  # HOC para rutas protegidas
│   ├── components/
│   │   ├── layout/             # Componentes de estructura
│   │   │   ├── AppLayout.tsx   # Layout principal
│   │   │   ├── Sidebar.tsx     # Menú lateral
│   │   │   ├── Topbar.tsx      # Barra superior
│   │   │   └── PageHeader.tsx  # Encabezado de páginas
│   │   └── ui/                 # Componentes reutilizables
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Card.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       └── Badge.tsx
│   ├── config/
│   │   ├── nav.ts              # Configuración de navegación
│   │   └── colors.config.ts    # Sistema de colores
│   ├── pages/
│   │   ├── auth/               # Páginas de autenticación
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── recepcion/          # Módulo 1: Recepción
│   │   ├── comercial/          # Módulo 2: Gestión Comercial
│   │   ├── industrial/         # Módulo 3: Proceso Industrial
│   │   ├── despacho/           # Módulo 4: Despacho y Exportación
│   │   ├── ventas/             # Módulo 5: Ventas Locales
│   │   └── admin/              # Administración
│   ├── router/
│   │   └── AppRouter.tsx       # Configuración de rutas
│   └── types/                  # Definiciones TypeScript
├── public/
├── .env                        # Variables de entorno
└── package.json
```

##  Módulos del Sistema

### Módulo 1: Inbound y Recepción (🟡 Amarillo)
- Ingreso de Remisión (Portería)
- Muestreo (Previo/General)
- Laboratorio (Análisis y Aprobación)
- Báscula de Entrada (Pesaje Inicial)
- WMS Patio (Almacenamiento Pergamino)
- Nota de Peso (Liquidación)

### Módulo 2: Gestión Comercial (🟣 Púrpura)
- Contrato de Venta (Registro)
- Solicitud Muestra Pre-Embarque
- Laboratorio Pre-Embarque (Análisis)
- Aprobación Cliente
- Generación de Lotes (Consecutivo Global)
- Instrucciones de Embarque (SI)
- Inventario Pergamino Seco

### Módulo 3: Proceso Industrial / Trilla (🟠 Naranja)
- Programa de Producción Semanal
- Orden de Sacos (Cálculo Inverso Insumo)
- Proceso de Trilla (Maquinaria)
- Balance de Masas (Registro Resultados)
- Producto Terminado (Oro Exportable)
- Merma / Remanente (Reasignación)

### Módulo 4: Despacho y Exportación (🟢 Verde)
- Asignación de Contenedores (Naviera)
- Orden de Carga (Match Lote-Contenedor)
- Carga de Contenedor
- Báscula de Salida (Validación Peso Idóneo)
- Documentación Final (BL, Packing List)

### Módulo 5: Ventas Locales y Subproductos (🔴 Rojo)
- Kardex Subproductos (Por Cosecha)
- Orden de Venta Local (Autorización)
- Báscula Venta Local (Validación Peso)
- Salida Venta Local

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## ⚙️ Configuración

Crear archivo `.env` con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

## 📝 API Backend (Node.js)

Este frontend está diseñado para conectarse con una API REST en Node.js.

### Endpoints esperados:

```
POST   /api/auth/login          # Autenticación
POST   /api/auth/logout         # Cerrar sesión
POST   /api/auth/refresh        # Refrescar token

# Recepción
GET    /api/remisiones          # Listar remisiones
POST   /api/remisiones          # Crear remisión
GET    /api/muestras            # Listar muestras
POST   /api/muestras            # Crear muestra
...

# (Completar según necesidades)
```

## 🎨 Sistema de Colores por Módulo

| Módulo | Color | Código |
|--------|-------|--------|
| Recepción | Amarillo | #f59e0b |
| Comercial | Púrpura | #a855f7 |
| Industrial | Naranja | #f97316 |
| Despacho | Verde | #22c55e |
| Ventas | Rojo | #ef4444 |

## 📄 Licencia


