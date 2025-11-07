"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";

// 1. Import types from the central /types directory
import { ProductDetails, Feedback } from "@/types";
// 2. Import the correct, typed Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addItemToCart } from "@/lib/redux/features/cart/cartSlice";
import DisplayFeedbacks from "@/components/DisplayFeedbacks/DisplayFeedbacks";
import "./page.module.scss";

// Reusable currency formatter
const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

interface ProductDetailClientProps {
  readonly product: ProductDetails;
  readonly initialFeedbacks: Array<Feedback>;
}

const ProductDetailClient = ({ product, initialFeedbacks }: ProductDetailClientProps) => {
  const dispatch = useAppDispatch();

  // --- LOCAL UI STATE ---
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  // --- REDUX STATE ---
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const cartAddStatus = useAppSelector((state) => state.cart.operations.add.status);

  // --- DERIVED STATE (from props and local state) ---
  // No need for a separate useState for stock. Derive it when needed.
  const selectedInventoryItem = useMemo(() => {
    return product.inventory.find(inv => inv.size.id === selectedSizeId);
  }, [selectedSizeId, product.inventory]);

  const stockQuantity = selectedInventoryItem?.quantity ?? null;

  // --- EVENT HANDLERS ---

  const handleSelectSize = (sizeId: number) => {
    setSelectedSizeId(sizeId);
    setQuantity(1); // Reset quantity when size changes
  };

  const handleQuantityChange = (amount: number) => {
    if (!selectedSizeId) {
      toast.error("Vui lòng chọn một kích thước.");
      return;
    }
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && (stockQuantity === null || newQuantity <= stockQuantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
      // You could also redirect to the login page here
      // router.push('/login');
      return;
    }
    if (!selectedSizeId) {
      toast.error("Vui lòng chọn một kích thước.");
      return;
    }
    
    // 3. Dispatch ONE clean, self-contained async thunk.
    // NO userId is passed. The service and backend handle it.
    dispatch(addItemToCart({
      productId: product.id,
      size: selectedSizeId,
      quantity,
    })).unwrap() // .unwrap() allows us to use .then() and .catch() on the thunk
      .then(() => {
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
      })
      .catch((error) => {
        // The thunk's rejectWithValue will be the error payload
        toast.error(error || "Thêm sản phẩm thất bại.");
      });
  };

  return (
    <div className="product_detail_container">
      <div className="img_inf_product">
        <div className="img_product">
          <Image
            src={product.image || '/placeholder.png'}
            priority
            fill // Use fill for responsive images in a container
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={product.name}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="info_product">
          <h1 className="product-name">{product.name}</h1>

          <div className="star_sold">
            <Rating
              name="read-only"
              value={product.averageRating || 0}
              readOnly
              precision={0.5}
            />
            <span>({product.feedbackCount} đánh giá)</span>
          </div>

          {/* ... Price component ... */}

          <div className="size_product">
            <p>Size</p>
            <div>
              {product.inventory.map((inv) => (
                <button
                  key={inv.size.id}
                  onClick={() => handleSelectSize(inv.size.id)}
                  className={selectedSizeId === inv.size.id ? "selected" : ""}
                  disabled={inv.quantity === 0}
                >
                  {inv.size.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="product_number">
            <h5>Số lượng</h5>
            <div className="quantity-stock">
              <div className="quantity-btn-wrapper">
                <button className="subtract-btn" onClick={() => handleQuantityChange(-1)}>
                  <RemoveIcon />
                </button>
                <p>{quantity}</p>
                <button className="add-btn" onClick={() => handleQuantityChange(1)}>
                  <AddTwoToneIcon />
                </button>
              </div>

              {stockQuantity !== null && stockQuantity > 0 && (
                <p className="stock_product">{stockQuantity} sản phẩm có sẵn</p>
              )}
              {stockQuantity === 0 && (
                <p className="stock_product out-of-stock">Sản phẩm đã hết hàng</p>
              )}
            </div>
          </div>

          <button 
            className="cart-btn" 
            onClick={handleAddToCart} 
            disabled={cartAddStatus === 'loading' || stockQuantity === 0}
          >
            {cartAddStatus === 'loading' ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
      
      {/* ... Description and Feedback tabs ... */}
      <div className="description_review_wrapper">
        {/* ... Tab logic ... */}
        <div dangerouslySetInnerHTML={{ __html: product.descriptionHTML || '' }} />
        <DisplayFeedbacks productId={product.id} initialFeedbacks={initialFeedbacks.map(f => ({
          ...f,
          user: { id: f.id, userName: f.user.userName, avatar: f.user.avatar },
          product: { id: product.id, name: product.name }
        }))} />
      </div>
    </div>
  );
}

export default ProductDetailClient;
