import { Agent } from "./Agent";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
  agent?: Agent; // if you're using Agent somewhere else
  createdAt?: string; // ISO timestamp format
  updatedAt?: string;
  avatarUrl?: string;
}
