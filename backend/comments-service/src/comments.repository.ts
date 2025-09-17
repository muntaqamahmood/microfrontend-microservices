import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CommentsRepository implements OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    const conn = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tasks';
    console.log('[comments] Connecting to Postgres at', conn);
    this.pool = new Pool({ connectionString: conn });

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        task_id INTEGER
      );
    `);

    console.log('[comments] Ensured comments table exists');
  }

  async findAll() {
    const res = await this.pool.query('SELECT id, content, task_id FROM comments ORDER BY id');
    return res.rows;
  }

  async create(content: string, taskId?: number) {
    const res = await this.pool.query(
      'INSERT INTO comments (content, task_id) VALUES ($1, $2) RETURNING id, content, task_id',
      [content, taskId ?? null],
    );
    return res.rows[0];
  }

  async deleteById(id: number) {
    const res = await this.pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return { ok: res.rowCount === 1 };
  }
} 