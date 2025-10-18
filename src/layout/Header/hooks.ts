import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/hooks';
import { logOut } from '@/redux-toolkit/userSlice';
import { MenuItem, USER_MENU } from '@/config/menu';
import { UserProfileState } from './types';

export const useHeaderState = () => {
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const showMenu = useCallback(() => setIsMenuVisible(true), []);
    const hideMenu = useCallback(() => setIsMenuVisible(false), []);

    return {
        isProductMenuOpen,
        setIsProductMenuOpen,
        isMenuVisible,
        showMenu,
        hideMenu
    };
};

export const useUserMenu = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoggedIn, profile } = useAppSelector((state) => state.user as UserProfileState);

    const visibleMenuItems = useMemo(() => {
        if (!profile) return [];
        return USER_MENU.filter(item => 
            !item.requiredRole || item.requiredRole === profile.role.roleId
        );
    }, [profile]);

    const handleUserMenuItemClick = useCallback((item: MenuItem) => {
        if (item.action === 'LOGOUT') {
            dispatch(logOut());
            router.push('/');
        }
    }, [dispatch, router]);

    return {
        isLoggedIn,
        profile,
        visibleMenuItems,
        handleUserMenuItemClick
    };
};

export const useCart = () => {
    const { totalCount } = useAppSelector((state) => state.cart);
    return { totalCount };
};