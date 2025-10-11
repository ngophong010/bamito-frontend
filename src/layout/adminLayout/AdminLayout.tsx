"use client";
import React from "react";
import AdminHeader from "../adminHeader/AdminHeader";
import AdminSidebar from "../adminSidebar/AdminSidebar";
import "./adminLayout.scss";

// 1. Define the props for type safety
interface AdminLayoutProps {
  children: React.ReactNode;
}

// 2. The component is now a pure presentation layout.
const AdminLayout = ({ children }: AdminLayoutProps) => {
  // 3. REMOVED: The useSelector for a global isLoading flag is gone.
  return (
    // 4. REMOVED: The global <Loading> component wrapper is gone.
    <div className="admin-layout-container">
      <AdminHeader />
      <div className="content">
        <AdminSidebar />
        <main className="children">{children}</main> {/* Use a <main> tag for semantics */}
      </div>
    </div>
  );
};

export default AdminLayout;
