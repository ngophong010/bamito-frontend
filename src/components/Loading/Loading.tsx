"use client";

import { useEffect, type CSSProperties, type PropsWithChildren } from "react";
import HashLoader from "react-spinners/HashLoader";
import "./Loading.scss";

interface LoadingProps {
  loading: boolean;
  style?: CSSProperties;
  scrollToTop?: boolean;
}

// Use PropsWithChildren to automatically include the 'children' prop
const Loading = ({ children, loading, style, scrollToTop = false }: PropsWithChildren<LoadingProps>) => {
  
  useEffect(() => {
    // This effect runs when the loading state changes
    if (loading && scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [loading, scrollToTop]);

  return (
    // The main container can be a simple div or React.Fragment if it adds no styles
    // Here we use a div to apply the provided style prop
    <div
      className={`loading-container ${loading ? 'is-loading' : ''}`}
      style={style}
    >
      {loading && (
        <div className="loading-overlay">
          <HashLoader
            color="#FF8080" // A more descriptive color from a theme object is even better
            size={100} // size can be a number
            speedMultiplier={1.5}
            loading={true}
          />
        </div>
      )}
      {/* The children are always rendered. The overlay appears on top when loading. */}
      {children}
    </div>
  );
};

export default Loading;
