"use client";
import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';
import { Inventory, Size, InventoryCreateData } from '@/types';

interface InventoryFormProps {
    onFormSubmit: (data: any) => void;
    isLoading: boolean;
    initialData?: Inventory; // Optional data for pre-filling the form
    availableSizes: Size[]; // A list of sizes that can be added
    productName: string;
}

// The shape of our form data
type FormInputs = Omit<InventoryCreateData, 'productId'>;

const InventoryForm = ({ onFormSubmit, isLoading, initialData, availableSizes, productName }: InventoryFormProps) => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            sizeId: initialData?.size.id || undefined,
            quantity: initialData?.quantity || 0,
        }
    });

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        onFormSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="inventory-form">
            <TextField
                label="Product Name"
                value={productName}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            
            <Controller
                name="sizeId"
                control={control}
                rules={{ required: "Please select a size" }}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        label="Size" 
                        select 
                        fullWidth 
                        margin="normal"
                        error={!!errors.sizeId}
                        helperText={errors.sizeId?.message}
                        disabled={!!initialData} // Disable changing the size when editing
                    >
                        {availableSizes.map(size => (
                            <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                        ))}
                    </TextField>
                )}
            />
            
            <Controller
                name="quantity"
                control={control}
                rules={{ required: "Please enter a quantity", min: { value: 0, message: "Quantity cannot be negative"} }}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        label="Stock Quantity" 
                        type="number" 
                        fullWidth 
                        margin="normal" 
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                    />
                )}
            />

            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Inventory' : 'Add to Inventory')}
            </Button>
        </form>
    );
};

export default InventoryForm;
