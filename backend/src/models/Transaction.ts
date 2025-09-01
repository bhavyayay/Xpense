// backend/src/models/Transaction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  goalId?: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  type: 'income' | 'expense' | 'saving' | 'investment';
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  location?: string;
  tags: string[];
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  attachments?: string[];
  aiCategory?: string;
  mood?: 'happy' | 'neutral' | 'regret' | 'proud';
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['income', 'expense', 'saving', 'investment'], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'], 
    required: true 
  },
  location: { type: String },
  tags: [{ type: String }],
  isRecurring: { type: Boolean, default: false },
  recurringType: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'] 
  },
  attachments: [{ type: String }],
  aiCategory: { type: String },
  mood: { 
    type: String, 
    enum: ['happy', 'neutral', 'regret', 'proud'] 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);