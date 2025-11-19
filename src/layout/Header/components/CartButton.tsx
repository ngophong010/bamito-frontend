import React, { useState } from 'react';
import Link from 'next/link';
import { Popover, Box } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TippyCart from '@/components/TippyCart/TippyCart';

interface CartButtonProps {
    totalCount: number;
}

export const CartButton: React.FC<CartButtonProps> = ({ totalCount }: CartButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div className="cart-button" onClick={handleClick}>
                <ShoppingCartOutlinedIcon />
                {totalCount > 0 && (
                    <span className="cart-count">{totalCount}</span>
                )}
            </div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <TippyCart />
                </Box>
            </Popover>
        </>
    );
};

