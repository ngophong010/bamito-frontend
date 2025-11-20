import { productService } from '@/services/productService';
import { sizeService } from '@/services/sizeService';
import { inventoryService } from '@/services/inventoryService'; // You'll create this
import EditInventoryClient from './EditInventoryClient';

export const dynamic = 'force-dynamic';

export default async function EditInventoryPage({ params }: Readonly<{ params: Promise<{ id: string, inventoryId: string }> }>) {
    const resolvedParams = await params;
    const inventoryId = Number(resolvedParams.inventoryId);

    // Fetch the product details first to get the category
    const product = await productService.getProductDetails(resolvedParams.id);
    
    // Then fetch inventory and sizes in parallel
    const [inventoryResponse, availableSizes] = await Promise.all([
        inventoryService.getProductInventory(Number(resolvedParams.id)),
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
