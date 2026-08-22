import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TicketPriority, TicketStatus } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss'],
})
export class TicketFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  ticketId: string | null = null;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  priorityOptions: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
  statusOptions: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['open'],
    });
  }

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.ticketId;

    if (this.isEditMode && this.ticketId) {
      this.isLoading = true;
      this.ticketService.getTicketById(this.ticketId).subscribe({
        next: (ticket) => {
          this.form.patchValue({
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
          });
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar el ticket.';
          this.isLoading = false;
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    const value = this.form.value;

    const request$ = this.isEditMode && this.ticketId
      ? this.ticketService.updateTicket(this.ticketId, value)
      : this.ticketService.createTicket({
          title: value.title,
          description: value.description,
          priority: value.priority,
        });

    request$.subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        const ticket = response?.data ?? response;
        if (ticket?.id) {
          this.router.navigate(['/tickets', ticket.id]);
        } else {
          this.errorMessage = 'El ticket se guardó pero no se pudo abrir su detalle.';
        }
      },
      error: () => {
        this.errorMessage = 'Error al guardar el ticket.';
        this.isSubmitting = false;
      },
    });
  }
}