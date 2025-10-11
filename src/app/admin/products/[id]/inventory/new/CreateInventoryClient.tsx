"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createInventoryEntry } from '@/services/inventoryService';
import { ProductDetails, Size, InventoryCreateData } from '@/types';
import InventoryForm from '@/components/Admin/InventoryForm/InventoryForm';

const CreateInventoryClient = ({ product, availableSizes }: { product: ProductDetails, availableSizes: Size[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: Omit<InventoryCreateData, 'productId'>) => {
        setIsLoading(true);
        try {
            await createInventoryEntry(product.id, data);
            toast.success("Tồn kho đã được thêm!");
            router.push(`/admin/products/${product.id}/inventory`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Tạo tồn kho thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Thêm Tồn kho cho: {product.name}</h1>
            <InventoryForm
                onFormSubmit={handleCreate}
                isLoading={isLoading}
                productName={product.name}
                availableSizes={availableSizes}
            />
        </div>
    );
};

export default CreateInventoryClient;
