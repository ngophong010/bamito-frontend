"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Tippy from "@tippyjs/react/headless";
import {
  faSpinner,
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleGetAllProductService } from "../../services/productService";
import { searchPopular } from "../../utils";
import "./Search.scss";
import { useDebounce } from "../../utils/commonUtils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleChangSearchText } from "../../redux-toolkit/searchSlice";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";
import { logOut } from "@/redux-toolkit/userSlice";
import { convertSlugUrl } from "../../utils/commonUtils";
// import { text } from "stream/consumers";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const SearchResultsDropdown = ({
  popularItems,
  searchResults,
  isLoading,
  searchText,
  onPopularClick,
  onMoreClick,
}) => { 
  const noResultsFound = !isLoading && searchText.trim() && searchResults.length === 0;

  const handleItemClick = () => {

  };

  return (
    <div className="searchResult">
      <div className="search-popular">
        <div className="search-popular-title">TÌM KIẾM NHIỀU NHẤT</div>
        <hr className="search-separator" />
        <div className="search-popular-list">
          {popularItems.map((item) => (
            <button
              className="search-popular-item"
              key={item.id}
              onClick={() => onPopularClick(item.value)}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>

      {searchResults.length > 0 && (
        <>
          {searchResults.map((item) => (
            <Link
              // ENHANCEMENT 4: Use a stable ID for the key
              key={item.productId}
              href={`/${convertSlugUrl(item.productTypeData?.productTypeName)}-${item.productTypeData?.productTypeId.toLowerCase()}/${convertSlugUrl(item.name)}-${item.productId.toLowerCase()}`}
              className="searchProduct"
              onClick={handleItemClick}
            >
              <Image src={item.image} alt={item.name} width={60} height={60} />
              <div>
                <h2>{`${item.name.slice(0, 38)}...`}</h2>
                <h2 className="searchProductPrice">
                  <p>{currencyFormatter.format(item.price)}đ</p>
                </h2>
              </div>
            </Link>
          ))}
          {searchResults.length >= 5 && (
            <button className="search-more" onClick={onMoreClick}>
              <hr className="search-separator" style={{ margin: "1.6rem 0" }} />
              Xem tất cả
            </button>
          )}
        </>
      )}

      {noResultsFound && (
        <h2 style={{ margin: "10px 0 20px 0" }}>
          Không có kết quả cho '{searchText}'
        </h2>
      )}
      </div>
  );
};

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  // const [isShowNoResult, setIsShowNoResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef();
  const searchTextDebounce = useDebounce(searchText, 500);

  let getAllProduct = useCallback(async (name) => {
    try {
      setIsLoading(true);
      const res = await handleGetAllProductService(5, 1, name);
      if (res && res.errCode === 0) {
        setSearchResult(res.data || []);
        // res?.data?.length > 0
        //   ? setIsShowNoResult(false)
        //   : setIsShowNoResult(true);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.errCode === -4) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      } else {
        toast.error(error?.response?.data?.message || "Lỗi khi tìm kiếm");
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (!searchTextDebounce.trim()) {
  //     setSearchResult([]);
  //     return;
  //   }
  //   getAllProduct(searchTextDebounce.trim());
  //   dispatch(handleChangSearchText(searchTextDebounce.trim()));
  // }, [dispatch, searchTextDebounce]);
  useEffect(() => {
    const trimedSearch = searchTextDebounce.trim();
    if (!trimedSearch) {
      setSearchResult([]);
      return;
    }
    getAllProduct(trimedSearch);
    dispatch(handleChangSearchText(trimedSearch));
  }, [dispatch, searchTextDebounce, getAllProduct]);

  const handleSearchClear = () => {
    setSearchText("");
    setSearchResult([]);
    inputRef.current.focus();
  };

  const navigateToSearchPage = (text) => {
    setIsShowSearch(false);
    dispatch(handleChangePage(1));
    if (text) {
      dispatch(handleChangSearchText(text));
    }
    router.push("/search");
  };

  const handleClickPopular = (popularValue) => {
    setIsShowSearch(false);
    dispatch(handleChangePage(1));

    dispatch(handleChangSearchText(popularValue));
    router.push("/search");
  };

  const handleClickSearch = () => {
    if (!searchTextDebounce.trim()) {
      setSearchResult([]);
      return;
    }
    if (searchResult.length === 0) return;

    setIsShowSearch(false);
    router.push("/search");
  };

  const handleClickMore = () => {
    setIsShowSearch(false);
    router.push("/search");
  };

  return (
    <Tippy
      interactive
      visible={isShowSearch}
      onClickOutside={() => 
        setIsShowSearch(false)
      }
      placement="bottom"
      delay={[0, 500]}
      offset={[0, 12.5]}
      render={(attrs) => (
        <div className="dropdownSearch" tabIndex="-1" {...attrs}>
          {/* <div className="searchResult">
            <div className="search-popular">
              <div className="search-popular-title">TÌM KIẾM NHIỀU NHẤT</div>
              <span
                style={{
                  display: "block",
                  width: "100%",
                  borderTop: "1px solid rgb(221, 217, 217)",
                  margin: "6px 0",
                }}
              ></span>
              <div className="search-popular-list">
                {searchPopular?.length > 0 &&
                  searchPopular.map((item) => {
                    return (
                      <div
                        className="search-popular-item"
                        key={item.id}
                        onClick={() => handleClickPopular(item.value)}
                      >
                        {item.value}
                      </div>
                    );
                  })}
              </div>
            </div>
            {searchResult?.length > 0 ? (
              <>
                {searchResult.map((item, index) => {
                  if (index > 5) return null;
                  return (
                    <Link
                      href={`/${convertSlugUrl(
                        item.productTypeData?.productTypeName
                      )}-${
                        item.productTypeData?.productTypeId.toLowerCase()
                      }/${convertSlugUrl(item.name)}-${item.productId.toLowerCase()}`}
                      key={index}
                      className="searchProduct"
                      onClick={() => {
                        setSearchText("");
                        setIsShowSearch(false);
                      }}
                    >
                      <Image
                        src={item.image}
                        alt="img"
                        width={60}
                        height={60}
                        sizes="100vw"
                        style={{ width: "6rem", height: "6rem" }}
                      ></Image>
                      <div>
                        <h2>{`${item.name.slice(0, 38)}...`}</h2>
                        <h2 className="searchProductPrice">
                          <p>
                            {currencyFormatter.format(item.price)}
                            <span
                              style={{
                                textDecoration: "underline",
                                marginLeft: 2,
                              }}
                            >
                              đ
                            </span>
                          </p>
                        </h2>
                      </div>
                    </Link>
                  );
                })}
                {searchResult.length >= 5 ? (
                  <div className="search-more" onClick={handleClickMore}>
                    <span
                      style={{
                        display: "block",
                        width: "100%",
                        borderTop: "1px solid rgb(221, 217, 217)",
                        margin: "1.6rem 0",
                      }}
                    ></span>
                    Xem tất cả
                  </div>
                ) : null}
              </>
            ) : !searchText.trim() ? null : isShowNoResult ? (
              <h2 style={{ margin: "10px 0 20px 0" }}>
                Không có kết quả cho '{searchText}'
              </h2>
            ) : null}
          </div> */}
          <SearchResultsDropdown
            popularItems={searchPopular}
            searchResults={searchResult}
            isLoading={isLoading}
            searchText={searchTextDebounce}
            onPopularClick={navigateToSearchPage}
            onMoreClick={() => navigateToSearchPage()}
          />
        </div>
      )}
    >
      <div className="search">
        <input
          ref={inputRef}
          className="searchInput"
          onClick={() => setIsShowSearch(true)}
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Tìm kiếm..."
        ></input>

        {isLoading && (
          <button className="searchLoading">
            <FontAwesomeIcon icon={faSpinner} />
          </button>
        )}

        {searchText.length > 0 && !isLoading && (
          <button className="searchClear" onClick={handleSearchClear}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}

        <span className="search-divider" style={{ border: "1px solid #ddd9d9", height: "65%" }}></span>
        <button className="searchBtn" onClick={() => navigateToSearchPage()}>
          <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} />
        </button>
      </div>
    </Tippy>
  );
};

export default Search;
