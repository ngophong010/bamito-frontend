"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { userService } from '@/services/userService';
import { PaginatedApiResponse, User } from '@/types';

interface UserListClientProps {
  initialUserData: PaginatedApiResponse<User>;
}

const UserListClient = ({ initialUserData }: UserListClientProps) => {
    const router = useRouter();

    const handleDelete = async (user: User) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.userName}"?`)) {
            try {
                await userService.deleteUser(user.id);
                toast.success("Xóa người dùng thành công!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Xóa người dùng thất bại.");
            }
        }
    };

    const tableColumns = [
        { label: "STT", render: (item: User, index: number) => <span>{(initialUserData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "TÊN", render: (item: User) => <span>{item.userName}</span> },
        { label: "SỐ ĐIỆN THOẠI", render: (item: User) => <span>{item.phoneNumber || 'N/A'}</span> },
        { label: "EMAIL", render: (item: User) => <span>{item.email}</span> },
        { label: "TRẠNG THÁI", render: (item: User) => <span>{item.status === 1 ? 'Hoạt động' : 'Chưa kích hoạt'}</span> },
        { label: "QUYỀN HẠN", render: (item: User) => <span>{item.role.roleName}</span> },
    ];
    
    return (
        <div>
            <Link href="/admin/users/new" className="add-new-button">Thêm Người dùng mới</Link>

            <GridData
                headerString="Quản lý Người dùng"
                tableData={initialUserData.items}
                tableColumns={tableColumns}
                onEdit={(user) => router.push(`/admin/users/${user.id}`)}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialUserData.currentPage}
                totalPages={initialUserData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default UserListClient;
