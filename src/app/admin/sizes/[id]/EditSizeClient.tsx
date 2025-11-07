"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { sizeService } from '@/services/sizeService';
import { Category, Size, SizeUpdateData } from '@/types';
import SizeForm from '@/components/Admin/SizeForm/SizeForm';

const EditSizeClient = ({ size, categories }: { size: Size, categories: Category[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: SizeUpdateData) => {
        setIsLoading(true);
        try {
            await sizeService.updateSize(size.id, data);
            toast.success("Cập nhật kích thước thành công!");
            router.push('/admin/sizes');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Kích thước: {size.name}</h1>
            <SizeForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={size}
                categories={categories}
            />
        </div>
    );
};

export default EditSizeClient;
