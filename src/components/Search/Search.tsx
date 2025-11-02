"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useDebounce } from "@/hooks/useDebounce"; // Assuming a custom debounce hook
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchSearchResults, clearSearchResults } from "@/lib/redux/features/search/searchSlice";
import { createSlug } from "@/lib/utils/slug"; // Assuming a slug utility
import { ProductListItem } from "@/types";
import "./Search.scss";
import { getPopularSearches } from "@/services/searchService";
import { set } from "react-hook-form";

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

// ===============================================================
// --- Sub-component for the Dropdown Results ---
// ===============================================================
interface SearchResultsDropdownProps {
  searchResults: ProductListItem[];
  isLoading: boolean;
  searchText: string;
  onClose: () => void;
}

const SearchResultsDropdown = ({ searchResults, isLoading, searchText, onClose }: SearchResultsDropdownProps) => {
  const router = useRouter();

  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isFetchingPopular, setIsFetchingPopular] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setIsFetchingPopular(true);
      const terms = await getPopularSearches();
      setPopularSearches(terms);
      setIsFetchingPopular(false);
    };
    
    fetchPopular();
}, []);

  const handleNavigateToSearchPage = () => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchText)}`);
  };
  
  const handleItemClick = () => {
    onClose();
  };

  return (
    <div className="searchResult">
      <div className="search-popular">
        <div className="search-popular-title">TÌM KIẾM PHỔ BIẾN</div>
        <hr className="search-separator" />
        <div className="search-popular-list">
          {isFetchingPopular ? (
            <div className="popular-search-loading">Loading...</div>
          ) : (
            popularSearches.map((item) => (
              <Link href={`/search?q=${encodeURIComponent(item)}`} key={item} className="search-popular-item" onClick={onClose}>
                {item}
              </Link>
            ))
          )}
        </div>
      </div>

      {isLoading && <div className="search-loading-text">Đang tìm kiếm...</div>}

      {!isLoading && searchResults.length > 0 && (
        <>
          {searchResults.map((item) => (
            <Link
              key={item.id}
              href={`/${createSlug(item.category.name)}/${createSlug(item.name)}-${item.productId}`}
              className="searchProduct"
              onClick={handleItemClick}
            >
              <Image src={item.image || '/placeholder.png'} alt={item.name} width={60} height={60} />
              <div>
                <h2 className="searchProductName">{item.name}</h2>
                <h2 className="searchProductPrice">{currencyFormatter.format(item.price)}</h2>
              </div>
            </Link>
          ))}
          {searchResults.length >= 5 && (
            <button className="search-more" onClick={handleNavigateToSearchPage}>
              <hr className="search-separator" style={{ margin: "1.6rem 0" }} />
              Xem tất cả kết quả
            </button>
          )}
        </>
      )}

      {!isLoading && searchText && searchResults.length === 0 && (
        <h2 className="search-no-results">
          Không tìm thấy kết quả cho '{searchText}'
        </h2>
      )}
    </div>
  );
};

// ===============================================================
// --- Main Search Component ---
// ===============================================================
const Search = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the actual search results and status from our clean searchSlice
  const { results, status, lastSearchTerm } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    // Only dispatch the search thunk if the debounced term is not empty
    if (debouncedSearchTerm.trim()) {
      dispatch(fetchSearchResults({ name: debouncedSearchTerm, limit: 5 }));
    } else {
      // If the input is cleared, clear the results in the Redux store
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleClear = () => {
    setInputValue("");
    dispatch(clearSearchResults());
    inputRef.current?.focus();
  };

  const handleHideResults = () => {
    setIsFocused(false);
  };

  const handleSearchSubmit = () => {
    handleHideResults();
    if(inputValue.trim()){
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const showResults = isFocused && inputValue.trim() !== '';

  return (
    <div> {/* Extra div to prevent Tippy from attaching to a component that gets re-rendered */}
      <Tippy
        interactive
        visible={showResults}
        onClickOutside={handleHideResults}
        placement="bottom"
        offset={[0, 8]}
        render={(attrs) => (
          <div className="dropdownSearch" tabIndex={-1} {...attrs}>
            <SearchResultsDropdown
              searchResults={results}
              isLoading={status === 'loading'}
              searchText={lastSearchTerm || ''}
              onClose={handleHideResults}
            />
          </div>
        )}
      >
        <div className="search">
          <input
            ref={inputRef}
            className="searchInput"
            onFocus={() => setIsFocused(true)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit() }}
          />

          {status === 'loading' && (
            <FontAwesomeIcon className="searchLoading" icon={faSpinner} spin />
          )}

          {inputValue && status !== 'loading' && (
            <button className="searchClear" onClick={handleClear}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          <span className="search-divider"></span>
          <button className="searchBtn" onMouseDown={handleSearchSubmit}>
            <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} />
          </button>
        </div>
      </Tippy>
    </div>
  );
};

export default Search;
