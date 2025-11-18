"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Popover } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logOut } from "@/lib/redux/features/user/userSlice";
import { MenuItem } from "@/config/menu";
import { User, LogOut } from "lucide-react";
import UserMenu from "@/components/UserMenu/UserMenu";
import "./adminHeader.scss";

const AdminHeader = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
      <div
        className="admin-info"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="admin-name">{profile.userName}</h2>
        <div className="admin-avatar">
          <Image
              src={profile.avatar || "/images/default-avatar.png"}
              alt={profile.userName}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
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
          menuItems={menuItems}
          onItemClick={handleMenuItemClick}
        />
      </Popover>
    </header>
  );
};

export default AdminHeader;
