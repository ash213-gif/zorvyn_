import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: UserRole;
  lastLogin: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VIEWER,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const User = model<IUser>('User', userSchema);