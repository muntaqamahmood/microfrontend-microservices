import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsController {
  constructor(private repo: CommentsRepository) {}

  @GrpcMethod('Comments', 'ListComments')
  async listComments(_: any) {
    const rows = await this.repo.findAll();
    return { comments: rows };
  }

  @GrpcMethod('Comments', 'AddComment')
  async addComment(data: { content: string; task_id?: number }) {
    const row = await this.repo.create(data.content, data.task_id);
    return row;
  }

  @GrpcMethod('Comments', 'DeleteComment')
  async deleteComment(data: { id: number }) {
    return this.repo.deleteById(Number(data.id));
  }
} 