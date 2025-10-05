import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // The key in your Redux state
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
  tagTypes: ['Product', 'Order', 'Brand'], // Defines tags for caching
  endpoints: (builder) => ({
    // Define an endpoint for fetching products
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'], // This query provides 'Product' data
    }),
    // Define an endpoint for creating a product
    createProduct: builder.mutation({
        query: (productData) => ({
            url: '/products',
            method: 'POST',
            body: productData,
        }),
        invalidatesTags: ['Product'], // Creating a product invalidates the 'Product' cache
    }),
  }),
});

// RTK Query automatically generates hooks for you!
export const { useGetProductsQuery, useCreateProductMutation } = apiSlice;
