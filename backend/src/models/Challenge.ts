
import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'one_time';
  category: 'saving' | 'spending' | 'tracking' | 'learning';
  targetValue: number;
  unit: 'rupees' | 'transactions' | 'days' | 'percentage';
  startDate: Date;
  endDate: Date;
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'one_time'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['saving', 'spending', 'tracking', 'learning'], 
    required: true 
  },
  targetValue: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: ['rupees', 'transactions', 'days', 'percentage'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rewards: {
    xp: { type: Number, required: true },
    badge: { type: String },
    title: { type: String }
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  isActive: { type: Boolean, default: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);