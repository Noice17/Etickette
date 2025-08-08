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

interface TicketTableViewProps {
  tickets: Ticket[];
}

const TicketTableView: React.FC<TicketTableViewProps> = ({ tickets }) => {
  const[currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =  5;

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
    switch (status){
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
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700 font-semibold border-b border-b-slate-800">
            <tr className="text-left text-xs uppercase">
              <th className="px-6 py-3 tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 tracking-wider">
                Info
              </th>
              <th className="px-6 py-3 tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 tracking-wider">
                Requested By
              </th>
              <th className="px-6 py-3 tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-600 divide-y divide-slate-800">
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-azure-500">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-100 max-w-md">
                  <div className="font-semibold">{ticket.title}</div>
                  <div className="truncate text-[11px] text-slate-400">{ticket.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-100 max-w-md">
                  {ticket.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 ">
                  {ticket.requestedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {ticket.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default TicketTableView;
