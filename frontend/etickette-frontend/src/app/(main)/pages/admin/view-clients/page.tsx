"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Ticket,
  CheckCircle,
  Clock,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  liveTickets: number;
  resolvedTickets: number;
}

export default function ViewClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Client>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const [clientsRes, ticketsRes] = await Promise.all([
          apiFetch("/users"),
          apiFetch("/tickets/all"),
        ]);

        if (!clientsRes.ok || !ticketsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const clientsData = await clientsRes.json();
        const ticketsData = await ticketsRes.json();

        const clientUsers: Client[] = clientsData
          .filter((user: any) => user.role === "CLIENT")
          .map((client: any) => {
            const liveTickets = ticketsData.filter(
              (ticket: any) =>
                ticket.client?.id === client.id && ticket.resolvedAt === null
            ).length;

            const resolvedTickets = ticketsData.filter(
              (ticket: any) =>
                ticket.client?.id === client.id && ticket.resolvedAt !== null
            ).length;

            return {
              id: client.id,
              name: client.username,
              email: client.email,
              liveTickets,
              resolvedTickets,
            };
          });

        setClients(clientUsers);
      } catch (error) {
        toast.error("Failed to load clients or tickets");
        console.error("Error fetching agents or tickets:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchClients();
  }, []);

  const sortedClients = [...clients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate totals and averages
  const totalLiveTickets = clients.reduce(
    (sum, client) => sum + client.liveTickets,
    0
  );
  const totalResolvedTickets = clients.reduce(
    (sum, client) => sum + client.resolvedTickets,
    0
  );
  const avgLiveTickets = (totalLiveTickets / clients.length).toFixed(1);
  const clientsWithLiveTickets = clients.filter(
    (client) => client.liveTickets > 0
  ).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-azure-300">Clients</h1>
        <div className="text-sm text-gray-400">
          Total: {clients.length} clients
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <User className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Clients</p>
              <p className="text-white text-xl font-semibold">
                {clients.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Live Tickets</p>
              <p className="text-white text-xl font-semibold">
                {totalLiveTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Resolved</p>
              <p className="text-white text-xl font-semibold">
                {totalResolvedTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
          <div className="flex items-center gap-3">
            <Ticket className="text-yellow-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">
                Clients with Active Tickets
              </p>
              <p className="text-white text-xl font-semibold">
                {clientsWithLiveTickets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-azure-300 font-bold text-lg">Loading...</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-800 text-azure-300 font-semibold">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      Client ID
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
                    onClick={() => handleSort("liveTickets")}
                  >
                    <div className="flex items-center gap-2">
                      Live Tickets
                      {sortField === "liveTickets" && (
                        <span className="text-azure-400">
                          {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => handleSort("resolvedTickets")}
                  >
                    <div className="flex items-center gap-2">
                      Resolved Tickets
                      {sortField === "resolvedTickets" && (
                        <span className="text-azure-400">
                          {sortDirection === "asc" ? <SortAsc /> : <SortDesc />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Total Tickets
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-600 divide-y divide-slate-800">
                {sortedClients.map((client) => {
                  const totalTickets =
                    client.liveTickets + client.resolvedTickets;
                  const resolutionRate =
                    totalTickets > 0
                      ? ((client.resolvedTickets / totalTickets) * 100).toFixed(
                          1
                        )
                      : "0";

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-azure-500">
                        CLT-{client.id.toString().padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-gray-400 text-xs">
                              {client.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={16}
                            className={
                              client.liveTickets > 3
                                ? "text-red-400"
                                : client.liveTickets > 1
                                ? "text-orange-400"
                                : client.liveTickets > 0
                                ? "text-yellow-400"
                                : "text-green-400"
                            }
                          />
                          <span className="font-medium">
                            {client.liveTickets}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="font-medium">
                            {client.resolvedTickets}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                        <div className="flex flex-col">
                          <span className="font-medium">{totalTickets}</span>
                          <span className="text-xs text-gray-400">
                            {resolutionRate}% resolved
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
