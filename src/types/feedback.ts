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

export interface FeedbackUpdateData {
  description?: string;
  rating?: number;
}

export interface FeedbackFormData {
  rating: number;
  description: string;
}

export interface UnreviewedProduct {
  id: number;
  orderId: number;
  name: string;
  image: string | null;
  price: number;
  size: {
    id: number;
    name: string;
  };
}
