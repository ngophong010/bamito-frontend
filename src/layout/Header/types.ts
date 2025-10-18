import { Category } from '@/types';

export interface HeaderProps {
    categories: Category[];
}

export interface HeaderState {
    isProductMenuOpen: boolean;
    isMenuVisible: boolean;
}

export interface CartState {
    totalCount: number;
}

export interface UserProfileState {
    isLoggedIn: boolean;
    profile: {
        avatar: string | null;
        role: {
            roleId: string;
        };
    } | null;
}