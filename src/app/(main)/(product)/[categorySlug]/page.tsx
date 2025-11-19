import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';
import CategoryClient from './CategoryClient';

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    brands?: string; // e.g., '1,2,3'
    minPrice?: string;
    maxPrice?: string;
  }>;
}

// =================================================================
// 1. DYNAMIC METADATA GENERATION (ESSENTIAL FOR SEO)
// =================================================================
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryId = Number(resolvedParams.categorySlug.split('-').pop());

  if (Number.isNaN(categoryId)) {
    return { title: 'Invalid Category | Bamito' };
  }
  
  try {
    const category = await categoryService.getCategoryById(categoryId);
    const title = `${category.name} | Bamito`;
    const description = `Shop for the best ${category.name} at Bamito. We offer a wide selection and competitive prices.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        // You can add a category image here if your category entity has one
      },
    };
  } catch (error) {
    return {
      title: 'Category Not Found | Bamito',
      description: 'The category you are looking for could not be found.',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { categorySlug } = resolvedParams;
  
  // A robust way to get the ID from a slug like 'vot-cau-long-1'
  const categoryId = Number(categorySlug.split('-').pop());

  if (isNaN(categoryId)) {
    notFound(); // If the ID is not a number, 404
  }

  // --- DATA FETCHING ON THE SERVER ---
  try {
    // Parse search params for the API call
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
    const filter = {
      brandId: resolvedSearchParams.brands?.split(',').map(Number),
      price: [
        resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : 0,
        resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : 10000000,
      ] as [number, number]
    };

    // Fetch the initial product list and the list of all brands in parallel
    const [productData, allBrands] = await Promise.all([
      productService.getProductsByCategory(categoryId, { page, filter, sort: resolvedSearchParams.sort }),
      brandService.getAllBrandsList() // Fetch all brands for the filter sidebar
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
