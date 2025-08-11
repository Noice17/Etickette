import { User } from './User'; // adjust the path if needed

export interface Agent {
  userId: number;
  user?: User; // Optional to avoid circular dependency issues if not always needed
  maxWorkload: number;
  currentWorkload: number;
  averageRating: number;
  ratingCount: number;
}
