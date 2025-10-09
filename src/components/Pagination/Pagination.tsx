"use client";
import React from 'react';
import ReactPaginate from 'react-paginate';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import './Pagination.scss';

// 1. Define the props this component ACTUALLY needs.
// It only needs to know the current state and what to do when a page is clicked.
interface PaginatedItemsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
  isLoading?: boolean; // Optional prop to hide the component while loading
}

const PaginatedItems = ({ currentPage, totalPages, onPageChange, isLoading }: PaginatedItemsProps) => {
  
  // 2. The component knows nothing about Redux or data fetching.
  // It just calls the function passed to it via props.
  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1); // react-paginate is 0-indexed, so we add 1
  };

  // Don't render pagination if there's only one page or zero pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{ marginTop: "3rem" }}>
      <ReactPaginate
        nextLabel={
          <button><span>Next</span><ArrowForwardIcon /></button>
        }
        previousLabel={
          <button><span>Prev</span><ArrowBackIcon /></button>
        }
        onPageChange={handlePageClick}
        forcePage={currentPage - 1} // react-paginate is 0-indexed
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        containerClassName={isLoading ? "pagination-container hidden" : "pagination-container"}
        pageLinkClassName="number_a"
        previousClassName="button_previous"
        nextClassName="button_next"
        activeClassName="active"
        breakLabel="..."
        breakClassName="break"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default PaginatedItems;
