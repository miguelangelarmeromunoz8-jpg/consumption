import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
})
export class AgentDashboardComponent implements OnInit {
  assignedTickets: Ticket[] = [];
  unassignedTickets: Ticket[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.assignedTickets = currentUser
          ? response.data.filter((t) => t.assignedTo === currentUser.id)
          : [];
        this.unassignedTickets = response.data.filter((t) => !t.assignedTo);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar tus tickets asignados.';
        this.isLoading = false;
      },
    });
  }
}