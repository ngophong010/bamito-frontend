"use client";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveIcon from "@mui/icons-material/Remove";
import "./page.scss";

import { loadingProduct } from "@/redux-toolkit/productSlice";
import { handleAddProductToCart } from "@/services/cartService";
import { handleGetProductService } from "@/services/productService";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from 'next';
import DisplayFeedbacks from "@/components/DisplayFeedbacks/DisplayFeedbacks";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllProductCart } from "@/redux-toolkit/cartSlice";
import Image from "next/image";
import { logOut } from "@/redux-toolkit/userSlice";
import { InlineShareButtons } from "sharethis-reactjs";

// --- TYPES for our data ---
interface ProductPageParams {
  params: {
    productId: string;
  };
}

// ===============================================================
// 1. GENERATE METADATA (Runs on the Server)
// ===============================================================
export async function generateMetadata({ params }: ProductPageParams): Promise<Metadata> {
  const temp = params.productId.split("-");
  const id = temp[temp.length - 1];

  try {
    const res = await handleGetProductService(id);
    const product = res?.data;

    if (!product) {
      return { title: "Product Not Found" };
    }

    const description = product.descriptionContent?.slice(0, 160) || product.name;
    const title = `${product.name} | BAMITO Shop`;

    // The JSON-LD structured data is now correctly placed here.
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.image,
      description: description,
      sku: product.productId, // Use your business key for SKU
      brand: {
        "@type": "Brand",
        name: product.brandData.brandName,
      },
      // You can add offers, aggregateRating, etc. for even richer results
    };

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: product.image }],
        type: 'website',
      },
      // This is the correct way to add JSON-LD
      other: {
        'application/ld+json': JSON.stringify(jsonLd),
      }
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return { title: "Error", description: "Could not load product information." };
  }
}

// ===============================================================
// 2. THE PAGE COMPONENT (Also Runs on the Server)
// ===============================================================
export default async function ProductDetailPage({ params }: ProductPageParams) {
  // --- This is now the ONLY place where we fetch the data ---
  const temp = params.productId.split("-");
  const productId = temp[temp.length - 1];
  const res = await handleGetProductService(productId);
  const productData = res?.data;

  if (!productData) {
    // You can return a proper "Not Found" page here
    return <div>Product not found!</div>;
  }

  // 3. We pass the server-fetched data as a prop to the Client Component.
  return <ProductDetailClient product={productData} />;
}
