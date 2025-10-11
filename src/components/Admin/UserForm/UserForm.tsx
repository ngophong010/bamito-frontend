"use client";
import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';
import { User, Role, UserCreateData } from '@/types'; // Assuming UserCreateData is defined
import { regex } from '@/utils/regex';

interface UserFormProps {
    onFormSubmit: (data: any) => void;
    isLoading: boolean;
    initialData?: User; // Optional data for pre-filling the form
    roles: Role[]; // Pass the list of roles for the dropdown
}

// Define the shape of our form data, which might differ slightly from the DTO
type FormInputs = Omit<UserCreateData, 'roleId'> & { roleId: string; password?: string };

const UserForm = ({ onFormSubmit, isLoading, initialData, roles }: UserFormProps) => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            userName: initialData?.userName || '',
            email: initialData?.email || '',
            phoneNumber: initialData?.phoneNumber || '',
            password: '', // Always start with an empty password field
            roleId: initialData?.role.id.toString() || '',
        }
    });

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        onFormSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="user-form">
            <Controller name="userName" control={control} rules={{ required: "Username is required" }} render={({ field }) => (
                <TextField {...field} label="Username" fullWidth margin="normal" error={!!errors.userName} helperText={errors.userName?.message} />
            )} />
            
            <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: regex.EMAIL, message: "Invalid email" } }} render={({ field }) => (
                <TextField {...field} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />
            )} />

            <Controller name="phoneNumber" control={control} render={({ field }) => (
                <TextField {...field} label="Phone Number" fullWidth margin="normal" />
            )} />

            <Controller name="roleId" control={control} rules={{ required: "Role is required" }} render={({ field }) => (
                <TextField {...field} label="Role" select fullWidth margin="normal" error={!!errors.roleId} helperText={errors.roleId?.message}>
                    {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.roleName}</MenuItem>)}
                </TextField>
            )} />

            {/* Only require password for new users */}
            <Controller name="password" control={control} rules={{ required: !initialData }} render={({ field }) => (
                <TextField {...field} label="Password" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password ? errors.password.message : "Leave blank to keep current password"} />
            )} />

            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
            </Button>
        </form>
    );
};

export default UserForm;
