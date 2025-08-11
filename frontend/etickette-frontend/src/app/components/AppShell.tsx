"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "ADMIN"){
      setIsAdmin(role === "ADMIN");
    }
    if (role === "AGENT"){
      setIsAgent(role === "AGENT");
    }
    if (role === "CLIENT"){
      setIsClient(role === "CLIENT");
    }
    
  }, []);

  const sidebarWidth = collapsed ? "w-16" : "w-50";
  const contentPadding = collapsed ? "pl-16" : "pl-50";

  return (
    <div>
      {isAdmin && (
        <>
          <Navbar />
          <Sidebar
            collapsed={collapsed}
            toggleCollapsed={() => setCollapsed(!collapsed)}
          />
          <div
            className={`pt-16 ${contentPadding} transition-all duration-300 `}
          >
            {children}
          </div>
        </>
      )}

      {isAgent && (
        <>
          <div>
            {children}
          </div>
        </>
      )}

      {isClient && (
        <>
          <div>
            {children}
          </div>
        </>
      )}
    </div>
  );
}
