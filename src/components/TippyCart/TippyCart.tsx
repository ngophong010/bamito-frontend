"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/redux/store"; // Import your store types
import { fetchCart } from "@/lib/redux/features/cart/cartSlice";
import { createSlug } from "@/lib/utils/slug";
import "./TippyCart.scss";

// Reusable currency formatter
const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const TippyCart = () => {
  // Use typed hooks for better autocompletion and safety
  const dispatch: AppDispatch = useDispatch();

  // Select the necessary data directly from the Redux store
  const { products, totalCount, status } = useSelector(
    (state: RootState) => state.cart
  );
  const userId = useSelector((state: RootState) => state.user.profile?.id);

  // Trigger the initial fetch for cart data if it hasn't been fetched yet
  useEffect(() => {
    // Only fetch if the user is logged in and the cart is in an 'idle' state
    if (userId && status === 'idle') {
      dispatch(fetchCart());
    }
  }, [userId, status, dispatch]);

  // The component is now much simpler. It just renders the data from Redux.
  // No more local state or complex data fetching logic.
  
  if (status === 'loading') {
    return <div className="tippy-cart-container">Loading...</div>;
  }

  return (
    <div className="tippy-cart-container">
      <h2 className="tippy-cart-title">Sản Phẩm Mới Thêm</h2>
      {products && products.length > 0 ? (
        products.slice(0, 5).map((product) => (
          // The categoryName is now available directly on the product object from Redux
          <Link
            className="product-item"
            key={`${product.productId}-${product.sizeId}`} // Use a more stable key
            href={`/${createSlug(product.categoryName)}-${product.productId.toLowerCase()}/${createSlug(
              product.name
            )}-${product.productId.toLowerCase()}`}
          >
            <div className="product-wrap-img-name">
              <Image
                src={product.image || '/placeholder-image.png'} // Add a fallback
                alt={product.name}
                width={54}
                height={54}
                className="product-img"
              />
              <div className="product-name">
                {product.name.length > 37 ? `${product.name.slice(0, 37)}...` : product.name}
              </div>
            </div>
            <div className="product-price">
              {currencyFormatter.format(product.price)}
            </div>
          </Link>
        ))
      ) : (
        <div className="no-product">
          <h2 style={{ textAlign: "center" }}>Không có sản phẩm nào</h2>
          <Image
            src="/images/noProduct.png"
            width={0}
            height={400}
            sizes="100vw"
            alt="Giỏ hàng trống"
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      )}
      {totalCount > 0 && (
        <div className="tippy-cart-footer">
          {totalCount > 5 && (
            <span className="count-product-in-cart">
              {totalCount - 5} Thêm Hàng Vào Giỏ
            </span>
          )}
          <Link
            href="/user/cart"
            className="btn-show-cart"
            style={{ marginLeft: "auto" }}
          >
            Xem giỏ hàng
          </Link>
        </div>
      )}
    </div>
  );
};

export default TippyCart;
