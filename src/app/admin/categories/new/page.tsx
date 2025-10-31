"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { categoryService } from '@/services/categoryService';
import { CategoryCreateData } from '@/types';
import CategoryForm from '../CategoryForm'; // A new, reusable form component

const CreateCategoryPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: CategoryCreateData) => {
        setIsLoading(true);
        try {
            await categoryService.createCategory(data);
            toast.success("Thêm danh mục thành công!");
            router.push('/admin/categories');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Tạo danh mục thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tạo Danh mục Mới</h1>
            <CategoryForm onFormSubmit={handleCreate} isLoading={isLoading} />
        </div>
    );
};

export default CreateCategoryPage;
