import { getProductDetails } from '@/services/productService';
import { getSizesByCategory } from '@/services/sizeService';
import { getInventoryById } from '@/services/inventoryService'; // You'll create this
import EditInventoryClient from './EditInventoryClient';

export default async function EditInventoryPage({ params }: { params: { id: string, inventoryId: string } }) {
    const productId = Number(params.id);
    const inventoryId = Number(params.inventoryId);

    // Fetch all necessary data in parallel
    const [product, inventoryItem] = await Promise.all([
        getProductDetails(productId),
        getInventoryById(inventoryId)
    ]);
    
    // You still need the list of sizes for the dropdown, even though it's disabled.
    const availableSizes = await getSizesByCategory(product.category.id);

    return (
        <EditInventoryClient 
            product={product} 
            inventoryItem={inventoryItem}
            availableSizes={availableSizes}
        />
    );
}
