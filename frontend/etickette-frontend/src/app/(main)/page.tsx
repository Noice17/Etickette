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
import PriorityTicketChart from "../components/dashboard/PriorityTicketChart";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";
import Banner from "../components/Banner";
import AddAgentModal from "../components/dashboard/AddAgentModal";
import ConfirmGeneratePDFModal from "../components/dashboard/ConfirmGeneratePDFModal";
import EticketteBanner from "../components/all-tickets/EticketteBanner";

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
  status: string;
  agent?: { userId: number };
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [topAgents, setTopAgents] = useState<Agent[]>([]);
  const [avgResolutionTime, setAvgResolutionTime] =
    useState<string>("Loading...");
  const [avgRating, setAvgRating] = useState<number | null>(0);

  const priorityValues: Record<string, number> = {
    LOW: 1,
    MEDIUM: 3,
    HIGH: 5,
    CRITICAL: 8,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return; // Stop further execution
    }

    const fetchUser = async () => {
      try {
        const res = await apiFetch("/users/me");

        if (!res.ok) {
          throw new Error("Invalid or expired token");
        }

        const data = await res.json();
        if (data.role !== "ADMIN") {
          console.warn("Access denied: User is not an ADMIN");
          localStorage.removeItem("token");
          router.replace("/login");
          return; // Stop execution
        }
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token"); // Clear bad token
        router.replace("/login");
      }
    };

    const fetchData = async () => {
      try {
        const [ticketsRes, agentsRes] = await Promise.all([
          apiFetch("/tickets/all"),
          apiFetch("/agents"),
        ]);

        if (!ticketsRes.ok) throw new Error("Failed to fetch tickets");
        if (!agentsRes.ok) throw new Error("Failed to fetch agents");

        const ticketData: Ticket[] = await ticketsRes.json();
        const agentData: Agent[] = await agentsRes.json();

        setTickets(ticketData);
        setAgents(agentData);

        // --- Average Resolution Time ---
        const resolvedTickets = ticketData.filter(
          (ticket) => ticket.resolvedAt !== null
        );
        const totalResolutionTime = resolvedTickets.reduce((acc, ticket) => {
          const createdAt = new Date(ticket.createdAt).getTime();
          const resolvedAt = new Date(ticket.resolvedAt!).getTime();
          return acc + (resolvedAt - createdAt);
        }, 0);

        const avgTime =
          resolvedTickets.length > 0
            ? totalResolutionTime / resolvedTickets.length
            : 0;

        const avgHours = Math.floor(avgTime / (1000 * 60 * 60));
        const avgMinutes = Math.floor(
          (avgTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        setAvgResolutionTime(`${avgHours} hr ${avgMinutes} min`);

        // --- Resolved vs Unresolved by Priority ---
        const priorityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
        const priorityCounts = priorityLevels.map((priority) => {
          const ticketsByPriority = ticketData.filter(
            (t) => t.priority === priority
          );
          const resolved = ticketsByPriority.filter(
            (t) => t.resolvedAt !== null
          ).length;
          const unresolved = ticketsByPriority.length - resolved;
          return { priority, resolved, unresolved };
        });
        setPriorityData(priorityCounts);

        // --- Average Rating ---
        const ratedAgents = agentData.filter(
          (agent) => agent.averageRating > 0
        );
        if (ratedAgents.length > 0) {
          const totalRatings = agentData.reduce(
            (sum, agent) => sum + agent.averageRating,
            0
          );
          setAvgRating(
            parseFloat((totalRatings / ratedAgents.length).toFixed(1))
          );
        } else {
          setAvgRating(0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchUser();
    fetchData();
  }, [router]);

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
          <p className="text-slate-300 text-sm">Average Resolution Time</p>
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
          <p className="text-slate-300 text-sm">Average Rating</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-700 p-6 rounded-xl flex flex-col justify-center items-center">
          <div className="flex mb-3 gap-2">
            <div className="flex mb-3 gap-2">
              {/* Generate PDF */}
              <div className="relative group">
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="flex gap-2 text-white bg-orange-500 p-2 hover:bg-orange-600 items-center justify-center rounded"
                >
                  <FilePlus2 />
                </button>
                <span
                  className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                     opacity-0 group-hover:opacity-100 
                     transition bg-gray-800 text-white text-xs 
                     px-2 py-1 rounded shadow-lg whitespace-nowrap"
                >
                  Generate PDF
                </span>
              </div>

              {/* Add New Agent */}
              <div className="relative group">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex gap-2 text-white bg-violet-500 p-2 hover:bg-violet-600 items-center justify-center rounded"
                >
                  <UserPlus2 />
                </button>
                <span
                  className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                     opacity-0 group-hover:opacity-100 
                     transition bg-gray-800 text-white text-xs 
                     px-2 py-1 rounded shadow-lg whitespace-nowrap"
                >
                  Add New Agent
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">Controls</h3>

          <ConfirmGeneratePDFModal
            isOpen={isReportModalOpen}
            onClose={() => setReportModalOpen(false)}
            onGeneratePDF={() => console.log("Report generated")}
          />

          <AddAgentModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onAgentAdded={() => console.log("Agent added - refresh list")}
          />
        </div>
      </div>

      {/* Bottom Row - Two Large Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Ticket Chart */}
        <PriorityTicketChart data={priorityData} />

        {/* Etickette Banner */}
        <EticketteBanner />
      </div>
    </div>
  );
}
