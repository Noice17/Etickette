"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Tickets,
  LayoutDashboard,
  UserCog2,
  Users,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

export default function Sidebar({ collapsed, toggleCollapsed }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    toast.success("Logout Successful!");
    document.cookie = "token=; Max-Age=0; path=/"; // clear cookie if you're using one

    // Redirect to login
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-indigo-600 text-azure-300 shadow transition-all duration-300 ${
        collapsed ? "w-16" : "w-50"
      } flex flex-col justify-between`}
    >
      {/* Top section: Toggle + Nav */}
      <div>
        <div className="h-16 flex items-center justify-end pr-5">
          <button onClick={toggleCollapsed} className="cursor-pointer">
            <Menu />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-indigo-700 rounded">
              <LayoutDashboard />
              {!collapsed && <span>Dashboard</span>}
            </div>
          </Link>

          <Link href="/pages/admin/all-tickets">
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-indigo-700 rounded">
              <Tickets />
              {!collapsed && <span>All Tickets</span>}
            </div>
          </Link>

          <Link href="/pages/admin/view-agents">
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-indigo-700 rounded">
              <UserCog2 />
              {!collapsed && <span>Agents</span>}
            </div>
          </Link>

          <Link href="/pages/admin/view-clients">
            <div className="flex items-center gap-2 px-5 py-3 hover:bg-indigo-700 rounded">
              <Users />
              {!collapsed && <span>Clients</span>}
            </div>
          </Link>
        </nav>
      </div>

      {/* Bottom section: Logout */}
      <div className="bg-indigo-800">
        <Link href="/login">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 hover:bg-indigo-700 rounded w-full text-left"
          >
            <LogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </Link>
      </div>
    </aside>
  );
}
