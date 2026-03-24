import { NavLink } from "react-router-dom";
import { ChevronRight, User, Coffee } from "lucide-react";
import { NAV } from "../../config/nav";
import { useAuth } from "../../auth/useAuth";
import { useLayout } from "./LayoutContext";

const linkActive = "bg-white/15 text-white";
const linkIdle = "text-white/70 hover:bg-white/5 hover:text-white";

export default function Sidebar() {
  const { profile } = useAuth();
  const { sidebarMode, setSidebarMode } = useLayout();

  const isCollapsed = sidebarMode === "collapsed";
  const widthClass = isCollapsed ? "w-16" : "w-64";

  return (
    <aside
      className={`${widthClass} shrink-0 bg-coffee-950 text-white min-h-screen flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Coffee className="w-6 h-6 text-coffee-400 shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold tracking-wide">Global Café</span>
          )}
        </div>

        {isCollapsed && (
          <button
            className="text-white/70 hover:text-white transition-colors"
            title="Expandir menú"
            onClick={() => setSidebarMode("expanded")}
            aria-label="Expandir menú"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto px-2 py-4">
        {NAV.map((group) => (
          <div key={group.title} className="mb-5">
            {/* Group Title con indicador de color */}
            {!isCollapsed && (
              <div className="flex items-center gap-2 px-2 mb-2">
                {group.color && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                )}
                <span className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">
                  {group.title}
                </span>
              </div>
            )}

            {/* Separador visual para modo colapsado */}
            {isCollapsed && group.color && (
              <div
                className="h-0.5 mx-2 mb-2 rounded-full"
                style={{ backgroundColor: group.color }}
              />
            )}

            {/* Navigation Items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    title={isCollapsed ? item.label : item.description}
                    className={({ isActive }) => {
                      const base = isCollapsed
                        ? "flex items-center justify-center rounded-lg h-10 transition-all select-none"
                        : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all select-none";
                      return `${base} ${isActive ? linkActive : linkIdle}`;
                    }}
                  >
                    <Icon size={isCollapsed ? 20 : 18} className="shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - User Info */}
      <div className="px-3 py-3 border-t border-white/10">
        {isCollapsed ? (
          <div
            className="flex justify-center text-white/70"
            title={profile?.usuario ?? "Usuario"}
          >
            <User size={20} />
          </div>
        ) : (
          <div className="text-xs text-white/70">
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="shrink-0" />
              <span className="text-white font-medium truncate">
                {profile?.nombre ?? profile?.usuario ?? "—"}
              </span>
            </div>
            {profile?.roles?.length ? (
              <div className="pl-5 text-white/50 truncate">
                {profile.roles.join(", ")}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}
