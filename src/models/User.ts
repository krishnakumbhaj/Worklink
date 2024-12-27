import mongoose , { Schema, Document } from 'mongoose';
import { Message } from './message';
import { messageSchema } from './message';
export interface User extends Document {
            username: string;
            email: string;
            password: string;
            verifyCode: string;
            createdAt: Date;
            isVerified: boolean;
            verifyCodeExpiry: Date;
            isAcceptingMessages: boolean;
            messages: Message[];
}

const userSchema: Schema<User> = new Schema({
            username: { type: String, required: [true, "username is required"], trim : true, unique: true },
            email: { type: String, required: [true, "email is required"], unique: true, match: [/\S+@\S+\.\S+/, 'please enter the valid email'] },
            password: { type: String, required: [true, "password is required"] },
            verifyCode: { type: String, required: [true, "verifycode is required"] },
            createdAt: { type: Date, default: Date.now },
            isVerified: { type: Boolean, default: false },
            verifyCodeExpiry: { type: Date, required: [true, "verify code expiry is required"] },
            isAcceptingMessages: { type: Boolean, default: true },
            messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', userSchema);

export default UserModel;