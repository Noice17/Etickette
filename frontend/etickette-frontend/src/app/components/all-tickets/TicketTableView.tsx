import React from "react";

export interface Ticket {
  id: string;
  description: string;
  category: string;
  requestedBy: string;
  assignedTo: string;
  priority: string;
}

interface TicketTableViewProps {
  tickets: Ticket[];
}

const TicketTableView: React.FC<TicketTableViewProps> = ({ tickets }) => {
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

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700 font-semibold border-b border-b-slate-800">
            <tr className="text-left text-[9px] uppercase">
              <th className="px-6 py-3 tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 tracking-wider">
                Description
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
            </tr>
          </thead>
          <tbody className="bg-slate-600 divide-y divide-slate-800">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-azure-500">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-100 max-w-md">
                  <div className="truncate">{ticket.description}</div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTableView;
