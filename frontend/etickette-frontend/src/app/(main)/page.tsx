"use client";

import {
  Clock,
  FileChartColumnIcon,
  FilePlus2,
  Star,
  Ticket,
  UserPlus2,
} from "lucide-react";
// import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResolutionTimeChart from "../components/dashboard/ResolutionTimeChart";
import PriorityTicketChart from "../components/dashboard/PriorityTicketChart";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";
import Banner from "../components/Banner";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

interface Ticket {
  id: number;
  createdAt: string;
  resolvedAt: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface Agent {
  userId: number;
  username: string;
  averageRating: number;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);

  const [avgResolutionTime, setAvgResolutionTime] =
    useState<string>("Loading...");
  const [avgRating, setAvgRating] = useState<number | null>(0);


  const handleGeneratePDF = async () =>{
    try{
      const res = await apiFetch("/reports/metrics", {method: "GET",})
      if (!res.ok){
        throw new Error("Failed to generate PDF")
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    }catch(error){
      toast.error("Error generating PDF");
      console.error("Error generating PDF: ", error);
    }
  }
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }

    const fetchUser = async () => {
      try {
        const res = await apiFetch("/users/me");

        if (!res.ok) {
          throw new Error("Failed to fetch current user");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error("Error fetching user");
        console.error("Error fetching user:", error);
        router.replace("/login");
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await apiFetch("/tickets/all");
        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data: Ticket[] = await res.json();
        setTickets(data);

        const resolvedTickets = data.filter(
          (ticket: Ticket) => ticket.resolvedAt !== null
        );

        const totalResolutionTime = resolvedTickets.reduce(
          (acc: number, ticket: Ticket) => {
            const createdAt = new Date(ticket.createdAt).getTime();
            const resolvedAt = new Date(ticket.resolvedAt!).getTime();
            return acc + (resolvedAt - createdAt);
          },
          0
        );
        const avgTime =
          resolvedTickets.length > 0
            ? totalResolutionTime / resolvedTickets.length
            : 0;

        // Format: convert milliseconds to hours + minutes
        const avgHours = Math.floor(avgTime / (1000 * 60 * 60));
        const avgMinutes = Math.floor(
          (avgTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const formatted = `${avgHours} hr ${avgMinutes} min`;
        setAvgResolutionTime(formatted);

        //Resolved vs Unresolved by Priority
        const priorityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
        const priorityCounts = priorityLevels.map((priority) => {
          const ticketsByPriority = data.filter((t) => t.priority === priority);
          const resolved = ticketsByPriority.filter(
            (t) => t.resolvedAt !== null
          ).length;
          const unresolved = ticketsByPriority.length - resolved;

          return {
            priority,
            resolved,
            unresolved,
          };
        });
        setPriorityData(priorityCounts);
      } catch (error) {
        toast.error("Error fetching tickets");
        console.error("Error fetching tickets:", error);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await apiFetch("/agents");
        if (!res.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data: Agent[] = await res.json();
        setAgents(data);

        const ratedAgents = data.filter(agent => agent.averageRating > 0);

        if (ratedAgents.length > 0) {
          const totalRatings = data.reduce(
            (sum, agent) => sum + agent.averageRating,
            0
          );
          const avgRating = totalRatings / ratedAgents.length;
          setAvgRating(parseFloat(avgRating.toFixed(1)));
        } else {
          setAvgRating(0);
        }
      } catch (error) {
        toast.error("Error fetching agents");
        console.error("Error fetching agents:", error);
      }
    };

    fetchUser();
    fetchTickets();
    fetchAgents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Hero Banner */}
      <Banner user={user} />

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ave Resolution Time */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <Clock />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{avgResolutionTime}</h3>
          <p className="text-slate-300 text-sm">Ave Resolution Time</p>
        </div>

        {/* Total Ticket */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Ticket />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{tickets.length}</h3>
          <p className="text-slate-300 text-sm">Total Tickets</p>
        </div>

        {/* Client Rating */}
        <div className="bg-slate-700 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Star />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {avgRating !== null ? avgRating : "0"}
          </h3>
          <p className="text-slate-300 text-sm">Ave Rating</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-700 p-6 rounded-xl flex flex-col justify-center items-center">
          <div className="flex mb-3 gap-2">
            {/* Generate PDF */}
            <button onClick={handleGeneratePDF} className="flex gap-2 items text-white bg-orange-500 p-2 hover:bg-orange-600 items-center justify-center rounded">
              <FilePlus2 />
            </button>
            {/* Add New Agent */}
            <button className="flex gap-2 items text-white bg-violet-500 p-2 hover:bg-violet-600 items-center justify-center rounded">
              <UserPlus2 />
            </button>
          </div>
          <h3 className="text-2xl font-bold text-white">Controls</h3>
        </div>
      </div>

      {/* Bottom Row - Two Large Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <ResolutionTimeChart data={resolutionChartData} /> */}

        {/* Priority Ticket Chart */}
        <PriorityTicketChart data={priorityData} />
      </div>
    </div>
  );
}
