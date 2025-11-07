import { MetadataRoute } from 'next';

// 1. Import your new, clean service functions
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService'; // You'll create this
import { createSlug } from '@/utils/slug';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // --- 1. Static Pages ---
    // These are the core, high-priority pages of your site.
    const staticPages = [
      { url: SITE_URL, lastModified: new Date(), priority: 1.0 },
      { url: `${SITE_URL}/sale-off`, lastModified: new Date(), priority: 0.8 },
      { url: `${SITE_URL}/feed`, lastModified: new Date(), priority: 0.7 },
    ];

    // --- 2. Dynamic Category Pages ---
    // Fetch all categories to generate their URLs.
    const categoriesResponse = await categoryService.getCategories();
    const categoryEntries = categoriesResponse.items.map((category: any) => ({
      url: `${SITE_URL}/${createSlug(category.name)}-${category.categoryId}`,
      lastModified: new Date(),
      priority: 0.9,
    }));

    // --- 3. Dynamic Product Pages (CRITICAL) ---
    // Fetch all products to generate their URLs.
    const productsResponse = await productService.getAllProducts({ limit: 1000 }); 
    const productEntries = productsResponse.items.map((product: any) => ({
      url: `${SITE_URL}/${createSlug(product.category.name)}/${createSlug(product.name)}-${product.productId}`,
      lastModified: product.updatedAt || new Date(),
      priority: 0.8,
    }));

    // Combine all entries into the final sitemap
    return [
      ...staticPages,
      ...categoryEntries,
      ...productEntries,
    ];

  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    // Return a minimal sitemap if the database queries fail
    return [{ url: SITE_URL, lastModified: new Date() }];
  }
}
