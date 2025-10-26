"use client";
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { Category, CategoryCreateData } from '@/types';
import { createSlug } from '@/lib/utils/slug'; // Assuming you have a slug utility

interface CategoryFormProps {
    onFormSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    initialData?: Category;
}

// The shape of our form data
type FormInputs = CategoryCreateData;

const CategoryForm = ({ onFormSubmit, isLoading, initialData }: CategoryFormProps) => {
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormInputs>({
        // Use the initialData to pre-fill the form in "edit" mode
        defaultValues: initialData || { categoryId: '', name: '' }
    });

    const categoryName = watch('name');

    // Effect to auto-generate the categoryId slug from the name
    useEffect(() => {
        if (categoryName && !initialData) { // Only auto-generate for new categories
            setValue('categoryId', createSlug(categoryName).toUpperCase(), { shouldValidate: true });
        }
    }, [categoryName, setValue, initialData]);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        onFormSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="category-form">
            <Controller
                name="name"
                control={control}
                rules={{ required: "Category name is required" }}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        label="Category Name" 
                        variant="outlined" 
                        error={!!errors.name} 
                        helperText={errors.name?.message} 
                        fullWidth 
                        margin="normal" 
                    />
                )}
            />
            <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category ID is required" }}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        label="Category ID (Auto-generated)" 
                        variant="outlined" 
                        error={!!errors.categoryId} 
                        helperText={errors.categoryId?.message} 
                        fullWidth 
                        margin="normal" 
                        InputProps={{ readOnly: !!initialData }} // Make it read-only when editing
                    />
                )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
            </Button>
        </form>
    );
};

export default CategoryForm;
