import { getProductDetails } from '@/services/productService';
import { getSizesByCategory } from '@/services/sizeService';
import CreateInventoryClient from './CreateInventoryClient';

export default async function CreateInventoryPage({ params }: { params: { id: string } }) {
    const productId = Number(params.id);

    // Fetch the product (to get its name and category) and the available sizes for that category
    const product = await getProductDetails(productId);
    const availableSizes = await getSizesByCategory(product.category.id);

    return (
        <CreateInventoryClient 
            product={product} 
            availableSizes={availableSizes} 
        />
    );
}
