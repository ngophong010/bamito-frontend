"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';
import { Role, UserCreateData } from '@/types';
import UserForm from '@/components/Admin/UserForm/UserForm';

// It receives the 'roles' data as a prop.
const CreateUserClient = ({ roles }: { roles: Role[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: UserCreateData) => {
        // ... (same as before)
    };

    return (
        <div>
            <h1>Tạo Người dùng Mới</h1>
            <UserForm
                onFormSubmit={handleCreate}
                isLoading={isLoading}
                roles={roles}
            />
        </div>
    );
};

export default CreateUserClient;
