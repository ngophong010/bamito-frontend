import apiClient from './apiClient';
import { RoleRepository } from '@/repositories/RoleRepository';
import { Role } from '@/types/role';

class RoleService {
    private repository: RoleRepository;

    constructor() {
        this.repository = new RoleRepository(apiClient);
    }

    /**
     * Get all available roles
     */
    async getAllRoles(): Promise<Role[]> {
        return this.repository.getAllRoles();
    }

    /**
     * Get role by roleId
     */
    async getRoleByRoleId(roleId: string): Promise<Role> {
        return this.repository.getRoleByRoleId(roleId);
    }
}

// Export singleton instance
export const roleService = new RoleService();
export default roleService;