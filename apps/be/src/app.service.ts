import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Itodo, Todo } from './common/entities/todo';
import { Op } from 'sequelize';

interface query {
  search: string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Todo)
    private todo: typeof Todo,
  ) {}

  async getTodo(q?: query) {
    const whereClause: any[] = [];

    if (q) {
      if (q.search) {
        whereClause.push({
          title: {
            [Op.like]: `%${q.search}%`,
          },
        });
      }
    }

    return this.todo.findAll({
      where: {
        [Op.and]: whereClause,
      },
    });
  }

  async createTodo(data: Itodo) {
    return this.todo.create(data);
  }

  async updateTodo(id: string, data: Partial<Itodo>) {
    const t = await this.todo.findOne({ where: { id } });

    if (t) {
      return await t.update(data);
    }
    return null;
  }
}
