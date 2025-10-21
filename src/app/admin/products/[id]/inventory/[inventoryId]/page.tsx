import { productService } from '@/services/productService';
import { sizeService } from '@/services/sizeService';
import { inventoryService } from '@/services/inventoryService'; // You'll create this
import EditInventoryClient from './EditInventoryClient';

export default async function EditInventoryPage({ params }: Readonly<{ params: { id: string, inventoryId: string } }>) {
    const inventoryId = Number(params.inventoryId);

    // Fetch the product details first to get the category
    const product = await productService.getProductDetails(params.id);
    
    // Then fetch inventory and sizes in parallel
    const [inventoryResponse, availableSizes] = await Promise.all([
        inventoryService.getProductInventory(Number(params.id)),
        sizeService.getSizesForCategory(Number(product.category.categoryId))
    ]);

    // Find the specific inventory item from the paginated response
    const inventoryItem = inventoryResponse.items.find(item => item.id === inventoryId);
    
    if (!inventoryItem) {
        throw new Error(`Inventory item with ID ${inventoryId} not found`);
    }

    return (
        <EditInventoryClient 
            product={product} 
            inventoryItem={inventoryItem}
            availableSizes={availableSizes}
        />
    );
}
