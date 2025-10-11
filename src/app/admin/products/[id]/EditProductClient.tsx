"use client";
// This component is almost identical to CreateProductClient,
// but it calls the `updateProduct` service and passes `initialData`.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateProduct } from '@/services/productService';
import { Brand, Category, ProductDetails } from '@/types';
import ProductForm from '@/components/Admin/ProductForm/ProductForm';

const EditProductClient = ({ product, brands, categories }: { product: ProductDetails, brands: Brand[], categories: Category[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: FormData) => {
        setIsLoading(true);
        try {
            await updateProduct(product.id, data);
            toast.success("Cập nhật sản phẩm thành công!");
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa: {product.name}</h1>
            <ProductForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={product} // Pass the initial data to pre-fill the form
                brands={brands}
                categories={categories}
            />
        </div>
    );
};

export default EditProductClient;
