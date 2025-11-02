import React from 'react';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TippyCart from '@/components/TippyCart/TippyCart';

interface CartButtonProps {
    totalCount: number;
}

export const CartButton: React.FC<CartButtonProps> = ({ totalCount }) => {
    return (
        <Tippy
            placement="bottom-end"
            interactive
            delay={[0, 100]}
            offset={[-26, 5]}
            render={(attrs) => (
                <div className="drop-down-menu cart-tippy" tabIndex={-1} {...attrs}>
                    <TippyCart />
                </div>
            )}
        >
            <Link href="/user/cart" className="header-cart">
                <ShoppingCartOutlinedIcon className="header-cart-icon" />
                {totalCount > 0 && (
                    <span className="header-cart-notification">{totalCount}</span>
                )}
            </Link>
        </Tippy>
    );
};
