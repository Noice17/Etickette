import React, { useState } from "react";
import Pagination from "../Pagination";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  requestedBy: string;
  assignedTo: string;
  priority: string;
  status: string;
}

interface TicketListViewProps {
  tickets: Ticket[];
}

const TicketListView: React.FC<TicketListViewProps> = ({ tickets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Slice tickets for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-300/75 text-red-700";
      case "High":
        return "bg-orange-300/75 text-orange-700";
      case "Medium":
        return "bg-yellow-500/75 text-yellow-700";
      case "Low":
        return "bg-green-300/75 text-green-700";
      default:
        return "bg-gray-100/75 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-300/75 text-blue-700";
      case "IN_PROGRESS":
        return "bg-yellow-300/75 text-yellow-700";
      case "RESOLVED":
        return "bg-green-300/75 text-green-700";
      case "CLOSED":
        return "bg-gray-300/75 text-gray-700";
      default:
        return "bg-purple-300/75 text-purple-700";
    }
  };

  return (
    <div className="space-y-4">
      {currentTickets.map((ticket) => (
        <div
          key={ticket.id}
          className="bg-slate-600 rounded-lg p-6 hover:bg-slate-700 transition-colors duration-150"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-azure-500">
                {ticket.id}
              </h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="mb-4 text-gray-100 text-base leading-relaxed">
            <div className="font-semibold">{ticket.title}</div>
            <div className="truncate text-xs text-slate-400">
              {ticket.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-400 uppercase tracking-wide text-xs font-medium">
                Category
              </span>
              <p className="text-gray-100 mt-1">{ticket.category}</p>
            </div>

            <div>
              <span className="text-gray-400 uppercase tracking-wide text-xs font-medium">
                Requested By
              </span>
              <p className="text-gray-100 mt-1">{ticket.requestedBy}</p>
            </div>

            <div>
              <span className="text-gray-400 uppercase tracking-wide text-xs font-medium">
                Assigned To
              </span>
              <p className="text-gray-100 mt-1">{ticket.assignedTo}</p>
            </div>

            <div className="">
              <span className="text-gray-400 uppercase tracking-wide text-xs font-medium">
                Status
              </span>
              <div>
                <p
                  className={`inline-flex text-gray-100 mt-1 p-1 text-xs font-semibold rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tickets found</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default TicketListView;
