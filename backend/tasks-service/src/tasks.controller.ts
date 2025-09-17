import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksController {
  constructor(private repo: TasksRepository) {}

  @GrpcMethod('Tasks', 'ListTasks')
  async listTasks(_: any) {
    const rows = await this.repo.findAll();
    return { tasks: rows };
  }

  @GrpcMethod('Tasks', 'AddTask')
  async addTask(data: { title: string }) {
    const row = await this.repo.create(data.title);
    return row;
  }

  @GrpcMethod('Tasks', 'DeleteTask')
  async deleteTask(data: { id: number }) {
    const res = await this.repo.deleteById(Number(data.id));
    return res;
  }
}
