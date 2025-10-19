"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';
import { Size, Category, SizeCreateData } from '@/types';
import { createSlug } from '@/utils/slug';

interface SizeFormProps {
    onFormSubmit: (data: any) => void;
    isLoading: boolean;
    initialData?: Size;
    categories: Category[]; // Pass the list of categories for the dropdown
}

type FormInputs = SizeCreateData;

const SizeForm = ({ onFormSubmit, isLoading, initialData, categories }: SizeFormProps) => {
    const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            sizeId: initialData?.sizeId || '',
            name: initialData?.name || '',
            categoryId: initialData?.categoryId || undefined,
        }
    });

    const sizeName = watch('name');

    useEffect(() => {
        if (sizeName && !initialData) { // Only auto-gen for new sizes
            setValue('sizeId', createSlug(sizeName).toUpperCase(), { shouldValidate: true });
        }
    }, [sizeName, setValue, initialData]);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        onFormSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="size-form">
            <Controller
                name="name"
                control={control}
                rules={{ required: "Size name is required" }}
                render={({ field }) => (
                    <TextField {...field} label="Size Name (e.g., M, 4U, 42)" variant="outlined" error={!!errors.name} helperText={errors.name?.message} fullWidth margin="normal" />
                )}
            />
            <Controller
                name="sizeId"
                control={control}
                rules={{ required: "Size ID is required" }}
                render={({ field }) => (
                    <TextField {...field} label="Size ID (Auto-generated)" variant="outlined" error={!!errors.sizeId} helperText={errors.sizeId?.message} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                )}
            />
            <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Please select a category" }}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        label="Category" 
                        select 
                        fullWidth 
                        margin="normal"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                        disabled={!!initialData} // Usually can't change a size's category
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>
                )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Size' : 'Create Size')}
            </Button>
        </form>
    );
};

export default SizeForm;
