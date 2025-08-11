import { apiFetch } from "@/utils/apiFetch";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ConfirmGeneratePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePDF?: () => void;
}

export default function ConfirmGeneratePDFModal({
  isOpen,
  onClose,
  onGeneratePDF,
}: ConfirmGeneratePDFModalProps) {
  const [show, setShow] = useState(isOpen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/reports/metrics", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Report Generated on new window");
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error("Error generating PDF");
      console.error("Error generating PDF: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-slate-700 p-6 h-50 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-azure-300">
            Do you want to generate a PDF?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-indigo-400 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center gap-2 pt-7">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={loading}
            className={`px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 flex items-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
