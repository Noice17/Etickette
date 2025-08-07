"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Mail,
  User,
  AlertCircle,
  TrendingUp,
  SortAsc,
  SortDesc,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/utils/apiFetch";

interface Agent {
  id: string;
  email: string;
  name: string;
  unresolvedTickets: number;
  workload: number;
  rating: number;
}

export default function ViewAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Agent>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // useEffect(() => {
  //   const fetchAgents = async () => {
  //     try {
  //       const res = await apiFetch("/users");

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch users");
  //       }

  //       const data = await res.json();

  //       const agentUsers: Agent[] = data
  //         .filter((user: any) => user.role === "AGENT")
  //         .map((user: any, index: number) => ({
  //           id: `AGT-${user.id.toString().padStart(3, "0")}`,
  //           email: user.email,
  //           name: user.username,
  //           unresolvedTickets: Math.floor(Math.random() * 20) + 5, // 5–25 dummy
  //           workload: Math.floor(Math.random() * 26), // 0–25 dummy
  //           rating: +(Math.random() * 1.5 + 3.5).toFixed(1), // 3.5–5.0 dummy
  //         }));

  //       setAgents(agentUsers);
  //     } catch (error) {
  //       toast.error("Failed to load agents");
  //       console.error("Error fetching agents:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAgents();
  // }, []);

  useEffect(() => {
    const fetchAgentsAndTickets = async () => {
      try {
        const [usersRes, ticketsRes] = await Promise.all([
          apiFetch("/users"),
          apiFetch("/tickets/all"),
        ]);

        if (!usersRes.ok || !ticketsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersRes.json();
        const ticketsData = await ticketsRes.json();

        const agentUsers: Agent[] = usersData
          .filter((user: any) => user.role === "AGENT")
          .map((user: any) => {
            const unresolvedTickets = ticketsData.filter(
              (ticket: any) =>
                ticket.agent?.userId === user.id && ticket.resolvedAt === null
            ).length;

            const workload = ticketsData.filter(
              (ticket: any) => ticket.agent?.userId === user.id
            ).length;

            return {
              id: `AGT-${user.id.toString().padStart(3, "0")}`,
              email: user.email,
              name: user.username,
              unresolvedTickets,
              workload,
              rating: +(Math.random() * 1.5 + 3.5).toFixed(1), // still dummy
            };
          });

        setAgents(agentUsers);
      } catch (error) {
        toast.error("Failed to load agents");
        console.error("Error fetching agents or tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentsAndTickets();
  }, []);

  // Workload color mapping based on numeric value (0-25)
  const getWorkloadColor = (workload: number) => {
    if (workload >= 20) {
      return "bg-red-300/75 text-red-700"; // Overloaded
    } else if (workload >= 15) {
      return "bg-orange-300/75 text-orange-700"; // Heavy
    } else if (workload >= 8) {
      return "bg-yellow-500/75 text-yellow-700"; // Medium
    } else {
      return "bg-green-300/75 text-green-700"; // Light
    }
  };

  // Get workload category for display
  const getWorkloadCategory = (workload: number) => {
    if (workload >= 20) return "Overloaded";
    if (workload >= 15) return "Heavy";
    if (workload >= 8) return "Medium";
    return "Light";
  };

  // Sort agents
  const sortedAgents = [...agents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: keyof Agent) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-400"
            }
          />
        ))}
        <span className="text-gray-100 text-sm ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-azure-300">Agents</h1>
        <div className="text-sm text-gray-400">
          Total: {agents.length} agents
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <User className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Agents</p>
              <p className="text-white text-xl font-semibold">
                {agents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Unresolved</p>
              <p className="text-white text-xl font-semibold">
                {agents.reduce(
                  (sum, agent) => sum + agent.unresolvedTickets,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Avg Workload</p>
              <p className="text-white text-xl font-semibold">
                {(
                  agents.reduce((sum, agent) => sum + agent.workload, 0) /
                  agents.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Overloaded (≥20)</p>
              <p className="text-white text-xl font-semibold">
                {agents.filter((agent) => agent.workload >= 20).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700 border-b border-slate-800 text-azure-300  font-semibold">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {sortField === "id" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    Info
                    {sortField === "email" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("unresolvedTickets")}
                >
                  <div className="flex items-center gap-2">
                    Unresolved Tickets
                    {sortField === "unresolvedTickets" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("workload")}
                >
                  <div className="flex items-center gap-2">
                    Workload
                    {sortField === "workload" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center gap-2">
                    Rating
                    {sortField === "rating" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-600 divide-y divide-slate-800">
              {sortedAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-azure-500">
                    {agent.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-gray-400 text-xs">
                          {agent.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        size={16}
                        className={
                          agent.unresolvedTickets > 15
                            ? "text-red-400"
                            : agent.unresolvedTickets > 10
                            ? "text-orange-400"
                            : "text-green-400"
                        }
                      />
                      <span className="font-medium">
                        {agent.unresolvedTickets}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-100 text-sm font-medium">
                            {agent.workload}/25
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${getWorkloadColor(
                              agent.workload
                            )}`}
                          >
                            {getWorkloadCategory(agent.workload)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              agent.workload >= 20
                                ? "bg-red-500"
                                : agent.workload >= 15
                                ? "bg-orange-500"
                                : agent.workload >= 8
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${(agent.workload / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    {renderStars(agent.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
