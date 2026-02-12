/**
 * Sistema de Colores Unificado - Global Café
 * Paleta inspirada en tonos de café y naturaleza
 */

export const colors = {
  // Colores Primarios (Café - para acciones principales)
  primary: {
    50: '#fdf8f3',
    100: '#f9efe3',
    200: '#f2dcc4',
    300: '#e9c39d',
    400: '#dea473',
    500: '#d4864d',
    600: '#c66d3d',
    700: '#a55534',
    800: '#854630',
    900: '#6c3b29',
    950: '#3a1d14',
  },

  // Colores de Éxito (Verde - aprobado, café verde)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Colores de Error (Rojo - rechazos)
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Colores de Advertencia (Amarillo/Ámbar)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Colores de Información (Azul)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Escala de Grises (Neutrales)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Colores Especiales
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Colores por módulo del sistema
 */
export const moduleColors = {
  recepcion: {
    bg: '#fef3c7',      // Amarillo claro
    border: '#f59e0b',
    text: '#92400e',
    icon: '#d97706',
  },
  comercial: {
    bg: '#e9d5ff',      // Púrpura claro
    border: '#a855f7',
    text: '#6b21a8',
    icon: '#9333ea',
  },
  industrial: {
    bg: '#fed7aa',      // Naranja claro
    border: '#f97316',
    text: '#9a3412',
    icon: '#ea580c',
  },
  despacho: {
    bg: '#bbf7d0',      // Verde claro
    border: '#22c55e',
    text: '#166534',
    icon: '#16a34a',
  },
  ventas: {
    bg: '#fecaca',      // Rojo claro
    border: '#ef4444',
    text: '#991b1b',
    icon: '#dc2626',
  },
} as const;

/**
 * Mapeo semántico de colores
 */
export const semanticColors = {
  background: {
    primary: colors.white,
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    dark: colors.primary[950],
  },
  
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    disabled: colors.neutral[400],
    inverse: colors.white,
  },

  border: {
    light: colors.neutral[200],
    default: colors.neutral[300],
    dark: colors.neutral[400],
  },

  interactive: {
    primary: colors.primary[700],
    primaryHover: colors.primary[800],
    success: colors.success[600],
    successHover: colors.success[700],
    danger: colors.danger[600],
    dangerHover: colors.danger[700],
  },

  status: {
    pendiente: colors.warning[500],
    aprobado: colors.success[500],
    rechazado: colors.danger[500],
    enProceso: colors.info[500],
    completado: colors.success[600],
  },
} as const;

/**
 * Sombras estandarizadas
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;
