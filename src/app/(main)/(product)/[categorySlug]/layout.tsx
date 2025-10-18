"use client";
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';

import { productService } from '@/services/productService'; // Assuming '@' is aliased to your src folder

// A simple utility to strip HTML tags. You could move this to a utils file.
const stripHtml = (html: string | null): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

// Define the shape of the props that Next.js passes to this function
interface ProductLayoutParams {
  params: {
    productTypeId: string; // The category slug, e.g., 'vot-cau-long'
    productId: string;     // The product's public ID, e.g., 'PROD-ABC123'
  };
}

// Define the type for the layout's children prop
interface LayoutProps {
  children: ReactNode;
}

/**
 * Dynamically generates metadata for a specific product page.
 * This is a Server Component and runs only on the server.
 */
export async function generateMetadata(
  { params }: ProductLayoutParams
): Promise<Metadata> {
  
  // FIX: Use the 'productId' from the route parameters. This is the source of truth.
  const { productId } = params;

  try {
    // FIX: Fetch the full product details using the correct service function.
    const product = await productService.getProductDetails(productId);

    // If the product is found, generate rich, specific metadata.
    const pageTitle = `${product.name} | Bamito`;
    // 1. Convert the HTML description to plain text.
    const plainTextDescription = stripHtml(product.descriptionHTML);
    
    // 2. Use the new 'plainTextDescription' variable to create the final description.
    const description = plainTextDescription
      ? plainTextDescription.substring(0, 155).trim() + '...' // Use the clean text
      : `Buy the ${product.name} at Bamito Shop.`; // Fallback if description is empty

    return {
      title: pageTitle,
      description: description,
      openGraph: {
        title: pageTitle,
        description: description,
        images: [{ url: product.image || "/default-og-image.png" }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: description,
        images: [product.image || "/default-og-image.png"],
      }
    };

  } catch (error) {
    console.error(`Failed to generate metadata for product ${productId}:`, error);
    
    // FIX: Provide clear, sensible fallback metadata if the API call fails.
    // This prevents your page from having an empty <title> tag.
    return {
      title: 'Product Not Found | Bamito',
      description: 'The product you are looking for could not be found.',
    };
  }
}

/**
 * This is the layout component for a single product page.
 */
export default function ProductDetailLayout({ children }: LayoutProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: product.category.name,
      href: `/${createSlug(product.category.name)}-${product.category.id}`,
    },
    {
      label: product.name,
      href: `/${createSlug(product.category.name)}/${createSlug(product.name)}-${product.productId}`,
    },
  ];

  return (
    <div>
      {/* The dumb component just receives the prepared data */}
      <Breadcrumb items={breadcrumbItems} />
      <ProductDetailClient product={product} />
    </div>
  );
}
