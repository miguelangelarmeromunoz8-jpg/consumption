import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { Comment } from '../../../../core/models/comment.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  comments: Comment[] = [];

  isLoading = true;
  isLoadingComments = true;
  isSubmittingComment = false;
  errorMessage = '';

  commentForm: FormGroup;

  agents: User[] = [];
  selectedAgentId = '';
  isAssigning = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: CommentService,
    public authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private apiErrorService: ApiErrorService
  ) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(id);
      this.loadComments(id);
      this.loadAgentsIfAdmin();
    }
  }

  loadTicket(id: string): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (response: any) => {
        this.ticket = response?.data ?? response;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.apiErrorService.getMessage(err, 'Error al cargar el ticket.');
        this.isLoading = false;
      },
    });
  }

  loadComments(ticketId: string): void {
    this.commentService.getCommentsByTicket(ticketId).subscribe({
      next: (response: any) => {
        const list = response?.data ?? response;
        this.comments = Array.isArray(list) ? list : [];
        this.isLoadingComments = false;
      },
      error: (err) => {
        this.errorMessage = this.apiErrorService.getMessage(err, 'Error al cargar los comentarios.');
        this.isLoadingComments = false;
      },
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.ticket) {
      this.isSubmittingComment = true;
      const { body } = this.commentForm.value;

      this.commentService.addComment(this.ticket.id, { body }).subscribe({
        next: (response: any) => {
          const newComment = response?.data ?? response;
          this.comments.push(newComment);
          this.commentForm.reset();
          this.isSubmittingComment = false;
        },
        error: (err) => {
          this.errorMessage = this.apiErrorService.getMessage(err, 'Error al enviar el comentario.');
          this.isSubmittingComment = false;
        },
      });
    }
  }

  loadAgentsIfAdmin(): void {
    if (this.authService.hasRole('admin')) {
      this.userService.getUsers().subscribe({
        next: (response) => {
          this.agents = response.data.filter((u) => u.role === 'agent');
        },
      });
    }
  }

  assignTicket(): void {
    if (!this.ticket || !this.selectedAgentId) return;

    this.isAssigning = true;
    this.ticketService.assignTicket(this.ticket.id, this.selectedAgentId).subscribe({
      next: (response: any) => {
        this.ticket = response?.data ?? response;
        this.isAssigning = false;
      },
      error: (err) => {
        this.errorMessage = this.apiErrorService.getMessage(err, 'Error al asignar el ticket.');
        this.isAssigning = false;
      },
    });
  }

  canEdit(): boolean {
    return this.authService.hasRole('admin', 'agent');
  }
}