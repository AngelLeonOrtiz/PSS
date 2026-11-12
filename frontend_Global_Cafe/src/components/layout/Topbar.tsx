import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  PanelLeftClose,
  CheckCircle2,
  AlertCircle,
  Info,
  Check
} from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { useLayout } from "./LayoutContext";
import { NAV } from "../../config/nav";
import { useNotifications } from "../../hooks/useNotifications";

export default function Topbar() {
  const { logout, profile } = useAuth();
  const { sidebarMode, setSidebarMode, toggleSidebar } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600 relative"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Dropdown Notificaciones */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50">
              <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h3 className="font-semibold text-neutral-800">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-coffee-600 hover:text-coffee-800 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-neutral-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 hover:bg-neutral-50 cursor-pointer transition-colors flex gap-3 ${!notif.read ? 'bg-amber-50/30' : 'opacity-75'}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {notif.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                          {notif.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                          {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium text-neutral-900 ${!notif.read ? '' : 'font-normal'}`}>{notif.title}</p>
                          <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-neutral-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-coffee-500 rounded-full mt-1.5 shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
