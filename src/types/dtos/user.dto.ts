export interface CreateUserDTO {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    birthday?: string;
    avatar?: string;
    roleId?: number;
}

export interface UpdateUserDTO {
    userName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    birthday?: string;
    avatar?: string;
    status?: number;
    roleId?: string;
}

export interface UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

export interface UserFilterParams {
    search?: string;
    status?: number[];
    roleId?: number[];
    page?: number;
    limit?: number;
    sort?: string;
}

export interface UserStatsResponse {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
    newUsersThisMonth: number;
    registrationTrend: {
        date: string;
        count: number;
    }[];
}
