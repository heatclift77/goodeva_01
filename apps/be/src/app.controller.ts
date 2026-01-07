import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  // ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTodoDto } from './common/dto/todo';
import { ValidationPipe } from './common/pipe/validation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/todo')
  async getTodo(@Query('search') s: string) {
    return await this.appService.getTodo({ search: s || '' });
  }

  @Post('/api/todo')
  async createTodo(@Body(new ValidationPipe()) data: CreateTodoDto) {
    return await this.appService.createTodo({
      title: data.title,
      desc: data.desc,
      completed: false,
    });
  }

  @Patch('/api/todo/:id')
  async toggleTodo(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: Partial<CreateTodoDto>,
  ) {
    return await this.appService.updateTodo(id, data);
  }
}
