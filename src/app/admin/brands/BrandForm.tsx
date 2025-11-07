"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { Brand, BrandCreateData } from '@/types';
import { createSlug } from '@/lib/utils/slug'; // Assuming you have this

// --- PROPS DEFINITION ---
interface BrandFormProps {
    onFormSubmit: (data: any) => Promise<void>; // Can be improved
    isLoading: boolean;
    initialData?: Brand; // Optional initial data for editing
}

// Define the shape of the form's data
type FormInputs = BrandCreateData;

const BrandForm = ({ onFormSubmit, isLoading, initialData }: BrandFormProps) => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        watch,
    } = useForm<FormInputs>({
        defaultValues: initialData || { brandId: '', name: '' }
    });

    const brandName = watch('name');

    // Effect to auto-generate the slug-like brandId
    useEffect(() => {
        if (brandName) {
            setValue('brandId', createSlug(brandName).toUpperCase(), { shouldValidate: true });
        }
    }, [brandName, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        onFormSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="brand-form">
            <Controller
                name="name"
                control={control}
                rules={{ required: "Brand name is required" }}
                render={({ field }) => (
                    <TextField {...field} label="Brand Name" variant="outlined" error={!!errors.name} helperText={errors.name?.message} fullWidth margin="normal" />
                )}
            />
            <Controller
                name="brandId"
                control={control}
                rules={{ required: "Brand ID is required" }}
                render={({ field }) => (
                    <TextField {...field} label="Brand ID (Auto-generated)" variant="outlined" error={!!errors.brandId} helperText={errors.brandId?.message} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Brand' : 'Create Brand')}
            </Button>
        </form>
    );
};

export default BrandForm;
