import { UserDTO } from "./UserDTO";

export interface CommentDTO{
    id?: number;
    message: string;
    createdAt?: string;
    ticketId: number;
    userId: number;
    user?: UserDTO
}