import apiClient from './apiClient';
import { UserRepository } from '@/repositories/UserRepository';
import { UserProfile, UserProfileUpdateData, ChangePasswordData } from '@/types/user';

class ProfileService {
    private readonly repository: UserRepository;

    constructor() {
        this.repository = new UserRepository(apiClient);
    }

    async getProfile(): Promise<UserProfile> {
        return this.repository.getProfile();
    }

    async updateProfile(data: UserProfileUpdateData, avatarFile?: File): Promise<UserProfile> {
        if (avatarFile) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });
            formData.append('avatar', avatarFile);
            return this.repository.updateProfileWithAvatar(formData);
        }
        return this.repository.updateProfile(data);
    }

    async changePassword(data: ChangePasswordData): Promise<void> {
        return this.repository.changePassword(data);
    }
}

export const profileService = new ProfileService();
export default profileService;