import { Agent } from "./Agent";
import { User } from "./User";

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',  // updated from PENDING
    CLOSED = 'CLOSED',
    QUEUED = 'QUEUED'
}


export enum TicketCategory {
    SERVICE_OUTAGE = "SERVICE_OUTAGE",
    SECURITY = "SECURITY",
    TECHNICAL_ISSUE = "TECHNICAL_ISSUE",
    ACCOUNT_BILLING = "ACCOUNT_BILLING",
    FEATURE_REQUEST = "FEATURE_REQUEST",
    FEEDBACK = "FEEDBACK",
    GENERAL_INQUIRY = "GENERAL_INQUIRY"
}

export interface TicketDTO {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus; 
  category: TicketCategory; 
  priority: string;
  createdAt?: string; 
  updatedAt?: string;
  resolvedAt?: string;
  rating?: number;
  client: User;
  agent?:Agent;
}
