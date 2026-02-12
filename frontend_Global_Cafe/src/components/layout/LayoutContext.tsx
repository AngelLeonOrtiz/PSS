import React, { createContext, useContext, useState } from "react";

type SidebarMode = "expanded" | "collapsed" | "hidden";

type LayoutContextValue = {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  toggleSidebar: () => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");

  const toggleSidebar = () => {
    setSidebarMode((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  };

  return (
    <LayoutContext.Provider value={{ sidebarMode, setSidebarMode, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout debe usarse dentro de LayoutProvider");
  return ctx;
}
