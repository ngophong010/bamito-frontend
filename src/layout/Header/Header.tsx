"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "@/components/Search/Search";
import { HeaderProps } from './types';
import { Navigation } from './components/Navigation';
import { CartButton } from './components/CartButton';
import { UserSection } from './components/UserSection';
import { useHeaderState, useUserMenu, useCart } from './hooks';
import "./Header.scss";

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { 
    isProductMenuOpen, 
    isMenuVisible, 
    showMenu, 
    hideMenu 
  } = useHeaderState();

  const {
    isLoggedIn,
    profile,
    visibleMenuItems,
    handleUserMenuItemClick
  } = useUserMenu();

  const { totalCount: productCountInCart } = useCart();

  return (
    <header className="header-container">
      <Link href="/">
        <Image src="/images/color-logo.png" alt="logo" height={50} width={100} />
      </Link>

      <Navigation
        categories={categories}
        isMenuVisible={isMenuVisible}
        isProductMenuOpen={isProductMenuOpen}
        showMenu={showMenu}
        hideMenu={hideMenu}
      />

      <Search />

      <div className="header-wrap-cart-actions">
        {isLoggedIn && (
          <CartButton totalCount={productCountInCart} />
        )}

        <UserSection
          isLoggedIn={isLoggedIn}
          profile={profile}
          visibleMenuItems={visibleMenuItems}
          onUserMenuItemClick={handleUserMenuItemClick}
        />
      </div>
    </header>
  );
};

export default Header;
