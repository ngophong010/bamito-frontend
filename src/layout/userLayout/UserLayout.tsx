"use client"; // This must be a client component because it uses usePathname

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import FaceBookChat from "@/components/FacebookChat/FacebookChat";
import { Category } from "@/types";
import "./UserLayout.scss";

// Define the props it receives from the parent server layout
interface UserLayoutProps {
    children: React.ReactNode;
    categories: Category[];
}

const UserLayout = ({ children, categories }: UserLayoutProps) => {
  const pathname = usePathname();
  // The layout itself determines if the breadcrumb should be shown.
  const showBreadcrumb = pathname !== "/";

  // The global <Loading> component is removed. Loading state should be handled
  // inside the specific components/pages that are actually loading data.
  return (
      <div className="layout-container">
        {/* Pass the server-fetched categories down to the Header */}
        <Header categories={categories} />
        
        {showBreadcrumb && <Breadcrumb />}
        
        <main className="layout-content">{children}</main>
        
        <Footer />
        <FaceBookChat />
      </div>
  );
};

export default UserLayout;
