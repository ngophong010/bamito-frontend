"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';

import { Voucher, VoucherCreateData } from '@/types';

interface VoucherFormProps {
    onFormSubmit: (data: FormData) => void;
    isLoading: boolean;
    initialData?: Voucher;
}

type FormInputs = Omit<VoucherCreateData, 'startDate' | 'endDate'> & {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    image?: FileList;
};

const VoucherForm = ({ onFormSubmit, isLoading, initialData }: VoucherFormProps) => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            code: initialData?.voucherId || '',
            discountType: 'fixed' as const,
            discountValue: initialData?.voucherPrice || 0,
            quantity: initialData?.quantity || 0,
            startDate: initialData ? dayjs(initialData.timeStart) : null,
            endDate: initialData ? dayjs(initialData.timeEnd) : null,
        }
    });

    const [previewImage, setPreviewImage] = useState(initialData?.image || '/images/ImgNoProduct.png');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'image' && value instanceof FileList && value[0]) {
                formData.append('image', value[0]);
            } else if ((key === 'startDate' || key === 'endDate') && value) {
                formData.append(key, (value as dayjs.Dayjs).toISOString());
            } else if (value) {
                formData.append(key, String(value));
            }
        });
        onFormSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="voucher-form">
            <div className="image-upload-section">
                <Image src={previewImage} alt="Voucher Preview" width={200} height={250} style={{ objectFit: 'contain' }}/>
                <Controller
                    name="image"
                    control={control}
                    rules={{ required: !initialData }}
                    render={({ field }) => (
                        <Button component="label" variant="contained">
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={(e) => { field.onChange(e.target.files); handleImageChange(e); }} />
                        </Button>
                    )}
                />
                 {errors.image && <p className="error-message">An image is required.</p>}
            </div>

            <Controller name="code" control={control} rules={{ required: "Voucher code is required" }} render={({ field }) => <TextField {...field} label="Voucher Code" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} />} />
            <Controller name="discountValue" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Discount Value (VND)" type="number" fullWidth margin="normal" />} />
            <Controller name="quantity" control={control} rules={{ required: true, min: 0 }} render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth margin="normal" />} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller name="startDate" control={control} rules={{ required: true }} render={({ field }) => <DatePicker {...field} label="Start Date" />} />
                <Controller name="endDate" control={control} rules={{ required: true }} render={({ field }) => <DatePicker {...field} label="End Date" />} />
            </LocalizationProvider>
            
            <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Voucher' : 'Create Voucher')}
            </Button>
        </form>
    );
};

export default VoucherForm;
