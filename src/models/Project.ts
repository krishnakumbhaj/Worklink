import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId; // Client
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
  deadline: Date;
  category: string;
  status: 'Open' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Dispute';
  applicants: mongoose.Types.ObjectId[];
  selectedFreelancer?: mongoose.Types.ObjectId | null;
  isAssigned: boolean;
  confirm: boolean;
  confirmedAt: Date,
  acceptedAt: Date,
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    budget: { type: String, required: true },
    skillsRequired: { type: [String], required: true },
    deadline: { type: Date, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'Pending', 'In Progress', 'Completed', 'Cancelled', 'Dispute'],
      default: 'Open',
    },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    selectedFreelancer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isAssigned: { type: Boolean, default: false },
    confirm: { type: Boolean, default: false },
    confirmedAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },

  },
  { timestamps: true }
);
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
