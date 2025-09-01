import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'saving' | 'spending_limit' | 'investment' | 'debt_payoff';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'failed';
  isRecurring: boolean;
  recurringType?: 'weekly' | 'monthly' | 'yearly';
  milestones: Array<{
    amount: number;
    achieved: boolean;
    achievedAt?: Date;
    reward: string;
  }>;
  createdAt: Date;
  completedAt?: Date;
}

const GoalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ['saving', 'spending_limit', 'investment', 'debt_payoff'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused', 'failed'], 
    default: 'active' 
  },
  isRecurring: { type: Boolean, default: false },
  recurringType: { 
    type: String, 
    enum: ['weekly', 'monthly', 'yearly'] 
  },
  milestones: [{
    amount: { type: Number, required: true },
    achieved: { type: Boolean, default: false },
    achievedAt: { type: Date },
    reward: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Calculate progress percentage
GoalSchema.virtual('progressPercentage').get(function(this: IGoal) {
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});
export default mongoose.model<IGoal>('Goal', GoalSchema);
