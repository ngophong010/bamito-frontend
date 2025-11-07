"use client";
// This component is very similar to CreateBrandPage, but it receives initial data.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { brandService } from '@/services/brandService';
import { Brand, BrandUpdateData } from '@/types';
import BrandForm from '../BrandForm';

const BrandEditClient = ({ brand }: { brand: Brand }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: BrandUpdateData) => {
        setIsLoading(true);
        try {
            await brandService.updateBrand(brand.id, data);
            toast.success("Cập nhật thương hiệu thành công!");
            router.push('/admin/brands');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Thương hiệu: {brand.name}</h1>
            <BrandForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={brand} // Pass initial data to the form
            />
        </div>
    );
};

export default BrandEditClient;
