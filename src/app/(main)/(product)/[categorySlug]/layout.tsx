"use client";

import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { useParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { useEffect, useState } from 'react';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * This is the layout component for the product category page.
 * It provides the breadcrumb navigation for all product-related pages.
 */
export default function ProductLayout({ children }: LayoutProps) {
  const params = useParams();
  // Removing unused variable
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const initializeBreadcrumb = async () => {
      // Get the category slug and product slug from the URL parameters
      const categorySlug = params?.categorySlug as string;
      const productSlug = params?.productSlug as string | undefined;
      
      if (categorySlug) {
        try {
          // Extract category ID from the slug (format: name-id)
          const categorySlugParts = categorySlug.split('-');
          const categoryId = categorySlugParts.at(-1);

          if (categoryId) {
            // Fetch category details
            const categoryData = await productService.getCategory(categoryId);
            
            // Create breadcrumb items
            const items: BreadcrumbItem[] = [
              {
                label: categoryData.name,
                href: `/${categorySlug}`,
              }
            ];

            // If we have a product slug, add the product to breadcrumb
            if (productSlug) {
              const productSlugParts = String(productSlug).split('-');
              const productId = productSlugParts.at(-1);
              
              if (productId) {
                const product = await productService.getProductDetails(productId);
                items.push({
                  label: product.name,
                  href: `/${categorySlug}/${productSlug}`,
                });
              }
            }

            setBreadcrumbItems(items);
          }
        } catch (error) {
          console.error('Failed to fetch category/product details:', error);
          // You might want to handle this error more gracefully,
          // e.g., showing a fallback UI or redirecting to an error page
        }
      }
    };

    initializeBreadcrumb();
  }, [params?.categorySlug, params?.productSlug]);

  return (
    <div className="product-layout">
      <Breadcrumb items={breadcrumbItems} />
      {children}
    </div>
  );
}
