import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { productService } from '@/services/productService';
import { feedbackService } from '@/services/feedbackService';
// Import the Client Component that will handle all interactivity
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  readonly params: Promise<{
    readonly productSlug: string; // The full slug, e.g., 'yonex-astrox-99-prod123'
    readonly categorySlug: string;
  }>;
}

// ===============================================================
// 1. GENERATE METADATA (Runs on the Server)
// ===============================================================
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const productId = resolvedParams.productSlug.split('-').pop();

  if (!productId) {
    return { title: 'Invalid Product' };
  }

  try {
    // Fetch data ONCE. This data can be reused by the page component.
    const product = await productService.getProductDetails(productId);

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

// Utility function to strip HTML tags
const stripHtml = (html: string) => html.replaceAll(/<[^>]*>?/gm, '');

// ===============================================================
// 2. THE PAGE COMPONENT (Also Runs on the Server)
// ===============================================================
export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const productId = resolvedParams.productSlug.split('-').pop();

  if (!productId) {
    notFound(); // Redirects to the 404 page
  }

  try {
    // Fetch the data ONCE on the server. Next.js automatically de-duplicates this fetch
    // with the one in generateMetadata, so it only runs once.
    const [productData, feedbackData] = await Promise.all([
      productService.getProductDetails(productId),
      feedbackService.getProductFeedback(Number(productId)) // Assuming your service takes a numeric ID
    ]);
    // Pass the server-fetched data as a prop to the Client Component.
    return <ProductDetailClient product={productData} initialFeedbacks={feedbackData} />;

  } catch (error) {
    // If the product fetch fails (e.g., product doesn't exist), render the 404 page.
    console.error(`Failed to fetch product ${productId}:`, error);
    notFound();
  }
}
