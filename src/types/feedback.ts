import { UserProfile } from './user';

export interface Feedback {
  id: number;
  description: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<UserProfile, 'userName' | 'avatar'>; // Only show public user info
}

export interface FeedbackCreateData {
  orderId: number;
  sizeId: number;
  rating: number;
  description?: string;
}
