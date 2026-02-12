import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
};

export function Card({ children, className = "", padding = "md", hover = false }: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        bg-white rounded-2xl border border-neutral-200 shadow-sm
        ${paddingStyles[padding]}
        ${hover ? "card-hover cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`border-b border-neutral-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
};

export function CardTitle({ children, className = "", subtitle }: CardTitleProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-neutral-900">{children}</h3>
      {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`border-t border-neutral-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}
