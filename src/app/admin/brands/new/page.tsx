"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { brandService } from '@/services/brandService';
import { BrandCreateData } from '@/types';
import BrandForm from '../BrandForm'; // A reusable form component

const CreateBrandPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: BrandCreateData) => {
        setIsLoading(true);
        try {
            await brandService.createBrand(data);
            toast.success("Thêm thương hiệu thành công!");
            router.push('/admin/brands');
            router.refresh(); // Ensure the list page gets the new data
        } catch (error: any) {
            toast.error(error.message || "Tạo thương hiệu thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tạo Thương hiệu Mới</h1>
            <BrandForm
                onFormSubmit={handleCreate}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CreateBrandPage;
