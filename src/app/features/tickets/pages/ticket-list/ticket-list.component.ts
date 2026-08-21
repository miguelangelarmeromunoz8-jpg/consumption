import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Ticket, TicketPriority, TicketStatus } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  errorMessage = '';

  currentStatus: TicketStatus | '' = '';
  currentPriority: TicketPriority | '' = '';

  statusOptions: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
  priorityOptions: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

  displayedColumns: string[] = ['title', 'status', 'priority', 'createdAt', 'actions'];

  constructor(
    private ticketService: TicketService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService
      .getTickets(this.currentStatus || undefined, this.currentPriority || undefined)
      .subscribe({
        next: (tickets) => {
          this.tickets = tickets;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar los tickets.';
          this.isLoading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadTickets();
  }

  clearFilters(): void {
    this.currentStatus = '';
    this.currentPriority = '';
    this.loadTickets();
  }

  canCreateTicket(): boolean {
    return this.authService.hasRole('client');
  }
}