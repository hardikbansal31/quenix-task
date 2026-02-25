import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { User } from '../auth/schemas/user.schema'; // <-- Import User

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Inject the user into the new task payload
    const createdTask = new this.taskModel({
      ...createTaskDto,
      user,
    });
    return createdTask.save();
  }

  async findAll(query: QueryTaskDto, user: User): Promise<Task[]> {
    const { status, priority, sortBy, sortOrder } = query;

    // Lock the query down to just this user's tasks
    const filter: any = { user };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    return this.taskModel.find(filter).sort(sortOptions).exec();
  }

  async findOne(id: string, user: User): Promise<Task> {
    // Find by BOTH task ID and User
    const task = await this.taskModel.findOne({ _id: id, user }).exec();
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    // Ensure we only update if the task belongs to the user
    const existingTask = await this.taskModel
      .findOneAndUpdate({ _id: id, user }, updateTaskDto, { new: true })
      .exec();
    if (!existingTask)
      throw new NotFoundException(`Task with ID ${id} not found`);
    return existingTask;
  }

  async remove(id: string, user: User): Promise<Task> {
    // Ensure we only delete if the task belongs to the user
    const deletedTask = await this.taskModel
      .findOneAndDelete({ _id: id, user })
      .exec();
    if (!deletedTask)
      throw new NotFoundException(`Task with ID ${id} not found`);
    return deletedTask;
  }
}
