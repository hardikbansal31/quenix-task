import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Schema({ timestamps: true })
export class User {
  _id: string;
  
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Add the role property, defaulting to member
  @Prop({ required: true, enum: Role, default: Role.MEMBER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
