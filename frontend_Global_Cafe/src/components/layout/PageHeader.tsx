import { type LucideIcon } from "lucide-react";
import Button from "../ui/Button";

type Action = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
};

type Props = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  actions?: Action[];
  children?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  actions,
  children,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: iconBg || "#f3f4f6" }}
            >
              <Icon className="w-6 h-6" style={{ color: iconColor || "#6b7280" }} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
            {subtitle && <p className="text-neutral-600 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={idx}
                  variant={action.variant || "primary"}
                  onClick={action.onClick}
                  leftIcon={ActionIcon && <ActionIcon className="w-4 h-4" />}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
