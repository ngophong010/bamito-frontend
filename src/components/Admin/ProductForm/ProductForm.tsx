"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

import { ProductDetails, Brand, Category, ProductCreateData } from '@/types';

const mdParser = new MarkdownIt();

interface ProductFormProps {
    onFormSubmit: (data: FormData) => void;
    isLoading: boolean;
    initialData?: ProductDetails; // Optional data for pre-filling the form
    brands: Brand[];
    categories: Category[];
}

// Define the shape of our form, which can be different from the API DTO
type FormInputs = Omit<ProductCreateData, 'brandId' | 'categoryId'> & {
    brandId: string; // Use string for the form field
    categoryId: string;
    imageFile?: FileList;
};


const ProductForm = ({ onFormSubmit, isLoading, initialData, brands, categories }: ProductFormProps) => {
    const { handleSubmit, control, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            productId: initialData?.productId || '',
            name: initialData?.name || '',
            price: initialData?.price || 0,
            discount: initialData?.discount || 0,
            brandId: initialData?.brand.id.toString() || '',
            categoryId: initialData?.category.id.toString() || '',
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

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const formData = new FormData();

        // Append all form data to the FormData object
        (Object.keys(data) as Array<keyof FormInputs>).forEach(key => {
            if (key === 'imageFile' && data.imageFile?.[0]) {
                formData.append('image', data.imageFile[0]);
            } else if (key !== 'imageFile') {
                formData.append(key, String(data[key]));
            }
        });
        formData.append('descriptionHTML', descriptionHTML);
        
        onFormSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="product-form">
            {/* Image Upload and Preview */}
            <div className="image-upload-section">
                <Image src={previewImage} alt="Product Preview" width={200} height={200} />
                <Controller
                    name="imageFile"
                    control={control}
                    render={({ field }) => (
                        <Button component="label" variant="contained">
                            Upload Image
                            <input type="file" hidden onChange={(e) => { field.onChange(e.target.files); handleImageChange(e); }} />
                        </Button>
                    )}
                />
            </div>

            {/* Form Fields using Controller */}
            <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Product Name" fullWidth />} />
            <Controller name="price" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Price" type="number" fullWidth />} />
            <Controller name="brandId" control={control} rules={{ required: true }} render={({ field }) => (
                <TextField {...field} label="Brand" select fullWidth>
                    {brands.map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
                </TextField>
            )} />
            {/* ... other fields for category, discount, etc. ... */}

            {/* Markdown Editor */}
            <MdEditor
                style={{ height: "500px" }}
                value={descriptionHTML}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
            />

            <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
        </form>
    );
};

export default ProductForm;
