export type Method = "uuid" | "hmac" | "jwt";

export interface Ticket {
  ticket_id: string;
  user_id: number;
  event_id: number;
  qr_code_path: string;
  used?: boolean;
  token?: string;
}

export interface TicketResponse {
  message: string;
  ticket: Ticket;
  token?: string;
}
