"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

// 1. Import correct hooks, actions, and types
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { logOut } from "@/redux-toolkit/userSlice"; // Assuming this is an async thunk now
import { Category } from "@/types";
import UserMenu from "@/components/UserMenu/UserMenu";
import { USER_MENU, MenuItem } from "@/config/menu";
import Search from "@/components/Search/Search";
import TippyCart from "@/components/TippyCart/TippyCart";
import CategoriesMenu from "@/components/CategoriesMenu/CategoriesMenu";
import "./Header.scss";

// Define the props the Header will receive
interface HeaderProps {
    categories: Category[];
}

const Header = ({ categories }: HeaderProps) => {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {isLoggedIn, profile} = useAppSelector((state) => state.user);

  // 2. Select all necessary data from Redux in a clean way
  const { isLoggedIn, profile } = useAppSelector((state) => state.user);
  const { totalCount: productCountInCart } = useAppSelector((state) => state.cart);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
    const showMenu = () => setIsMenuVisible(true);
    const hideMenu = () => setIsMenuVisible(false);

  // --- 3. THE LOGIC NOW LIVES IN THE PARENT ---
  // Use useMemo to filter the menu items based on the user's role.
  // This only recalculates when the user's profile changes.
  const visibleMenuItems = useMemo(() => {
    if (!profile) return [];
    return USER_MENU.filter(item => 
      !item.requiredRole || item.requiredRole === profile.role.roleId
    );
  }, [profile]);

  const handleUserMenuItemClick = useCallback((item: MenuItem) => {
    if (item.action === "LOGOUT") {
      dispatch(logOut()).then(() => router.push('/'));
    }
  }, [router, router]);

  // Use useCallback for memoized event handlers
  const handleLogOut = useCallback(() => {
    // Dispatch the async thunk for logout
    dispatch(logOut()).then(() => router.push('/'));
  }, [dispatch, router]);

  return (
    <header className="header-container">
      <Link href="/">
        <Image src="/images/color-logo.png" alt="logo" height={50} width={100} />
      </Link>

      <nav className="header-nav">
        {/* Product Categories Dropdown */}
        <Tippy
          visible={isMenuVisible}
                onClickOutside={hideMenu}
                placement="bottom"
                interactive
                delay={[0, 300]}
                render={(attrs) => (
                    <div className="drop-down-menu" tabIndex={-1} {...attrs}>
                        {/* Pass the categories and the hideMenu function as a prop */}
                        <CategoriesMenu categories={categories} onLinkClick={hideMenu} />
                    </div>
                )}
        >
          <div className="drop-down-product" onMouseEnter={showMenu} onMouseLeave={hideMenu}>
            <span className={`text ${isProductMenuOpen ? "is-tippy-on" : ""}`}>SẢN PHẨM</span>
            <FontAwesomeIcon icon={faChevronDown} className={`icon ${isProductMenuOpen ? "is-tippy-on" : ""}`} />
          </div>
        </Tippy>

        <Link href="/sale-off" className="nav-link">SALE OFF</Link>
        <Link href="/feed" className="nav-link">TIN TỨC</Link>
      </nav>

      <Search />

      <div className="header-wrap-cart-actions">
        {/* Cart Icon and Tippy */}
        {isLoggedIn && (
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
              {productCountInCart > 0 && (
                <span className="header-cart-notification">{productCountInCart}</span>
              )}
            </Link>
          </Tippy>
        )}

        {/* User Menu or Login Button */}
        {isLoggedIn && profile && (
          <Tippy
            interactive
            placement="bottom-end"
            delay={[0, 300]}
            render={(attrs) => (
              <UserMenu
                attrs={attrs}
                menuItems={visibleMenuItems} // Pass the pre-filtered list
                onItemClick={handleUserMenuItemClick} // Pass the single handler
              />
            )}
          >
            <button className="header-action-btn">
              <Image
                src={profile.avatar || "/images/default-avatar.png"}
                alt="User avatar"
                fill
                className="action-avatar"
              />
            </button>
          </Tippy>
        ) : (
          <Link href="/login" className="login-btn">
            <FontAwesomeIcon icon={faRightToBracket} />
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
