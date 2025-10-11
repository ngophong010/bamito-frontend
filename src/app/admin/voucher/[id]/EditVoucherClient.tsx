"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateVoucher } from '@/services/voucherService';
import { Voucher } from '@/types';
import VoucherForm from '@/components/Admin/VoucherForm/VoucherForm';

const EditVoucherClient = ({ voucher }: { voucher: Voucher }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: FormData) => {
        setIsLoading(true);
        try {
            await updateVoucher(voucher.id, data);
            toast.success("Cập nhật voucher thành công!");
            router.push('/admin/vouchers');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Voucher: {voucher.voucherId}</h1>
            <VoucherForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={voucher}
            />
        </div>
    );
};

export default EditVoucherClient;
