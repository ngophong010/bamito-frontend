import { productService } from '@/services/productService';
import { sizeService } from '@/services/sizeService';
import CreateInventoryClient from './CreateInventoryClient';

export const dynamic = 'force-dynamic';

export default async function CreateInventoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    // Fetch the product (to get its name and category) and the available sizes for that category
    const product = await productService.getProductDetails(productId);
    const availableSizes = await sizeService.getSizesForCategory(Number(product.category.categoryId));

    return (
        <CreateInventoryClient 
            product={product} 
            availableSizes={availableSizes} 
        />
    );
}
