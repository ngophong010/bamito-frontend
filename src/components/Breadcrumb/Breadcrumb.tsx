"use client"; // It has a Link, so it can be a client component.
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Breadcrumb.scss';

// 1. Define the props. The component just needs a list of links.
export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  // Add the "Home" link to the beginning of every breadcrumb trail
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    ...items,
  ];

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <FontAwesomeIcon className="breadcrumb-separator" icon={faAngleRight} />
          )}
          
          {/* If it's the last item, render it as text, not a link */}
          {index === breadcrumbItems.length - 1 ? (
            <span className="breadcrumb-text active">{item.label}</span>
          ) : (
            <Link className="breadcrumb-text" href={item.href}>
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
