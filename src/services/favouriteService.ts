import axios from "../axios";
import type { ServiceResponse } from "@/types/shared";

/**
 * @desc    Get all of the current user's favourite product IDs
 * @returns {Promise<ServiceResponse>} An array of numeric product IDs
 */
export const getFavourites = async (): Promise<ServiceResponse> => {
  const response = await axios.get(`/api/v1/favourites`);
  return response.data;
};

/**
 * @desc    Add a product to the current user's favourites
 * @param   {number} productId - The numeric ID of the product to add
 * @returns {Promise<ServiceResponse>}
 */
export const addFavourite = async (productId: number): Promise<ServiceResponse> => {
  const response = await axios.post(`/api/v1/favourites`, { productId });
  return response.data;
};

/**
 * @desc    Remove a product from the user's favourites
 * @param   {number} productId - The numeric ID of the product to remove
 * @returns {Promise<ServiceResponse>}
 */
export const removeFavourite = async (productId: number): Promise<ServiceResponse> => {
  const response = await axios.delete(`/api/v1/favourites/${productId}`);
  return response.data;
};
