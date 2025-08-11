"use client";

import { useEffect, useState } from "react";
import { getTicketsByClient, getTicketsByAgent, rateAgent } from "@/utils/api";
import { TicketDTO } from "@/app/Models/TicketDTO";
import {
    getStyle,
    statusClientCardStyles,
    statusClientPinStyles,
} from "../../HelperMethods/ColorChangeCSS";
import TicketViewing from "../TicketViewing";
import _Rating from "react-rating";
const Rating: any = _Rating;

interface TicketListClientSideProps {
    clientId: number;
}

export default function ResolvedTickets({ clientId }: TicketListClientSideProps) {
    const [tickets, setTickets] = useState<TicketDTO[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        // Store role in state para reactive
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);

        const fetchTickets = async () => {
            try {
                let result: TicketDTO[] = [];

                if (storedRole === "CLIENT") {
                    result = await getTicketsByClient(clientId);
                } else if (storedRole === "AGENT") {
                    result = await getTicketsByAgent(clientId);
                } else {
                    console.warn("Unknown role:", storedRole);
                    return;
                }

                const filteredTickets = result.filter(
                    ticket => ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                );

                const sortedTickets = [...filteredTickets].sort((a, b) => {
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

    const ratingChanged = async (ticketId: number, newRating: number) => {
        try {
            await rateAgent(ticketId, newRating);
            setTickets(prev =>
                prev.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, rating: newRating }
                        : ticket
                )
            );
            alert("Ratings received!");
            window.location.reload();
        } catch (error) {
            console.error("Failed to rate ticket:", error);
        }
    };

    return (
        <div className="p-4 w-full columns-3 gap-4">
            {tickets.map(ticket => {
                const isReadOnly = role === "AGENT" || ticket.status === "CLOSED";

                return (
                    <div
                        key={ticket.id}
                        className={`break-inside-avoid font-montserrat mb-4 py-3 px-4 rounded-lg cursor-pointer 
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
                        <div className="w-full flex flex-row justify-between font-normal text-center mt-2 text-white">
                            <p className="text-[9px] w-[45%] border border-border-blue py-0.5 rounded-lg bg-gray-category">
                                {ticket.category}
                            </p>
                            <p className={`text-[9px] w-[45%] border border-border-blue py-0.5 rounded-lg 
                                ${getStyle(ticket.status, statusClientPinStyles)}`}>
                                {ticket.status}
                            </p>
                        </div>
                        <div className="flex items-center justify-center mt-2 h-8">
                            {ticket.id !== undefined && (
                                <Rating
                                    initialRating={ticket.rating ?? 0}
                                    readonly={isReadOnly}
                                    onChange={
                                        isReadOnly
                                            ? undefined
                                            : (newRating: number) =>
                                                ratingChanged(ticket.id!, newRating)
                                    }
                                    emptySymbol={<span className="text-2xl text-gray-300">★</span>}
                                    fullSymbol={<span className="text-2xl text-yellow-500">★</span>}
                                    fractions={2}
                                    step={1}
                                />
                            )}
                        </div>
                    </div>
                );
            })}

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
