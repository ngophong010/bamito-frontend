// NO "use client" directive here. This is a Server Component.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Import our new, clean, and typed service function
import { getProductDetails } from '@/services/productService';
// Import the Client Component that will handle all interactivity
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: {
    productSlug: string; // The full slug, e.g., 'yonex-astrox-99-prod123'
  };
}

// ===============================================================
// 1. GENERATE METADATA (Runs on the Server)
// ===============================================================
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Use a more robust way to get the ID from the slug
  const productId = params.productSlug.split('-').pop();

  if (!productId) {
    return { title: 'Invalid Product' };
  }

  try {
    // Fetch data ONCE. This data can be reused by the page component.
    const product = await getProductDetails(productId);
    
    const title = `${product.name} | BAMITO Shop`;
    const description = (product.descriptionHTML ? stripHtml(product.descriptionHTML) : product.name).substring(0, 160);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: product.image || '/default-og-image.png' }],
        type: 'website',
      },
    };
  } catch (error) {
    console.error(`Metadata generation failed for ${productId}:`, error);
    return { title: "Product Not Found", description: "This product could not be found." };
  }
}

// Dummy helper function, move to utils
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');


// ===============================================================
// 2. THE PAGE COMPONENT (Also Runs on the Server)
// ===============================================================
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const productId = params.productSlug.split('-').pop();

  if (!productId) {
    notFound(); // Redirects to the 404 page
  }

  try {
    // Fetch the data ONCE on the server. Next.js automatically de-duplicates this fetch
    // with the one in generateMetadata, so it only runs once.
    const productData = await getProductDetails(productId);
    
    // Pass the server-fetched data as a prop to the Client Component.
    return <ProductDetailClient product={productData} />;

  } catch (error) {
    // If the product fetch fails (e.g., product doesn't exist), render the 404 page.
    notFound();
  }
}
