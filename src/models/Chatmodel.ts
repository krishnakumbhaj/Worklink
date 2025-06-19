import mongoose, { Schema, Document, model } from 'mongoose';

interface IMessage {
  senderId: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
  type?: 'text' | 'file' | 'image';
  attachmentUrl?: string | null;
}

interface IChat extends Document {
  projectId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  status: 'active' | 'closed';
  messages: IMessage[];
  clientCloseFlag: boolean;
  freelancerCloseFlag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'file', 'image'], default: 'text' },
  attachmentUrl: { type: String, default: null },
});

const ChatSchema = new Schema<IChat>({
  projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project', unique: true },
  clientId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  freelancerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  messages: [MessageSchema],
  clientCloseFlag: { type: Boolean, default: false },
  freelancerCloseFlag: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Chat = mongoose.models.Chat || model<IChat>('Chat', ChatSchema);

export default Chat;