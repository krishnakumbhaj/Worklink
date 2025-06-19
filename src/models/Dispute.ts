import mongoose, { Schema, Document } from 'mongoose';

export interface IDispute extends Document {
  projectId: mongoose.Types.ObjectId;
  raisedBy: mongoose.Types.ObjectId;
  against: mongoose.Types.ObjectId;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  resolutionNote?: string;
  createdAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'resolved', 'rejected'],
      default: 'open',
    },
    resolutionNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
