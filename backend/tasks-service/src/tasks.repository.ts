import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class TasksRepository implements OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    const conn = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tasks';
    console.log('Connecting to Postgres at', conn);
    this.pool = new Pool({ connectionString: conn });

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL
      );
    `);

    const res = await this.pool.query('SELECT count(*) FROM tasks');
    if (res.rows[0].count === '0') {
      await this.pool.query(
        `INSERT INTO tasks (title) VALUES ($1), ($2), ($3)`,
        ['Demo task 1', 'Demo task 2', 'Demo task 3'],
      );
    }

    console.log('Connected to Postgres and ensured tasks table exists');
  }

  async findAll() {
    const res = await this.pool.query('SELECT id, title FROM tasks ORDER BY id');
    return res.rows;
  }

  async create(title: string) {
    const res = await this.pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title',
      [title],
    );
    // commit
    return res.rows[0];
  }

  async deleteById(id: number) {
    const res = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return { ok: res.rowCount === 1 };
  }
}
