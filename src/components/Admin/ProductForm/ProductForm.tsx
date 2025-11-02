"use client";
import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Image from 'next/image';
import markdownit from 'markdown-it';
import { ProductDetails, Brand, Category, ProductCreateData, PRODUCT_VALIDATION_RULES } from '@/types';
import styles from './ProductForm.module.scss';

const mdParser = new markdownit({
    html: true,
    linkify: true,
    typographer: true
});

interface ProductFormProps {
    onFormSubmit: (data: FormData) => Promise<void>;
    isLoading: boolean;
    initialData?: ProductDetails;
    brands: Brand[];
    categories: Category[];
}

type FormInputs = Omit<ProductCreateData, 'brandId' | 'categoryId'> & {
    brandId: string;
    categoryId: string;
    imageFile?: FileList;
    descriptionHTML: string;
};


const ProductForm = ({ onFormSubmit, isLoading, initialData, brands, categories }: ProductFormProps) => {
    const { handleSubmit, control } = useForm<FormInputs>({
        defaultValues: {
            productId: initialData?.productId || '',
            name: initialData?.name || '',
            price: initialData?.price || 0,
            discount: initialData?.discount || 0,
            brandId: initialData?.brand?.brandId?.toString() || '',
            categoryId: initialData?.category?.categoryId?.toString() || '',
        }
    });

    const [descriptionHTML, setDescriptionHTML] = useState(initialData?.descriptionHTML || '');
    const [previewImage, setPreviewImage] = useState(initialData?.image || '/images/ImgNoProduct.png');

    const handleEditorChange = ({ html, text }: { html: string; text: string }) => {
        setDescriptionHTML(html);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        try {
            const formData = new FormData();

            // Convert string IDs to numbers for the API
            const numericBrandId = Number.parseInt(data.brandId, 10);
            const numericCategoryId = Number.parseInt(data.categoryId, 10);

            // Append basic fields
            formData.append('productId', data.productId);
            formData.append('name', data.name);
            formData.append('price', String(data.price));
            formData.append('discount', String(data.discount));
            formData.append('brandId', String(numericBrandId));
            formData.append('categoryId', String(numericCategoryId));
            formData.append('descriptionHTML', descriptionHTML);

            // Append image if provided
            if (data.imageFile?.[0]) {
                formData.append('image', data.imageFile[0]);
            }

            await onFormSubmit(formData);
        } catch (error) {
            console.error('Error submitting product form:', error);
            // You might want to show an error toast here
        }
    };

    const getSubmitButtonLabel = (isLoading: boolean, isEditing: boolean): string => {
        if (isLoading) return 'Saving...';
        if (isEditing) return 'Update Product';
        return 'Create Product';
    };

    const isEditing = Boolean(initialData);
    const submitButtonLabel = getSubmitButtonLabel(isLoading, isEditing);


    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles['product-form']}>
            <div className={styles['product-form__header']}>
                <Typography variant="h5" component="h2">
                    {initialData ? 'Edit Product' : 'Create New Product'}
                </Typography>
            </div>

            {/* Image Upload and Preview */}
            <div className={styles['product-form__image-section']}>
                <Image
                    src={previewImage}
                    alt="Product Preview"
                    width={200}
                    height={200}
                    objectFit="contain"
                />
                <Controller
                    name="imageFile"
                    control={control}
                    render={({ field }) => (
                        <Button
                            component="label"
                            variant="contained"
                            color="primary"
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography>Add Images</Typography>
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        field.onChange(e.target.files);
                                        handleImageChange(e);
                                    }}
                                />
                            </Box>
                        </Button>
                    )}
                />
            </div>

            {/* Basic Information */}
            <div className={styles['product-form__field-group']}>
                <Controller
                    name="productId"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.productId}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Product ID"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="name"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.name}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Product Name"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        />
                    )}
                />
            </div>

            {/* Price and Discount */}
            <div className={styles['product-form__field-group']}>
                <Controller
                    name="price"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.price}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Price"
                            type="number"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="discount"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.discount}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Discount (%)"
                            type="number"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        />
                    )}
                />
            </div>

            {/* Category and Brand */}
            <div className={styles['product-form__field-group']}>
                <Controller
                    name="categoryId"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.categoryId}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            select
                            label="Category"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        >
                            {categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                <Controller
                    name="brandId"
                    control={control}
                    rules={PRODUCT_VALIDATION_RULES.brandId}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            select
                            label="Brand"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                        >
                            {brands.map(brand => (
                                <MenuItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </div>

            {/* Description Editor */}
            <div className={styles['product-form__editor-section']}>
                <Typography variant="subtitle1" gutterBottom>
                    Product Description
                </Typography>
                <MdEditor
                    style={{ height: "400px" }}
                    value={descriptionHTML}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                    view={{ menu: true, md: true, html: true }}
                    canView={{ menu: true, md: true, html: true, both: false, fullScreen: true, hideMenu: true }}
                />
            </div>

            {/* Form Actions */}
            <div className={styles['product-form__actions']}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    size="large"
                >
                    {submitButtonLabel}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
