"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PriorityTicketChart from "../components/dashboard/PriorityTicketChart";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const userRes = await apiFetch("/users/me", { method: "GET" });
        if (!userRes.ok) {
          throw new Error("Failed to fetch user info");
        }

        const user = await userRes.json();
        localStorage.setItem("role", user.role);
        localStorage.setItem("id", user.id);

        if (user.role === "CLIENT") {
          router.push("/pages/client");
        } else if (user.role === "AGENT") {
          router.push("/pages/agent");
        } else {
          router.push("/pages/admin");
        }
      } catch (error) {
        console.error("Role check error:", error);
        toast.error("Unable to determine user role");
        router.push("/login");
      }
    };

    checkUserRole();
  }, [router]);
  
  return null
}
