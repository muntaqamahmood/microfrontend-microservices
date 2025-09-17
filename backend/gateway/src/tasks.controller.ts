import { Controller, Get, Post, Body, Inject, OnModuleInit, Delete, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface Task { id: number; title: string; }
interface TaskList { tasks: Task[]; }
interface DeleteTaskResponse { ok: boolean }
interface TasksService {
	listTasks(data: any): Observable<TaskList>;
	addTask(data: { title: string }): Observable<Task>;
	deleteTask(data: { id: number }): Observable<DeleteTaskResponse>;
}

@Controller()
export class TasksController implements OnModuleInit {
	private tasksService: TasksService;

	constructor(@Inject('TASKS_PACKAGE') private client: ClientGrpc) {}

	onModuleInit() {
		this.tasksService = this.client.getService<TasksService>('Tasks');
	}

	@Get()
	root() {
		return {
			message: 'FSHO Gateway is running',
			endpoints: [
				{ method: 'GET', path: '/api/tasks' },
				{ method: 'POST', path: '/api/tasks' },
				{ method: 'DELETE', path: '/api/tasks/:id' },
				{ method: 'GET', path: '/health' },
			],
		};
	}

	@Get('health')
	health() {
		return { status: 'ok' };
	}

	@Get('api/tasks')
	async list() {
		const res = await firstValueFrom(this.tasksService.listTasks({}));
		return Array.isArray(res?.tasks) ? res.tasks : [];
	}

	@Post('api/tasks')
	async add(@Body() body: { title: string }) {
		const res = await firstValueFrom(this.tasksService.addTask({ title: body.title }));
		return res;
	}

	@Delete('api/tasks/:id')
	async remove(@Param('id') id: string) {
		const res = await firstValueFrom(this.tasksService.deleteTask({ id: Number(id) }));
		return res;
	}

}
