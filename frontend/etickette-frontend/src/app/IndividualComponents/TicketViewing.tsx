'use client';

import { useEffect, useState } from 'react';
import { UserIcon } from '@heroicons/react/16/solid';
import { TicketDTO, TicketStatus } from '../Models/TicketDTO';
import { getStyle, priorityPinStyles, statusPinStyles } from '../HelperMethods/ColorChangeCSS';
import CommentSend from './CommentSend';
import { getCommentsByTicket, updateTicket } from '@/utils/api';
import { CommentDTO } from '../Models/CommentDTO';
import CommentList from './CommentList';

type TicketViewingProps = {
  selectedTicket: TicketDTO;
};

export default function TicketViewing({ selectedTicket }: TicketViewingProps) {

  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<TicketStatus>(selectedTicket.status);

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const isAgent = role === "AGENT";


  const statuses: TicketStatus[] = [
    TicketStatus.IN_PROGRESS,
    TicketStatus.RESOLVED
  ];

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedTicket.id) return;
      try {
        setLoading(true);
        const fetched = await getCommentsByTicket(selectedTicket.id);

        // Oldest first
        const sorted = [...fetched].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });

        setComments(sorted);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [selectedTicket.id]);

  const handleSelect = async (newStatus: TicketStatus) => {
    if (!selectedTicket.id) {
      console.error("Cannot update ticket: ID is missing");
      return;
    }
    try {
      setStatus(newStatus);
      setIsOpen(false);

      const updatedTicket: TicketDTO = {
        ...selectedTicket,
        status: newStatus
      };

      await updateTicket(selectedTicket.id, updatedTicket);
      console.log(`Ticket #${selectedTicket.id} status updated to ${newStatus}`);
      alert(`Ticket #${selectedTicket.id} status updated to ${newStatus}`);
      window.location.reload();
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setStatus(selectedTicket.status);
    }
  };

  return (
    <div className="bg-white ml-5 p-13 rounded-ss-xl h-full w-full flex flex-col font-montserrat">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="w-full flex flex-row items-end relative">
          <p className="text-[21px] font-bold text-dark-text w-fit max-w-3/4 h-fit">
            Ticket #{selectedTicket.id} - {selectedTicket.title}
          </p>

          <button
            onClick={isAgent ? () => setIsOpen(!isOpen) : undefined}
            disabled={!isAgent}
            className={`text-[9px] font-normal w-fit h-fit rounded-lg
            px-5 py-0.5 border border-border-blue mb-1 ml-5 cursor-pointer
            ${!isAgent ? "opacity-50 cursor-not-allowed" : ""}
            ${getStyle(status, statusPinStyles)}`}
          >
            {status}
          </button>


          {isOpen && (
            <div className="absolute top-full left-[calc(21ch+2rem)] mt-1 bg-white border border-gray-200 rounded shadow-md z-10">
              {statuses.map((s) => (
                <p
                  key={s}
                  onClick={() => handleSelect(s)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-xs"
                >
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex flex-row items-end h-[15%]">
          <div
            className={`h-2/5 w-[3%] border border-radius rounded-full
              ${getStyle(selectedTicket.priority, priorityPinStyles)}`}
          />
          <p
            className="font-normal text-[9px] px-5 py-0.5 
              border border-border-blue bg-gray-category ml-3 rounded-lg
              text-white"
          >
            {selectedTicket.category}
          </p>
        </div>

        <div className="flex flex-row mt-5">
          <div>
            <UserIcon
              className="w-12 h-12 mx-auto my-auto text-white
                bg-icons rounded-full p-2 border border-border-blue"
            />
          </div>
          <div className="flex flex-col text-lg px-3">
            <p className="font-medium">{selectedTicket.client.username}</p>
            <p className="font-light italic text-[11px] text-black/60">
              {selectedTicket.client.email}
            </p>
            <p className="font-normal text-sm mt-3">{selectedTicket.description}</p>
            <CommentList comments={comments} loading={loading} />
          </div>
        </div>
      </div>

      {selectedTicket.id !== undefined && (
        <CommentSend
          ticketId={selectedTicket.id}
          onCommentAdded={(newComment) => {
            setComments((prev) => [...prev, newComment]);
          }}
        />
      )}
    </div>
  );
}
