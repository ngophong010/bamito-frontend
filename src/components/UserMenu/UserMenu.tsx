"use client";
import React from "react";
import Link from "next/link";
import { MenuItem } from "@/config/menu"; // Import the type
import "./UserMenu.scss";

// 1. Define the props the component needs. It's now very simple.
interface UserMenuProps {
  attrs: Record<string, any>; // Props from Tippy.js
  menuItems: MenuItem[]; // A pre-filtered list of items to render
  onItemClick: (item: MenuItem) => void; // A single callback function
}

const UserMenu = ({ attrs, menuItems, onItemClick }: UserMenuProps) => {

  return (
    <div className="user-menu-container" tabIndex={-1} {...attrs}>
      {menuItems.map((item, index) => {
        const content = (
          <>
            <item.icon className="icon" />
            <p className="text">{item.text}</p>
          </>
        );

        // 2. Conditionally render a Link or a Button based on the item's properties
        if (item.to) {
          // It's a navigation link
          return (
            <Link href={item.to} key={item.text} className="userMenuItem" onClick={() => onItemClick(item)}>
              {content}
            </Link>
          );
        } else {
          // It's an action button (like Logout)
          return (
            <button key={item.text} className="userMenuItem" onClick={() => onItemClick(item)}>
              {content}
            </button>
          );
        }
      })}
    </div>
  );
};

export default UserMenu;
