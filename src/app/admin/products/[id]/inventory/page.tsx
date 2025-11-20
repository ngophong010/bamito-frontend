import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Import the correct, refactored service functions
import { inventoryService } from '@/services/inventoryService';
import { productService } from '@/services/productService'; // To get the product name for the title
import InventoryClient from './InventoryClient'; // Import the new Client Component

interface AdminInventoryPageProps {
  params: Promise<{
    id: string; // The numeric primary key of the product
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// 2. Dynamically generate metadata for the page
export async function generateMetadata({ params }: AdminInventoryPageProps): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const product = await productService.getProductDetails(resolvedParams.id);
        return {
            title: `Quản lý Kho cho: ${product.name}`,
        };
    } catch (error) {
        return { title: 'Quản lý Kho' };
    }
}

export default async function AdminInventoryPage({ params, searchParams }: AdminInventoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const productId = resolvedParams.id;

  if (!productId) {
    notFound();
  }

  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
    
    // Fetch the product details and its inventory in parallel
    const [product, initialInventoryData] = await Promise.all([
        productService.getProductDetails(productId),
        inventoryService.getProductInventory(Number(productId))
    ]);

    // 4. Pass the server-fetched data as props to the Client Component
    return <InventoryClient product={product} initialInventoryData={initialInventoryData} />;
  } catch (error) {
    console.error(`Failed to fetch inventory for product ID ${productId}:`, error);
    notFound();
  }
}
