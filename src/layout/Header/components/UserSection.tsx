import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Tippy from '@tippyjs/react/headless';
import UserMenu from '@/components/UserMenu/UserMenu';
import { MenuItem } from '@/config/menu';

interface UserSectionProps {
    isLoggedIn: boolean;
    profile: { avatar: string | null } | null;
    visibleMenuItems: MenuItem[];
    onUserMenuItemClick: (item: MenuItem) => void;
}

export const UserSection: React.FC<UserSectionProps> = ({
    isLoggedIn,
    profile,
    visibleMenuItems,
    onUserMenuItemClick
}) => {
    if (!isLoggedIn) {
        return (
            <Link href="/login" className="login-btn">
                <FontAwesomeIcon icon={faRightToBracket} />
                Đăng nhập
            </Link>
        );
    }

    return (
        <Tippy
            interactive
            placement="bottom-end"
            delay={[0, 300]}
            render={(attrs) => (
                <UserMenu
                    attrs={attrs}
                    menuItems={visibleMenuItems}
                    onItemClick={onUserMenuItemClick}
                />
            )}
        >
            <button className="header-action-btn">
                <Image
                    src={profile?.avatar || '/images/default-avatar.png'}
                    alt="User avatar"
                    fill
                    className="action-avatar"
                />
            </button>
        </Tippy>
    );
};
