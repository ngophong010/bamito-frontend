import { productService } from '@/services/productService';
import { sizeService } from '@/services/sizeService';
import { inventoryService } from '@/services/inventoryService'; // You'll create this
import EditInventoryClient from './EditInventoryClient';

export default async function EditInventoryPage({ params }: { params: { id: string, inventoryId: string } }) {
    const productId = Number(params.id);
    const inventoryId = Number(params.inventoryId);

    // Fetch all necessary data in parallel
    const [product, inventoryItem] = await Promise.all([
        productService.getProductDetails(productId),
        inventoryService.getInventoryById(inventoryId)
    ]);
    
    // You still need the list of sizes for the dropdown, even though it's disabled.
    const availableSizes = await sizeService.getSizesForCategory(product.category.id);

    return (
        <EditInventoryClient 
            product={product} 
            inventoryItem={inventoryItem}
            availableSizes={availableSizes}
        />
    );
}
