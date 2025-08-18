"use client";
import HashLoader from "react-spinners/HashLoader";
import { useEffect } from "react";
import "./Loading.scss";

const Loading = ({ children, loading, style, scrollToTop = false }) => {
  useEffect(() => {
    if (loading && scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [loading, scrollToTop]);
  return (
    <div
      className={`loading-container ${loading ? 'is-loading' : ''}`}
      style={style}
    >
      {loading && (
        <div
          className="loading-overlay"
        >
          <HashLoader
            color="#FF8080"
            size="100px"
            speedMultiplier={1.5}
            loading={true}
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default Loading;
