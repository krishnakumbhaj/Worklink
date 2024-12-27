import { Message } from "@/models/message";
export interface ApiResponse {
            success: boolean;
            message: string;
            isAccesptingMessage?: boolean;
            messages?: Array<Message>;
}