import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTicketRequest, Ticket, TicketPriority, TicketStatus, UpdateTicketRequest } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getTickets(status?: TicketStatus, priority?: TicketPriority): Observable<Ticket[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(data: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, data);
  }

  updateTicket(id: string, data: UpdateTicketRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, data);
  }

  assignTicket(id: string, agentId: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/assign`, { agentId });
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}