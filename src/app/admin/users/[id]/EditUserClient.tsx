"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateUser } from '@/services/userService';
import { Role, User, UserUpdateData } from '@/types';
import UserForm from '@/components/Admin/UserForm/UserForm';

const EditUserClient = ({ user, roles }: { user: User, roles: Role[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdate = async (data: UserUpdateData) => {
        setIsLoading(true);
        // Don't send an empty password field
        if (data.password === '') {
            delete data.password;
        }
        try {
            await updateUser(user.id, data);
            toast.success("Cập nhật người dùng thành công!");
            router.push('/admin/users');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Chỉnh sửa Người dùng: {user.userName}</h1>
            <UserForm
                onFormSubmit={handleUpdate}
                isLoading={isLoading}
                initialData={user}
                roles={roles}
            />
        </div>
    );
};
export default EditUserClient;