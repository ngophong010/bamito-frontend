"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createProduct } from '@/services/productService';
import { Brand, Category } from '@/types';
import ProductForm from '@/components/Admin/ProductForm/ProductForm';

const CreateProductClient = ({ brands, categories }: { brands: Brand[], categories: Category[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: FormData) => {
        setIsLoading(true);
        try {
            await createProduct(data);
            toast.success("Thêm sản phẩm thành công!");
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Tạo sản phẩm thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tạo Sản phẩm mới</h1>
            <ProductForm
                onFormSubmit={handleCreate}
                isLoading={isLoading}
                brands={brands}
                categories={categories}
            />
        </div>
    );
};

export default CreateProductClient;
