"use client";

import React, { useState } from "react";
import { Filter, Table, LayoutGrid, List } from "lucide-react";
import TicketTableView from "@/app/components/all-tickets/TicketTableView";
import TicketKanbanView from "@/app/components/all-tickets/TicketKanbanView";
import TicketListView from "@/app/components/all-tickets/TicketListView";

export default function AllTickets() {
  const [viewMode, setViewMode] = useState("table");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Dummy ticket data
  const tickets = [
    {
      id: "TKT-001",
      description: "Website login issues - users cannot access their accounts",
      category: "Service Outage",
      requestedBy: "john_doe",
      assignedTo: "sarah_smith",
      priority: "High",
    },
    {
      id: "TKT-002",
      description: "Email notifications not working properly",
      category: "Technical Issue",
      requestedBy: "jane_wilson",
      assignedTo: "mike_johnson",
      priority: "Medium",
    },
    {
      id: "TKT-003",
      description: "Database connection timeout errors",
      category: "Security",
      requestedBy: "bob_brown",
      assignedTo: "sarah_smith",
      priority: "Critical",
    },
    {
      id: "TKT-004",
      description: "Mobile app crashes on startup",
      category: "Account Billing",
      requestedBy: "alice_green",
      assignedTo: "david_lee",
      priority: "High",
    },
    {
      id: "TKT-005",
      description: "Slow page loading times on product catalog",
      category: "Feature Request",
      requestedBy: "charlie_davis",
      assignedTo: "mike_johnson",
      priority: "Medium",
    },
    {
      id: "TKT-006",
      description: "Payment gateway integration issues",
      category: "Feedback",
      requestedBy: "emma_white",
      assignedTo: "sarah_smith",
      priority: "Critical",
    },
    {
      id: "TKT-007",
      description: "User profile images not displaying correctly",
      category: "General Inquiry",
      requestedBy: "frank_miller",
      assignedTo: "david_lee",
      priority: "Low",
    },
    {
      id: "TKT-008",
      description: "Search functionality returning incorrect results",
      category: "Service Outage",
      requestedBy: "grace_taylor",
      assignedTo: "mike_johnson",
      priority: "Medium",
    },
    {
      id: "TKT-009",
      description: "SSL certificate expiring soon",
      category: "Service Outage",
      requestedBy: "henry_clark",
      assignedTo: "sarah_smith",
      priority: "High",
    },
    {
      id: "TKT-010",
      description: "API rate limiting causing service disruptions",
      category: "Feedback",
      requestedBy: "ivy_anderson",
      assignedTo: "david_lee",
      priority: "Critical",
    },
  ];

  const uniqueAgents = [...new Set(tickets.map(ticket => ticket.assignedTo))];
  const uniqueCategories = [...new Set(tickets.map(ticket => ticket.category))];

  const filteredTickets = tickets.filter(ticket => {
    const priorityMatch = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const agentMatch = agentFilter === 'all' || ticket.assignedTo === agentFilter;
    const categoryMatch = categoryFilter === 'all' || ticket.category === categoryFilter;
    return priorityMatch && agentMatch && categoryMatch;
  })

  return (
    <div className="p-6 text-azure-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Tickets</h1>
        
        {/* View Mode Toggle */}
        <div className="flex bg-indigo-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-azure-500 shadow-sm text-indigo-600' 
                : 'text-indigo-100 hover:text-indigo-300'
            }`}
          >
            <Table size={16} />
            Table
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === 'kanban' 
                ? 'bg-azure-500 shadow-sm text-indigo-600' 
                : 'text-indigo-100 hover:text-indigo-300'
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-azure-500 shadow-sm text-indigo-600' 
                : 'text-indigo-100 hover:text-indigo-300'
            }`}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className=" bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical" >Critical</option>
          </select>
        </div>
        
        {/* Agent Filter */}
        <div className="flex items-center gap-2">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Agents</option>
            {uniqueAgents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-azure-300">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <TicketTableView tickets={filteredTickets}/>
      )}

      {/* Kanban Views */}
      {viewMode === 'kanban' && (
        <TicketKanbanView tickets={filteredTickets}/>
      )}

      {viewMode === 'list' && (
        <TicketListView tickets={filteredTickets}/>
      )}
    </div>
  );
}
