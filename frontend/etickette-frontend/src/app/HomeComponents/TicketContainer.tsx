'use client';

import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import TicketListAgentSide from '../IndividualComponents/AgentSpecific/TicketListAgentSide';
import { TicketDTO } from '../Models/TicketDTO';
import TicketViewing from '../IndividualComponents/TicketViewing';
import PlaceholderTicketViewing from '../IndividualComponents/AgentSpecific/PlaceholderTicketViewing';
import { motion, AnimatePresence } from 'framer-motion';


export default function TicketContainer() {
    const [agentId, setAgentId] = useState<number | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);

    useEffect(() => {
        const storedAgentId = localStorage.getItem('id');
        if (storedAgentId) {
            setAgentId(Number(storedAgentId));
        }
    }, []);

    if (!agentId) return null;

    return (
        <div className="w-full h-full bg-white mt-6 ml-6 shadow-lg font-montserrat flex flex-col">
            <div className="w-full py-2 px-3">
                <div className="border border-border-blue bg-blue-buttons text-white text-sm rounded-lg w-fit flex flex-row px-5 py-1 gap-x-2 items-center">
                    <EnvelopeIcon className="w-6 h-6 text-white" />
                    <p>New Mail</p>
                </div>
            </div>

            <div className="w-full flex-1 bg-bg-of-mc flex flex-row min-h-0">
                <div className="w-fit h-full pb-5 overflow-y-auto">
                    <TicketListAgentSide
                        agentId={agentId}
                        reloadFlag={false}
                        onTicketSelect={(ticket) =>
                            setSelectedTicket((prev) => (prev?.id === ticket.id ? null : ticket))
                        }
                    />
                </div>

                <div className="flex-1 border-l border-border-blue relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selectedTicket ? (
                            <motion.div
                                key={selectedTicket.id}
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ type: 'tween', duration: 0.3 }}
                                className="absolute inset-0 pl-4 pt-4"
                            >
                                <TicketViewing selectedTicket={selectedTicket} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 pl-4 pt-4"
                            >
                                <PlaceholderTicketViewing />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
