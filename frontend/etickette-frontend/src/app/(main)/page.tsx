
"use client";


import { Clock, FileChartColumnIcon, Star, Ticket } from "lucide-react";
// import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import PriorityTicketChart from "../components/dashboard/PriorityTicketChart";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }

    const fetchUser = async () => {
      try{
        const res = await apiFetch("/users/me");

        if(!res.ok){
          throw new Error("Failed to fetch current user")
        }

        const data = await res.json();
        setUser(data);
      }catch(error){
        toast.error("Error fetching user")
        console.error("Error fetching user:", error);
        router.replace("/login");
      }
    };

    fetchUser();

  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 bg-slate-600 rounded-2xl overflow-hidden">
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to Etickette</h1>
            <p className="text-lg opacity-90">
              Your comprehensive ticketing dashboard
            </p>
            {user && (
              <div className="mt-4 text-white text-sm">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Ave Resolution Time */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <Clock />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">1 hr 30 mins</h3>
          <p className="text-slate-300 text-sm">Ave Resolution Time</p>
        </div>

        {/* Total Ticket */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Ticket />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">42</h3>
          <p className="text-slate-300 text-sm">Total Tickets</p>
        </div>

        {/* Client Rating */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Star />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">4.3</h3>
          <p className="text-slate-300 text-sm">Ave Client Rating</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-700 p-6 rounded-xl">
          <div className="mb-3">
            <button className="flex gap-2 items text-white bg-red-500 p-2 hover:bg-red-600 items-center justify-center rounded">
              <FileChartColumnIcon />
              <p>Generate Report</p>
            </button>
          </div>
          <h3 className="text-2xl font-bold text-white">Controls</h3>
        </div>
      </div>

      {/* Bottom Row - Two Large Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Time Chart */}
        <ResolutionTimeChart/>

        {/* Priority Ticket Chart */}
        <PriorityTicketChart/>

      </div>
    </div>
  );
}
