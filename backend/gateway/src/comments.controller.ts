import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface Comment { id: number; content: string; task_id?: number }
interface CommentList { comments: Comment[] }
interface DeleteCommentResponse { ok: boolean }
interface CommentsService {
  listComments(data: any): Observable<CommentList>;
  addComment(data: { content: string; task_id?: number }): Observable<Comment>;
  deleteComment(data: { id: number }): Observable<DeleteCommentResponse>;
}

@Controller()
export class CommentsController implements OnModuleInit {
  private commentsService: CommentsService;

  constructor(@Inject('COMMENTS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.commentsService = this.client.getService<CommentsService>('Comments');
  }

  @Get('api/comments')
  async list() {
    const res = await firstValueFrom(this.commentsService.listComments({}));
    return Array.isArray(res?.comments) ? res.comments : [];
  }

  @Post('api/comments')
  async add(@Body() body: { content: string; task_id?: number }) {
    const res = await firstValueFrom(this.commentsService.addComment({ content: body.content, task_id: body.task_id }));
    return res;
  }

  @Delete('api/comments/:id')
  async remove(@Param('id') id: string) {
    const res = await firstValueFrom(this.commentsService.deleteComment({ id: Number(id) }));
    return res;
  }
} 