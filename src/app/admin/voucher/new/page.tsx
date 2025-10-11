"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createVoucher } from '@/services/voucherService';
import VoucherForm from '@/components/Admin/VoucherForm/VoucherForm';

const CreateVoucherPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: FormData) => {
        setIsLoading(true);
        try {
            await createVoucher(data);
            toast.success("Thêm voucher thành công!");
            router.push('/admin/vouchers');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Tạo voucher thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Tạo Voucher Mới</h1>
            <VoucherForm onFormSubmit={handleCreate} isLoading={isLoading} />
        </div>
    );
};

export default CreateVoucherPage;
