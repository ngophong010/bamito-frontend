import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Popover } from '@mui/material';
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
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    if (!isLoggedIn) {
        return (
            <Link href="/login" className="login-btn">
                <FontAwesomeIcon icon={faRightToBracket} />
                Đăng nhập
            </Link>
        );
    }

    return (
        <>
            <div tabIndex={0} role="button">
                <button 
                    className="header-action-btn"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <Image
                        src={profile?.avatar || '/images/default-avatar.png'}
                        alt="User avatar"
                        width={50}
                        height={50}
                        className="action-avatar"
                    />
                </button>
            </div>
            
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <UserMenu
                    attrs={{}}
                    menuItems={visibleMenuItems}
                    onItemClick={onUserMenuItemClick}
                />
            </Popover>
        </>
    );
};
