import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  const baseStyles = [
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded-xl transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.98]",
  ];

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variantStyles = {
    primary: [
      "bg-coffee-700 text-white",
      "hover:bg-coffee-800",
      "focus:ring-coffee-500",
      "shadow-sm hover:shadow-md",
    ].join(" "),

    secondary: [
      "bg-neutral-100 text-neutral-900",
      "hover:bg-neutral-200",
      "focus:ring-neutral-400",
    ].join(" "),

    outline: [
      "bg-transparent border-2 border-coffee-300 text-coffee-700",
      "hover:bg-coffee-50 hover:border-coffee-400",
      "focus:ring-coffee-400",
    ].join(" "),

    ghost: [
      "bg-transparent text-neutral-700",
      "hover:bg-neutral-100",
      "focus:ring-neutral-400",
    ].join(" "),

    danger: [
      "bg-red-600 text-white",
      "hover:bg-red-700",
      "focus:ring-red-500",
      "shadow-sm hover:shadow-md",
    ].join(" "),

    success: [
      "bg-green-600 text-white",
      "hover:bg-green-700",
      "focus:ring-green-500",
      "shadow-sm hover:shadow-md",
    ].join(" "),
  };

  const widthClass = fullWidth ? "w-full" : "";

  const allClasses = [
    ...baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={allClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
