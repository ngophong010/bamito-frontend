import React from 'react';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CategoriesMenu from '@/components/CategoriesMenu/CategoriesMenu';
import { Category } from '@/types';

interface NavigationProps {
    categories: Category[];
    isMenuVisible: boolean;
    isProductMenuOpen: boolean;
    showMenu: () => void;
    hideMenu: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
    categories,
    isMenuVisible,
    isProductMenuOpen,
    showMenu,
    hideMenu
}) => {
    return (
        <nav className="header-nav">
            <Tippy
                visible={isMenuVisible}
                onClickOutside={hideMenu}
                placement="bottom"
                interactive
                delay={[0, 300]}
                render={(attrs) => (
                    <div className="drop-down-menu" tabIndex={-1} {...attrs}>
                        <CategoriesMenu categories={categories} onLinkClick={hideMenu} />
                    </div>
                )}
            >
                <button
                    type="button"
                    className="drop-down-product"
                    onMouseEnter={showMenu}
                    onMouseLeave={hideMenu}
                    aria-haspopup="menu"
                    aria-expanded={isProductMenuOpen}
                >
                    <span className={`text ${isProductMenuOpen ? "is-tippy-on" : ""}`}>
                        SẢN PHẨM
                    </span>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`icon ${isProductMenuOpen ? "is-tippy-on" : ""}`}
                    />
                </button>
            </Tippy>

            <Link href="/sale-off" className="nav-link">SALE OFF</Link>
            <Link href="/feed" className="nav-link">TIN TỨC</Link>
        </nav>
    );
};
