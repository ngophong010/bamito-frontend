"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { sizeService } from '@/services/sizeService';
import { Category, SizeCreateData } from '@/types';
import SizeForm from '@/components/Admin/SizeForm/SizeForm';
const CreateSizeClient = ({ categories }: { categories: Category[] }) => {
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);

const handleCreate = async (data: SizeCreateData) => {
    setIsLoading(true);
    try {
        await sizeService.createSize(data);
        toast.success("Thêm kích thước thành công!");
        router.push('/admin/sizes');
        router.refresh();
    } catch (error: any) {
        toast.error(error.message || "Tạo kích thước thất bại.");
    } finally {
        setIsLoading(false);
    }
};

return (
    <div>
        <h1>Tạo Kích thước Mới</h1>
        <SizeForm
            onFormSubmit={handleCreate}
            isLoading={isLoading}
            categories={categories}
        />
    </div>
);
};

export default CreateSizeClient;
