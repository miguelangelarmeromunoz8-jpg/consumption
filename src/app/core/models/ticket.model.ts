export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: string;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  agentId?: string;
}

export interface TicketListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketListResponse {
  data: Ticket[];
  meta: TicketListMeta;
}