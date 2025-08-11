"use client";

import { useEffect, useState } from "react";
import { getTicketsByClient } from "@/utils/api";
import { TicketDTO } from "@/app/Models/TicketDTO";
import {
  getStyle,
  statusClientCardStyles,
  statusClientPinStyles,
} from "../../HelperMethods/ColorChangeCSS";
import TicketViewing from "../TicketViewing"; // Import your existing component

interface TicketListClientSideProps {
  clientId: number;
}

export default function TicketListClientSide({
  clientId,
}: TicketListClientSideProps) {
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const result = await getTicketsByClient(clientId);

        const sortedTickets = [...result].sort((a, b) => {
          if (a.status === "OPEN" && b.status !== "OPEN") return -1;
          if (a.status !== "OPEN" && b.status === "OPEN") return 1;

          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return dateB - dateA;
        });

        setTickets(sortedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [clientId]);

  return (
    <div className="p-4 overflow-y-auto h-full">
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className={`w-[20rem] font-montserrat m-2 py-3 px-4 rounded-lg cursor-pointer 
              ${getStyle(ticket.status, statusClientCardStyles)}
              hover:opacity-90 transition`}
          >
            <p className="text-xs font-semibold">
              {ticket.client.username ?? "Client Sender"}
            </p>
            <p className="text-lg font-bold">
              Ticket #{ticket.id} - {ticket.title}
            </p>
            <p className="text-[11px] font-light">
              {ticket.description.length > 50
                ? ticket.description.slice(0, 47) + "..."
                : ticket.description}
            </p>
            <div className="w-64 flex flex-row justify-between font-normal text-center mt-2 text-white">
              <p className="text-[9px] w-[45%] border border-border-blue py-0.5 rounded-lg bg-gray-category">
                {ticket.category}
              </p>
              <p
                className={`text-[9px] w-[45%] border border-border-blue py-0.5 rounded-lg 
                  ${getStyle(ticket.status, statusClientPinStyles)}`}
              >
                {ticket.status}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-3/5 h-3/4 overflow-hidden relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <TicketViewing selectedTicket={selectedTicket} />
          </div>
        </div>
      )}
    </div>
  );
}
