import React from "react";

export interface Ticket {
  id: string;
  description: string;
  category: string;
  requestedBy: string;
  assignedTo: string;
  priority: string;
}

interface TicketKanbanViewProps {
  tickets: Ticket[];
}

const TicketKanbanView: React.FC<TicketKanbanViewProps> = ({ tickets }) => {
  // Priority columns configuration
  const priorities = [
    {
      name: "Low",
      color: "bg-green-300/75 text-green-700",
      headerColor: "bg-green-600 border-green-500",
    },
    {
      name: "Medium", 
      color: "bg-yellow-500/75 text-yellow-700",
      headerColor: "bg-yellow-600 border-yellow-500",
    },
    {
      name: "High",
      color: "bg-orange-300/75 text-orange-700", 
      headerColor: "bg-orange-500 border-orange-300",
    },
    {
      name: "Critical",
      color: "bg-red-300/75 text-red-700",
      headerColor: "bg-red-500 border-red-300",
    },
  ];

  // Filter tickets by priority
  const getTicketsByPriority = (priority: string) => {
    return tickets.filter(ticket => ticket.priority === priority);
  };

  // Priority color mapping for badges
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
    <div className="h-full">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {priorities.map((priority) => {
          const columnTickets = getTicketsByPriority(priority.name);
          
          return (
            <div key={priority.name} className="flex flex-col h-full">
              {/* Column Header */}
              <div className={`${priority.headerColor} rounded-t-lg px-4 py-3 border-b-2`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
                    {priority.name}
                  </h3>
                  <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {columnTickets.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-slate-700 rounded-b-lg p-4 min-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-600 rounded-lg p-4 hover:bg-slate-500 transition-colors duration-150 border border-slate-500 cursor-pointer"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-azure-500 font-semibold text-sm">
                          {ticket.id}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-100 text-sm mb-3 line-clamp-3">
                        {ticket.description}
                      </p>

                      {/* Category */}
                      <div className="mb-3">
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Category
                        </span>
                        <p className="text-gray-100 text-sm">{ticket.category}</p>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-slate-500 pt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <div>
                            <span className="text-gray-400">Requested:</span>
                            <span className="text-gray-100 ml-1">{ticket.requestedBy}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <div>
                            <span className="text-gray-400">Assigned:</span>
                            <span className="text-gray-100 ml-1">{ticket.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {columnTickets.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No {priority.name.toLowerCase()} priority tickets</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tickets found</p>
        </div>
      )}
    </div>
  );
};

export default TicketKanbanView;