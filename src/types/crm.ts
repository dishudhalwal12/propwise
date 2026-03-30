export type LeadStatus = "new" | "contacted" | "qualified" | "closed";
export type LeadPriority = "low" | "medium" | "high";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  priority: LeadPriority;
  budgetMin: number;
  budgetMax: number;
  preferences: {
    city?: string;
    type?: string;
    bedrooms?: number;
    notes?: string;
  };
  assignedAgentId: string;
  requestedByUserId?: string;
  status: LeadStatus;
  notes: string;
  linkedPropertyIds: string[];
  nextFollowUpAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Interaction = {
  id: string;
  leadId: string;
  propertyId?: string;
  agentId: string;
  type: "call" | "email" | "meeting" | "viewing";
  notes: string;
  interactionAt: Date | string;
  outcome: string;
};

export type Viewing = {
  id: string;
  propertyId: string;
  leadId: string;
  agentId: string;
  scheduledAt: Date | string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type LeadQueryOptions = {
  assignedAgentId?: string;
  requestedByUserId?: string;
};

export type InteractionQueryOptions = {
  agentId?: string;
  leadId?: string;
};

export type ViewingQueryOptions = {
  agentId?: string;
  leadId?: string;
};
