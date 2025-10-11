"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateInventoryEntry } from '@/services/inventoryService';
import { ProductDetails, Size, Inventory, InventoryUpdateData } from '@/types';
import InventoryForm from '@/components/Admin/InventoryForm/InventoryForm';

const EditInventoryClient = ({ product, inventoryItem, availableSizes }: { product: ProductDetails, inventoryItem: Inventory, availableSizes: Size[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: InventoryUpdateData) => {
        setIsLoading(true);
        try {
            await updateInventoryEntry(inventoryItem.id, data);
            toast.success("Cập nhật tồn kho thành công!");
            router.push(`/admin/products/${product.id}/inventory`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Tồn kho cho: {product.name}</h1>
            <InventoryForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                productName={product.name}
                availableSizes={availableSizes}
                initialData={inventoryItem} // Pass initial data to the form
            />
        </div>
    );
};

export default EditInventoryClient;
