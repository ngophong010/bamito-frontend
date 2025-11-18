// src/layout/Header/components/Navigation.tsx (with MUI)
import React, { useState } from 'react';
import Link from 'next/link';
import { Popover, Button, Box } from '@mui/material'; // Import MUI components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CategoriesMenu from '@/components/CategoriesMenu/CategoriesMenu';
import { Category } from '@/types';

// Props are the same...
interface NavigationProps { categories: Category[] }

export const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  // MUI's Popover controls its own state, which is very convenient
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <nav className="header-nav">
      {/* The trigger button */}
      <Button
        aria-owns={isOpen ? 'product-menu-popover' : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
        className="drop-down-product" // Your custom class
        endIcon={<FontAwesomeIcon icon={faChevronDown} />}
      >
        SẢN PHẨM
      </Button>

      {/* The Popover component itself */}
      <Popover
        id="product-menu-popover"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        // Disables the default Material-UI background styles
        slotProps={{ paper: { sx: { background: 'none', boxShadow: 'none' } } }}
      >
        {/* You can place your existing dropdown menu component right here */}
        <div className="drop-down-menu">
            <CategoriesMenu categories={categories} onLinkClick={handleCloseMenu} />
        </div>
      </Popover>

      <Link href="/sale-off" className="nav-link">SALE OFF</Link>
      <Link href="/feed" className="nav-link">TIN TỨC</Link>
    </nav>
  );
};
