export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName?: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  body: string;
}
