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
  userId: number;
  username: string;
  email: string;
  maxWorkload: number;
  currentWorkload: number;
  averageRating: number;
  ratingCount: number;
  unresolvedTickets: number; // computed
}

export default function ViewAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Agent>("userId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchAgentsAndTickets = async () => {
      try {
        const [agentsRes, ticketsRes] = await Promise.all([
          apiFetch("/agents"),
          apiFetch("/tickets/all"),
        ]);

        if (!agentsRes.ok || !ticketsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const agentsData = await agentsRes.json();
        const ticketsData = await ticketsRes.json();

        const agentUsers: Agent[] = agentsData.map((agent: any) => {
          const unresolvedTickets = ticketsData.filter(
            (ticket: any) =>
              ticket.agent?.userId === agent.userId &&
              ticket.resolvedAt === null
          ).length;

          return {
            userId: agent.userId,
            username: agent.username,
            email: agent.email,
            maxWorkload: agent.maxWorkload,
            currentWorkload: agent.currentWorkload,
            averageRating: agent.averageRating,
            ratingCount: agent.ratingCount,
            unresolvedTickets,
          };
        });

        setAgents(agentUsers);
      } catch (error) {
        toast.error("Failed to load agents or tickets");
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
                  agents.reduce((sum, agent) => sum + agent.currentWorkload, 0) /
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
                {agents.filter((agent) => agent.currentWorkload >= 20).length}
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
                  onClick={() => handleSort("userId")}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {sortField === "userId" && (
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
                  onClick={() => handleSort("currentWorkload")}
                >
                  <div className="flex items-center gap-2">
                    Workload
                    {sortField === "currentWorkload" && (
                      <span className="text-azure-400">
                        {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("averageRating")}
                >
                  <div className="flex items-center gap-2">
                    Rating
                    {sortField === "averageRating" && (
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
                  key={agent.userId}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-azure-500">
                    AGT-{agent.userId.toString().padStart(3, "0")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{agent.username}</div>
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
                            {agent.currentWorkload}/25
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${getWorkloadColor(
                              agent.currentWorkload
                            )}`}
                          >
                            {getWorkloadCategory(agent.currentWorkload)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              agent.currentWorkload >= 20
                                ? "bg-red-500"
                                : agent.currentWorkload >= 15
                                ? "bg-orange-500"
                                : agent.currentWorkload >= 8
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${(agent.currentWorkload / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    {renderStars(agent.averageRating)}
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
