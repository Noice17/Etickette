"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? "w-16" : "w-50";
  const contentPadding = collapsed ? "pl-16" : "pl-50";

  return (
    <div>
      <Navbar />
      <Sidebar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />
      <div className={`pt-16 ${contentPadding} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
