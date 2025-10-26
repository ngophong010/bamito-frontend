"use client"; // This is a client component because it has interactive links
import React from 'react';
import Link from 'next/link';
import { Category } from '@/types'; // Import the central Category type
import { createSlug } from '@/lib/utils/slug';
import './CategoriesMenu.scss';

// 1. Define the props interface for strong typing
interface CategoriesMenuProps {
  categories: Category[];
  onLinkClick?: () => void; // Optional callback to close the Tippy dropdown
}

const CategoriesMenu = ({ categories = [], onLinkClick }: CategoriesMenuProps) => {
  return (
    <nav className="categories-menu-container">
      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            {/* 
              2. The <Link> component handles the navigation.
                 The href is constructed using our RESTful routing pattern.
                 The onClick handler is now just for closing the dropdown.
            */}
            <Link
              href={`/${createSlug(category.name)}-${category.id}`} // Use numeric ID for robustness
              className="category-link"
              onClick={onLinkClick} // Call the function to close the menu
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// 3. Use a consistent PascalCase name for the default export
export default CategoriesMenu;
