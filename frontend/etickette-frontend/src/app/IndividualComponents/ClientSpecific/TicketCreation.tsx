import TicketFiling from "./TicketFiling";
import TicketListClientSide from "./TicketListClientSide";

interface TicketCreationProps {
  clientId: number | null;
}

export default function TicketCreation({ clientId }: TicketCreationProps) {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex-1 px-10 pt-8">
        {clientId !== null && <TicketFiling clientId={clientId} />}
      </div>
      <div className="w-fit h-full overflow-hidden">
        {clientId !== null && <TicketListClientSide clientId={clientId} />}
      </div>
    </div>
  );
}
