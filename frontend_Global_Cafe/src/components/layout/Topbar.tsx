import { useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { useLayout } from "./LayoutContext";
import { NAV } from "../../config/nav";

export default function Topbar() {
  const { logout, profile } = useAuth();
  const { sidebarMode, setSidebarMode, toggleSidebar } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener breadcrumb basado en la ruta actual
  const getBreadcrumb = () => {
    const path = location.pathname;
    
    for (const group of NAV) {
      for (const item of group.items) {
        if (item.to === path) {
          return {
            group: group.title,
            item: item.label,
            color: group.color,
          };
        }
      }
    }
    return null;
  };

  const breadcrumb = getBreadcrumb();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600"
          title={sidebarMode === "collapsed" ? "Expandir menú" : "Colapsar menú"}
        >
          {sidebarMode === "collapsed" ? (
            <Menu className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-neutral-500">{breadcrumb.group}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span 
              className="font-medium"
              style={{ color: breadcrumb.color || '#6c3b29' }}
            >
              {breadcrumb.item}
            </span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600 relative"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="hidden sm:flex items-center gap-3 pl-3 ml-2 border-l border-neutral-200">
          <div className="text-right">
            <div className="text-sm font-medium text-neutral-900">
              {profile?.nombre || profile?.usuario || "Usuario"}
            </div>
            <div className="text-xs text-neutral-500">
              {profile?.roles?.[0] || "Sin rol"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-neutral-600 hover:text-red-600"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
