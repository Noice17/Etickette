export enum TicketCategory {
  SERVICE_OUTAGE = "SERVICE_OUTAGE",
  SECURITY = "SECURITY",
  TECHNICAL_ISSUE = "TECHNICAL_ISSUE",
  ACCOUNT_BILLING = "ACCOUNT_BILLING",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  FEEDBACK = "FEEDBACK",
  GENERAL_INQUIRY = "GENERAL_INQUIRY",
}

// This is used in your UI dropdown
export const ticketCategories: { label: string; value: TicketCategory }[] = [
  { label: "[Service Outage] System or Platform is Down", value: TicketCategory.SERVICE_OUTAGE },
  { label: "[Security Concern] Account or Data at Risk", value: TicketCategory.SECURITY },
  { label: "[Technical Issue] App or Feature Not Working Properly", value: TicketCategory.TECHNICAL_ISSUE },
  { label: "[Account/Billing] Payment, Invoice, or Subscription Help", value: TicketCategory.ACCOUNT_BILLING },
  { label: "[Feature Request] Suggestion to Improve the System", value: TicketCategory.FEATURE_REQUEST },
  { label: "[Feedback] Comment or Experience About the Service", value: TicketCategory.FEEDBACK },
  { label: "[General Inquiry] Questions Not Covered Above", value: TicketCategory.GENERAL_INQUIRY },
];
