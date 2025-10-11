import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Import the correct, refactored service functions
import { getInventoryForProduct } from '@/services/inventoryService';
import { getProductDetails } from '@/services/productService'; // To get the product name for the title
import InventoryClient from './InventoryClient'; // Import the new Client Component

interface AdminInventoryPageProps {
  params: {
    id: string; // The numeric primary key of the product
  };
  searchParams: {
    page?: string;
  };
}

// 2. Dynamically generate metadata for the page
export async function generateMetadata({ params }: AdminInventoryPageProps): Promise<Metadata> {
    try {
        const product = await getProductDetails(Number(params.id));
        return {
            title: `Quản lý Kho cho: ${product.name}`,
        };
    } catch (error) {
        return { title: 'Quản lý Kho' };
    }
}

export default async function AdminInventoryPage({ params, searchParams }: AdminInventoryPageProps) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    
    // Fetch the product details and its inventory in parallel
    const [product, initialInventoryData] = await Promise.all([
        getProductDetails(productId),
        getInventoryForProduct(productId, { page, limit: 10 })
    ]);

    // 4. Pass the server-fetched data as props to the Client Component
    return <InventoryClient product={product} initialInventoryData={initialInventoryData} />;
  } catch (error) {
    console.error(`Failed to fetch inventory for product ID ${productId}:`, error);
    notFound();
  }
}
