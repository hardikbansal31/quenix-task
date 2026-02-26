import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { User, Role } from '../auth/schemas/user.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // If admin provides 'assignedTo', use it. Otherwise, assign to the creator.
    const taskOwner =
      user.role === Role.ADMIN && createTaskDto.assignedTo
        ? createTaskDto.assignedTo
        : user._id;

    const createdTask = new this.taskModel({
      ...createTaskDto,
      user: taskOwner,
    });
    return createdTask.save();
  }

  async findAll(query: QueryTaskDto, user: User): Promise<Task[]> {
    const { status, priority, sortBy, sortOrder } = query;
    const filter: any = {};

    // Members only see their own tasks. Admins see all.
    if (user.role === Role.MEMBER) {
      filter.user = user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    return this.taskModel.find(filter).sort(sortOptions).exec();
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    // Check ownership for members
    if (
      user.role === Role.MEMBER &&
      task.user.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException('You are not allowed to view this task');
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    await this.findOne(id, user); // Throws 404/403 if invalid

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} no longer exists`);
    }
    return updatedTask;
  }

  async remove(id: string, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    await this.taskModel.findByIdAndDelete(id).exec();
    return task; // task is already guaranteed to exist by findOne
  }
}
