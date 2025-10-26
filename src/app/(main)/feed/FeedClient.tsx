"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatISODate } from "@/lib/utils/formatters"; // Assuming you create this
import PaginatedItems from "@/components/Pagination/Pagination";
import { FeedItem } from "@/types"; // Assuming you create this type
import { LIMIT } from "@/lib/utils/constants"; // e.g., export const LIMIT = 10;
import "./feed.scss";

interface FeedClientProps {
  initialFeedItems: FeedItem[];
}

const FeedClient = ({ initialFeedItems }: FeedClientProps) => {
  // The client now manages its own pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<FeedItem[]>([]);
  
  const totalPages = Math.ceil(initialFeedItems.length / LIMIT);

  // This effect runs whenever the page or the initial data changes
  useEffect(() => {
    // Scroll to top when the page changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Calculate the slice of items for the current page
    const newPaginatedItems = initialFeedItems.slice(
      (currentPage - 1) * LIMIT,
      currentPage * LIMIT
    );
    setPaginatedItems(newPaginatedItems);

  }, [currentPage, initialFeedItems]);

  // The handler function to be passed to our "dumb" pagination component
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="feed-container">
      <h1>Tin tức mới nhất</h1>
      {paginatedItems.length > 0 ? (
        paginatedItems.map((item) => (
          <Link className="feed-item" href={item.link} key={item.link} target="_blank" rel="noopener noreferrer">
            <div className="feed-info">
              <h2 className="time">{formatISODate(item.pubDate)}</h2>
              <h2 className="title">{item.title}</h2>
              <p className="text">{item.contentSnippet}</p>
            </div>
            {item.enclosure?.url && (
                <div className="feed-img">
                    <img alt={item.title} src={item.enclosure.url} />
                </div>
            )}
          </Link>
        ))
      ) : (
        <p>Không thể tải tin tức vào lúc này. Vui lòng thử lại sau.</p>
      )}

      <PaginatedItems
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FeedClient;
