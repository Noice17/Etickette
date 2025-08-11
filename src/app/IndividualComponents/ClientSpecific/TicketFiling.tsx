'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ticketCategories, TicketCategory } from '../../Models/TicketCategory';
import { useState } from 'react';
import { createTicket } from '../../api';// adjust path as needed
import { TicketPayload } from '../../Models/TicketPayload'; // adjust path as needed
import { TicketStatus } from '../../Models/TicketDTO';

type TicketFilingProps = {
    clientId: number; // pass this from a parent or from context
};

export default function TicketFiling({ clientId }: TicketFilingProps) {
    const [selectedCategory, setSelectedCategory] = useState<TicketCategory | ''>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory || !description) {
            alert("Please complete all fields.");
            return;
        }

        const ticketPayload: TicketPayload = {
            title,
            description,
            status: TicketStatus.OPEN,
            category: selectedCategory as TicketCategory,
            client: { id: clientId },
        };

        try {
            setLoading(true);
            console.log("Sending payload:", ticketPayload);
            const created = await createTicket(ticketPayload);
            console.log("Ticket created:", created);
            alert("Ticket sent!");

            setSelectedCategory('');
            setDescription('');

            window.location.reload();
        } catch (err) {
            console.error("Failed to create ticket:", err);
            alert("Failed to send ticket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-ss-xl rounded-se-xl flex flex-col font-montserrat">
            <div className="w-full h-1/6 flex items-end pl-5">
                <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex flex-row text-white gap-x-1 items-center justify-center
          bg-bg-og-bg-of-mc w-fit px-5 py-1 rounded-lg cursor-pointer"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <p className="font-bold text-lg">{loading ? "Sending..." : "Send"}</p>
                </button>
            </div>

            <form className="w-full flex-1 flex flex-col overflow-hidden">
                <span className="w-full h-1/6 px-5 pt-3 flex items-end">
                    <select
                        className={`w-full h-fit text-xl font-bold bg-transparent
                        border-b border-bg-og-bg-of-mc appearance-none
                        focus:outline-none focus:ring-0 focus:border-none
                        ${selectedCategory === '' ? 'text-bg-og-bg-of-mc' : 'text-dark-text'}`}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as TicketCategory)}
                    >
                        <option value="">Subject</option>
                        {ticketCategories.map(({ label, value }) => (
                            <option key={value} value={value} className="text-sm text-dark-text">
                                {label}
                            </option>
                        ))}
                    </select>


                </span>

                <span className="w-full flex-1 overflow-y-auto px-5 py-5 flex flex-col">
                    <input
                        className="w-full h-1/6 resize-none outline-none placeholder-bg-og-bg-of-mc text-dark-text font-semibold"
                        placeholder='Title here'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full flex-1 resize-none outline-none placeholder-bg-og-bg-of-mc
              text-dark-text"
                        placeholder="Write your message here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </span>
            </form>
        </div>
    );
}
