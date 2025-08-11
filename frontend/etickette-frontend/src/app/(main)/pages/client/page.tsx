"use client";
import { useEffect, useState } from "react";
import Header from "@/app/HomeComponents/Header";
import Toolbar from "@/app/HomeComponents/Toolbar";
import DropDownMenu from "@/app/HomeComponents/DropDownMenu";
import TicketCreation from "@/app/IndividualComponents/ClientSpecific/TicketCreation";
import ResolvedTickets from "@/app/IndividualComponents/ClientSpecific/ResolvedTickets";

export default function ClientHome() {
  const [clientId, setClientId] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<"inbox" | "resolved">(
    "inbox"
  );

  useEffect(() => {
    const idString = localStorage.getItem("id");
    if (idString) {
      const parsedId = parseInt(idString, 10);
      if (!isNaN(parsedId)) {
        setClientId(parsedId);
        console.log("localStorage id:", parsedId);
      }
    }
  }, []);

  return (
    <div className="bg-white w-full h-screen flex flex-col overflow-hidden">
      <div className="w-full h-1/6">
        <Header />
      </div>
      <div className="w-full flex-1 bg-bg-og-bg-of-mc flex flex-row min-h-0">
        <div className="w-[6%] h-full bg-bg-of-toolbar">
          <Toolbar />
        </div>
        <div className="w-[15%] h-full bg-bg-of-dropdown">
          <DropDownMenu onSelect={setSelectedView} />
        </div>
        <div className="flex-1 h-full w-full flex flex-row">
          {clientId !== null ? (
            selectedView === "inbox" ? (
              <TicketCreation clientId={clientId} />
            ) : (
              <ResolvedTickets clientId={clientId} />
            )
          ) : (
            <div className="p-4 text-red-500">⚠ No client ID found</div>
          )}
        </div>
      </div>
    </div>
  );
}
