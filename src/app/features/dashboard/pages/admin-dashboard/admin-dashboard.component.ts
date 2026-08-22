import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TicketService } from '../../../../core/services/ticket.service';
import { UserService } from '../../../../core/services/user.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin({
  ticketsResponse: this.ticketService.getTickets(),
  users: this.userService.getUsers(),
}).subscribe({
  next: ({ ticketsResponse, users }) => {
    this.tickets = ticketsResponse.data;
    this.users = users;
    this.isLoading = false;
  },
      error: () => {
        this.errorMessage = 'Error al cargar los datos del panel de administración.';
        this.isLoading = false;
      },
    });
  }

  get openCount(): number {
    return this.tickets.filter((t) => t.status === 'open').length;
  }

  get inProgressCount(): number {
    return this.tickets.filter((t) => t.status === 'in_progress').length;
  }

  get resolvedCount(): number {
    return this.tickets.filter((t) => t.status === 'resolved').length;
  }
}