import { apiFetch } from "@/utils/apiFetch";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentAdded?: () => void;
}

export default function AddAgentModal({
  isOpen,
  onClose,
  onAgentAdded,
}: AddAgentModalProps) {
  const [show, setShow] = useState(isOpen);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGENT");
  const [loading, setLoading] = useState(false);

  // Handle fade-out before unmount
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 200); // matches transition duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!res.ok) throw new Error("Failed to add agent");

      toast.success("Agent added successfully!");
      if (onAgentAdded) onAgentAdded();
      onClose();
    } catch (error) {
      toast.error("Error adding agent");
      console.error("Error adding agent:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0"
      }`}
      onClick={onClose} // click outside closes
    >
      <div
        className={`bg-slate-700 p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-azure-300">Add New Agent</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-indigo-400 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              className="w-full bg-slate-600 text-white rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              className="w-full bg-slate-600 text-white rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-white">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              className="w-full bg-slate-600 text-white rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="hidden">
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="AGENT">AGENT</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
            >
              {loading ? "Adding..." : "Add Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
