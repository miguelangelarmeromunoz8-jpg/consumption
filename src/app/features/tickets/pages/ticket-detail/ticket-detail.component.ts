import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { Comment } from '../../../../core/models/comment.model';

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

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: CommentService,
    public authService: AuthService,
    private fb: FormBuilder
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
    }
  }

  loadTicket(id: string): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el ticket.';
        this.isLoading = false;
      },
    });
  }

  loadComments(ticketId: string): void {
    this.commentService.getCommentsByTicket(ticketId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los comentarios.';
        this.isLoadingComments = false;
      },
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.ticket) {
      this.isSubmittingComment = true;
      const { body } = this.commentForm.value;

      this.commentService.addComment(this.ticket.id, { body }).subscribe({
        next: (newComment) => {
          this.comments.push(newComment);
          this.commentForm.reset();
          this.isSubmittingComment = false;
        },
        error: () => {
          this.errorMessage = 'Error al enviar el comentario.';
          this.isSubmittingComment = false;
        },
      });
    }
  }

  canEdit(): boolean {
    return this.authService.hasRole('admin', 'agent');
  }
}