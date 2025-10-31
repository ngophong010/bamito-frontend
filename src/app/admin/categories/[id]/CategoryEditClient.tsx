"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { categoryService } from '@/services/categoryService';
import { Category, CategoryUpdateData } from '@/types';
import CategoryForm from '../CategoryForm'; // Reusing the same form component

const CategoryEditClient = ({ category }: { category: Category }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: CategoryUpdateData) => {
        setIsLoading(true);
        try {
            await categoryService.updateCategory(category.id, data);
            toast.success("Cập nhật danh mục thành công!");
            router.push('/admin/categories');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Danh mục: {category.name}</h1>
            <CategoryForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={category}
            />
        </div>
    );
};

export default CategoryEditClient;
