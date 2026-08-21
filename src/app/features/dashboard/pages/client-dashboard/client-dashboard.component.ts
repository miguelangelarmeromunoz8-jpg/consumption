import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent implements OnInit {
  myTickets: Ticket[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.myTickets = currentUser
          ? tickets.filter((t) => t.clientId === currentUser.id)
          : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar tus tickets.';
        this.isLoading = false;
      },
    });
  }
}