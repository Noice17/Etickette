import React from "react";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  requestedBy: string;
  assignedTo: string;
  priority: string;
}

interface TicketListViewProps {
  tickets: Ticket[];
}

const TicketListView: React.FC<TicketListViewProps> = ({ tickets }) => {
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
    <div className="space-y-4">
      {tickets.map((ticket) => (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
          </div>
        </div>
      ))}

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tickets found</p>
        </div>
      )}
    </div>
  );
};

export default TicketListView;
