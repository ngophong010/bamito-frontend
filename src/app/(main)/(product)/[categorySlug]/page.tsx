import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/services/productService';
import { getAllBrands, getAllBrandsList } from '@/services/brandService';
import CategoryClient from './CategoryClient';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
  searchParams: { // Next.js automatically provides search params
    page?: string;
    sort?: string;
    brands?: string; // e.g., '1,2,3'
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = params;
  
  // A robust way to get the ID from a slug like 'vot-cau-long-1'
  const categoryId = Number(categorySlug.split('-').pop());

  if (isNaN(categoryId)) {
    notFound(); // If the ID is not a number, 404
  }

  // --- DATA FETCHING ON THE SERVER ---
  try {
    // Parse search params for the API call
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const filter = {
      brandId: searchParams.brands?.split(',').map(Number),
      price: [
        searchParams.minPrice ? Number(searchParams.minPrice) : 0,
        searchParams.maxPrice ? Number(searchParams.maxPrice) : 10000000,
      ] as [number, number]
    };

    // Fetch the initial product list and the list of all brands in parallel
    const [productData, allBrands] = await Promise.all([
      getProductsByCategory(categoryId, { page, filter, sort: searchParams.sort }),
      getAllBrandsList() // Fetch all brands for the filter sidebar
    ]);

    // Pass all server-fetched data as props to the Client Component
    return (
      <CategoryClient 
        initialProductData={productData} 
        allBrands={allBrands} 
        categoryId={categoryId}
      />
    );
  } catch (error) {
    console.error("Failed to fetch category page data:", error);
    notFound(); // If the category doesn't exist, 404
  }
}
