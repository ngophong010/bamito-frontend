"use client";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Breadcrumb.scss';

export interface BreadcrumbItem {
  label: string;
  href?: string; // <-- Make href optional
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  // You were already prepending "Home", but the client layout was also doing it.
  // It's better to do this in one place. Let's keep it here.
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    ...items,
  ];

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      {breadcrumbItems.map((item, index) => (
        // Use a more robust key, as href can be undefined.
        <React.Fragment key={`${item.label}-${index}`}> 
          {index > 0 && (
            <FontAwesomeIcon className="breadcrumb-separator" icon={faAngleRight} />
          )}
          
          {/* 
            FIX: The rendering logic now checks if 'href' exists.
            If it exists, render a Link. If not, render a span.
            This is more robust than checking the index.
          */}
          {item.href ? (
            <Link className="breadcrumb-text" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-text active">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
