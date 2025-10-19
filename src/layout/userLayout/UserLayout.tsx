"use client";

import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import FaceBookChat from "@/components/FacebookChat/FacebookChat";
import { Category } from "@/types";
import "./UserLayout.scss";

// Define the props it receives from the parent server layout
interface UserLayoutProps {
    children: React.ReactNode;
    categories: Category[];
}

const UserLayout = ({ children, categories }: UserLayoutProps) => {
  return (
      <div className="layout-container">
        {/* Pass the server-fetched categories down to the Header */}
        <Header categories={categories} />
                
        <main className="layout-content">{children}</main>
        
        <Footer />
        <FaceBookChat />
      </div>
  );
};

export default UserLayout;
