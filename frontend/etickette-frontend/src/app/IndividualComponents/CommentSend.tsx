import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createComment } from "@/utils/api";
import { CommentDTO } from "../Models/CommentDTO";

type CommentSendProps = {
  ticketId: number;
  onCommentAdded: (comment: CommentDTO) => void;
};

export default function CommentSend({ ticketId, onCommentAdded }: CommentSendProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("id");
    if (!message.trim() || !userId) return;

    const payload: CommentDTO = {
      message,
      ticketId,
      userId: Number(userId),
    };

    try {
      const newComment = await createComment(payload);
      onCommentAdded(newComment); // notify parent
      setMessage("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex p-2 border-t border-border-blue sticky bottom-0 bg-white
      font-montserrat"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-border-blue rounded-lg pl-3 pr-10 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-border-blue focus:border-blue-active"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-buttons"
        >
          <PaperAirplaneIcon className="w-5 h-5 rotate-320" />
        </button>
      </div>
    </form>
  );
}
