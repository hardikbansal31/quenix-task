import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus, TaskPriority } from '../schemas/task.schema';

export class QueryTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  sortBy?: 'status' | 'priority' | 'dueDate';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
