import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

// You should define the shape of the User object included in the feedback
interface FeedbackUser {
    userName: string;
    email: string;
    avatar: string | null;
}

export interface Feedback {
  id: number;
  userId: number;
  productId: number;
  description: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: FeedbackUser;
}

// The shape of the data needed to create feedback
export interface FeedbackCreateData {
  orderId: number;
  sizeId: number;
  rating: number;
  description?: string;
}

// The shape of the data needed to update feedback
export type FeedbackUpdateData = Partial<Pick<FeedbackCreateData, 'rating' | 'description'>>;


// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * Fetches all feedback for a specific product.
 * Maps to: GET /api/v1/products/:productId/feedback
 * @param productId - The numeric primary key of the product.
 */
export const getAllFeedbackForProduct = async (productId: number): Promise<Feedback[]> => {
  const response = await apiClient.get(`/products/${productId}/feedback`);
  return response.data.data;
};

/**
 * Creates new feedback for a product. The user ID is taken from the auth token on the backend.
 * Maps to: POST /api/v1/products/:productId/feedback
 * @param productId - The numeric primary key of the product being reviewed.
 * @param data - The data for the new feedback.
 */
export const createFeedback = async (productId: number, data: FeedbackCreateData): Promise<Feedback> => {
  const response = await apiClient.post(`/products/${productId}/feedback`, data);
  return response.data.data;
};

/**
 * Updates an existing feedback entry by its ID.
 * Maps to: PUT /api/v1/feedback/:id
 * @param id - The numeric primary key of the feedback to update.
 * @param data - The new data for the feedback.
 */
export const updateFeedback = async (id: number, data: FeedbackUpdateData): Promise<Feedback> => {
  const response = await apiClient.put(`/feedback/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a feedback entry by its ID.
 * Maps to: DELETE /api/v1/feedback/:id
 * @param id - The numeric primary key of the feedback to delete.
 */
export const deleteFeedback = async (id: number): Promise<void> => {
  await apiClient.delete(`/feedback/${id}`);
};

/**
 * Fetches products that the logged-in user has purchased but not yet reviewed.
 * Maps to: GET /api/v1/profile/unreviewed-products (or a similar custom endpoint)
 */
export const getUnreviewedProducts = async (): Promise<any[]> => { // Replace 'any' with a proper type
    const response = await apiClient.get('/profile/unreviewed-products');
    return response.data.data;
}
