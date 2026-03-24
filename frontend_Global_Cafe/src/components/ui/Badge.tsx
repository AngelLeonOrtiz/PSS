import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral";

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: Props) {
  const variantStyles = {
    default: "bg-coffee-100 text-coffee-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    neutral: "bg-neutral-100 text-neutral-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Componente específico para estados del flujo de café
type StatusType = 
  | "pendiente" 
  | "en_proceso" 
  | "aprobado" 
  | "rechazado" 
  | "completado"
  | "cancelado";

const statusConfig: Record<StatusType, { label: string; variant: BadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  en_proceso: { label: "En Proceso", variant: "info" },
  aprobado: { label: "Aprobado", variant: "success" },
  rechazado: { label: "Rechazado", variant: "danger" },
  completado: { label: "Completado", variant: "success" },
  cancelado: { label: "Cancelado", variant: "neutral" },
};

export function StatusBadge({ status, size = "md" }: { status: StatusType; size?: "sm" | "md" }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
