import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { Role } from '@/types/role';
import { SuccessApiResponse } from '@/types/common';
import { handleAxiosError } from './errors/RepositoryError';

export class RoleRepository extends BaseRepository<Role> {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, '/roles');
    }

    /**
     * Get all available roles
     */
    async getAllRoles(): Promise<Role[]> {
        try {
            const response = await this.apiClient.get<SuccessApiResponse<Role[]>>(this.basePath);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Get role by roleId (e.g., 'R1', 'R2', 'R3')
     */
    async getRoleByRoleId(roleId: string): Promise<Role> {
        try {
            const response = await this.apiClient.get<SuccessApiResponse<Role>>(`${this.basePath}/${roleId}`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
}
