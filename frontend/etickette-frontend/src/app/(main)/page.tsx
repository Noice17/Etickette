
"use client";


import { Clock, FileChartColumnIcon, Star, Ticket } from "lucide-react";
// import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import PriorityTicketChart from "../components/dashboard/PriorityTicketChart";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-300/20"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome to Etickette</h1>
            <p className="text-lg opacity-90">
              Your comprehensive ticketing dashboard
            </p>
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
