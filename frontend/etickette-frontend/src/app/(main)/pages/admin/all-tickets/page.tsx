"use client";

import React, { useEffect, useState } from "react";
import { Filter, Table, LayoutGrid, List } from "lucide-react";
import TicketTableView from "@/app/components/all-tickets/TicketTableView";
import TicketKanbanView from "@/app/components/all-tickets/TicketKanbanView";
import TicketListView from "@/app/components/all-tickets/TicketListView";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define types
interface Agent {
  id: number;
  username: string;
}

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string; 
  priority: string;
  category: string;
  client?: { username: string };
  agent?: { userId: number };
}

export default function AllTickets() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("table");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      router.replace("/login");
    }

    const fetchTickets = async () => {
      try {
        const res = await apiFetch("/tickets/all");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        toast.error("Error loading tickets");
        console.error("Error fetching tickets: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await apiFetch("/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();

        const agentUsers: Agent[] = data
          .filter((user: any) => user.role === "AGENT")
          .map((user: any, index: number) => ({
            id: user.id,
            username: user.username
          }));

        setAgents(agentUsers);
      } catch (error) {
        toast.error("Failed to load agents");
        console.error("Error fetching agents:", error);
      }
    };

    fetchTickets();
    fetchAgents();
  }, []);

  const getAgentUsername = (userId?: number) => {
    if (!userId) return "Unassigned";
    const agent = agents.find((a) => a.id === userId);
    return agent ? agent.username : "Unassigned";
  };

  const transformedTickets = tickets.map((ticket) => ({
    id: `TKT-${ticket.id.toString().padStart(3, "0")}`,
    title: ticket.title,
    description: ticket.description,
    category: ticket.category.replace(/_/g, " "),
    requestedBy: ticket.client?.username || "Unknown",
    assignedTo: getAgentUsername(ticket.agent?.userId),
    priority:
      ticket.priority.charAt(0).toUpperCase() +
      ticket.priority.slice(1).toLowerCase(),
    status: ticket.status
  }));

  const uniqueAgents = [
    ...new Set(transformedTickets.map((t) => t.assignedTo)),
  ];
  const uniqueCategories = [
    ...new Set(transformedTickets.map((t) => t.category)),
  ];

  const filteredTickets = transformedTickets.filter((ticket) => {
    const priorityMatch =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const agentMatch =
      agentFilter === "all" || ticket.assignedTo === agentFilter;
    const categoryMatch =
      categoryFilter === "all" || ticket.category === categoryFilter;
    return priorityMatch && agentMatch && categoryMatch;
  });

  return (
    <div className="p-6 text-azure-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Tickets</h1>

        <div className="flex bg-indigo-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-azure-500 shadow-sm text-indigo-600"
                : "text-indigo-100 hover:text-indigo-300"
            }`}
          >
            <Table size={16} />
            Table
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "kanban"
                ? "bg-azure-500 shadow-sm text-indigo-600"
                : "text-indigo-100 hover:text-indigo-300"
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-azure-500 shadow-sm text-indigo-600"
                : "text-indigo-100 hover:text-indigo-300"
            }`}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Agents</option>
            {uniqueAgents.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      {viewMode === "table" && <TicketTableView tickets={filteredTickets} />}
      {viewMode === "kanban" && <TicketKanbanView tickets={filteredTickets} />}
      {viewMode === "list" && <TicketListView tickets={filteredTickets} />}
    </div>
  );
}
