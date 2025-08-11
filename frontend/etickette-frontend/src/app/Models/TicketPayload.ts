import { TicketDTO } from "./TicketDTO";

export interface TicketPayload {
    title: string;
    description: string;
    status: TicketDTO["status"];
    category: TicketDTO["category"];
    client: {
        id: number;
    };
}
