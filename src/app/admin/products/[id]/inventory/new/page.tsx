import { productService } from '@/services/productService';
import { sizeService } from '@/services/sizeService';
import CreateInventoryClient from './CreateInventoryClient';

export default async function CreateInventoryPage({ params }: { params: { id: string } }) {
    const productId = params.id;

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
