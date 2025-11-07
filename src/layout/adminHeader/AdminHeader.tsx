"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";

// 1. Import your typed hooks and actions
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logOut } from "@/lib/redux/features/user/userSlice";
import { MenuItem } from "@/config/menu";
import { User, LogOut } from "lucide-react";

import UserMenu from "@/components/UserMenu/UserMenu";
import "./adminHeader.scss";

const AdminHeader = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 2. Select from the new, clean Redux state shape
  // The useAppSelector hook is typed, so `profile` is known to be `UserProfile | null`.
  const profile = useAppSelector((state) => state.user.profile);

  // 3. Encapsulate the logout logic in a useCallback for performance
  const handleLogOut = useCallback(() => {
    // Dispatch the regular action
    dispatch(logOut());
    router.push('/login'); // Redirect after logout
  }, [dispatch, router]);

  // 4. Define menu items for admin
  const menuItems: MenuItem[] = [
    {
      text: "Hồ sơ",
      icon: User,
      to: "/user/profile"
    },
    {
      text: "Đăng xuất",
      icon: LogOut,
      action: "LOGOUT"
    }
  ];

  // 5. Handle menu item clicks
  const handleMenuItemClick = useCallback((item: MenuItem) => {
    if (item.action === "LOGOUT") {
      handleLogOut();
    }
  }, [handleLogOut]);

  // Handle the case where the profile might not be loaded yet
  if (!profile) {
    return (
        <header className="admin-header-container">
            <Link href="/admin/dashboard">
                <Image src="/images/logo.png" width={35} height={60} alt="Bamitop Logo" className="logo" />
            </Link>
            <div className="admin-info">
                <div className="loading-skeleton" /> {/* Placeholder for name */}
                <div className="loading-skeleton avatar" /> {/* Placeholder for avatar */}
            </div>
        </header>
    );
  }

  return (
    <header className="admin-header-container">
      <Link href="/admin/dashboard">
        <Image
          src="/images/logo.png"
          width={35}
          height={60}
          alt="Bamitop Logo"
          className="logo"
        />
      </Link>
      <Tippy
        interactive
        placement="bottom-end"
        delay={[0, 300]}
        render={(attrs) => (
          <UserMenu
            attrs={attrs}
            menuItems={menuItems}
            onItemClick={handleMenuItemClick}
          />
        )}
      >
        <div className="admin-info">
          <h2 className="admin-name">{profile.userName}</h2>
          <div className="admin-avatar">
            <Image
                src={profile.avatar || "/images/default-avatar.png"}
                alt={profile.userName}
                fill // Use 'fill' for responsive, parent-contained images
                style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </Tippy>
    </header>
  );
};

export default AdminHeader;
