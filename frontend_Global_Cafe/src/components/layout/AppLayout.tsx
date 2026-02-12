import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "./LayoutContext";

export default function AppLayout() {
  const { sidebarMode } = useLayout();

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {sidebarMode !== "hidden" && <Sidebar />}

      <div className="flex-1 min-w-0 transition-all duration-300">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
