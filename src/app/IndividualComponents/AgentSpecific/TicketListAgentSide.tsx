'use client';

import { useEffect, useState } from 'react';
import { getTicketsByAgent, updateTicket } from '../../api';
import { TicketDTO, TicketStatus } from '../../Models/TicketDTO';
import { getStyle, priorityPinStyles, statusCardStyles, statusTextStyles, statusPinStyles } from '../../HelperMethods/ColorChangeCSS';

type Props = {
    agentId: number;
    reloadFlag: boolean;
    onTicketSelect: (ticket: TicketDTO) => void;
};

export default function TicketListAgentSide({ agentId, reloadFlag, onTicketSelect }: Props) {
    const [tickets, setTickets] = useState<TicketDTO[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await getTicketsByAgent(agentId);

                const sortedTickets = res.sort((a, b) => {
                    const statusOrder = (status: string) => status === TicketStatus.OPEN ? 0 : 1;
                    const statusDiff = statusOrder(a.status) - statusOrder(b.status);
                    if (statusDiff !== 0) return statusDiff;

                    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
                });

                setTickets(sortedTickets);
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
            }
        };


        fetchTickets();
    }, [agentId, reloadFlag]);


    const handleTicketClick = async (ticket: TicketDTO) => {
        if (!ticket.id) return;

        if (ticket.status === TicketStatus.OPEN) {
            try {
                const updatedTicket = { ...ticket, status: TicketStatus.IN_PROGRESS };

                await updateTicket(ticket.id, updatedTicket);

                setTickets(prevTickets =>
                    prevTickets.map(t =>
                        t.id === ticket.id ? updatedTicket : t
                    )
                );

                onTicketSelect(updatedTicket);
            } catch (error) {
                console.error("Failed to update ticket status:", error);
            }
        } else {
            onTicketSelect(ticket);
        }
    };


    return (
        <div className="w-[20rem]">
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket)}
                    className={`font-montserrat m-2 py-3 px-4 rounded-lg cursor-pointer 
                    hover:opacity-90 transition ${getStyle(ticket.status, statusCardStyles)}`}
                >
                    <p className="text-xs font-semibold">{ticket.client.username}</p>
                    <p className={`text-lg font-bold truncate overflow-hidden whitespace-nowrap
                        ${getStyle(ticket.status, statusTextStyles)}`}>
                        Ticket #{ticket.id} - {ticket.title}
                    </p>
                    <p className="text-[11px] font-light">
                        {ticket.description.length > 40
                            ? ticket.description.slice(0, 40) + '...'
                            : ticket.description}
                    </p>
                    <div className="w-full flex flex-row justify-between font-normal text-center mt-2">
                        <p className="text-[9px] w-[30%] border border-border-blue py-0.5 px-1.5 rounded-lg 
                        truncate overflow-hidden whitespace-nowrap bg-gray-category text-white">
                            {ticket.category}
                        </p>
                        <p className={`text-[9px] w-[30%] border border-border-blue py-0.5 px-2 rounded-lg 
                        truncate overflow-hidden whitespace-nowrap ${getStyle(ticket.priority, priorityPinStyles)}`}>
                            {ticket.priority}
                        </p>
                        <p className={`text-[9px] w-[30%] border border-border-blue py-0.5 px-2 rounded-lg 
                        truncate overflow-hidden whitespace-nowrap ${getStyle(ticket.status, statusPinStyles)}`}>
                            {ticket.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
