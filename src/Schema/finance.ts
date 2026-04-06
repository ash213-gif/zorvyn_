import { Schema, model, Document, Types, Query } from 'mongoose';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export const CATEGORIES = [
  'salary',
  'freelance',
  'investment',
  'rental',
  'business',
  'food',
  'transport',
  'utilities',
  'healthcare',
  'entertainment',
  'education',
  'shopping',
  'travel',
  'insurance',
  'taxes',
  'other',
] as const;

export type Category = typeof CATEGORIES[number];

export interface IFinancialRecord extends Document {
  amount: number;
  type: TransactionType;
  category: Category;
  date: Date;
  description?: string;
  tags: string[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indices for efficient dashboard queries
financialRecordSchema.index({ date: -1 });
financialRecordSchema.index({ type: 1, date: -1 });
financialRecordSchema.index({ category: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, date: -1 });

// Soft-delete scope — only show non-deleted records by default
financialRecordSchema.pre(/^find/, function (this: Query<IFinancialRecord, IFinancialRecord>) {
  const query = this.getQuery();
  if (query.isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

export const FinancialRecord = model<IFinancialRecord>('FinancialRecord', financialRecordSchema);