"use client";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { InlineShareButtons } from "sharethis-reactjs";


import { handleAddProductToCart } from "@/services/cartService";
import { fetchAllProductCart } from "@/redux-toolkit/cartSlice";
import { logOut } from "@/redux-toolkit/userSlice";

import { handleGetProductService } from "@/services/productService";
import { loadingProduct } from "@/redux-toolkit/productSlice";

import DisplayFeedbacks from "@/components/DisplayFeedbacks/DisplayFeedbacks";
import "./page.scss";

import { useAppDispatch, useAppSelector } from '@/redux-toolkit/hooks';

interface LineProps {
    color: string;
}

interface ApiResponse {
    errCode: number;
    message: string;
    data?: any;
}

const Line = ({ color }: LineProps) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 3,
            margin: "2rem 0",
        }}
    />
);

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

interface ProductData {
    id: number;
    productId: string;
    name: string;
    image: string;
    price: number;
    discount: number;
    rating: number;
    descriptionHTML: string;
    SizeData: {
        sizeId: number;
        sizeName: string;
        quantity: number;
        selected?: boolean;
    }[];
}

function ProductDetailClient({ product }: { product: ProductData }) { // It receives the product data as a prop
    const [quantity, setQuantity] = useState(1);
    const [sizeData, setSizeData] = useState(product.SizeData || []);
    const [sizeSelected, setSizeSelected] = useState<number | null>(null);
    const [stockQuantity, setStockQuantity] = useState<number | null>(null);
    const [isDescriptionTab, setIsDescriptionTab] = useState(true);

    const isLogin = useAppSelector((state) => state.user.login);
    const userId = useAppSelector((state) => state.user.userInfo?.id);
    const dispatch = useAppDispatch();

    const handleClickSize = (sizeId: number) => {
        const newData = sizeData.map((size) => ({
            ...size,
            selected: size.sizeId === sizeId,
        }));
        const currentSize = newData.find((size) => size.sizeId === sizeId);

        setSizeData(newData);
        setStockQuantity(currentSize?.quantity ?? null);
        setSizeSelected(sizeId);
        setQuantity(1);
    };

    const handleDecrement = () => {
        if (!sizeSelected) {
            toast.error("Vui lòng chọn kích cỡ sản phẩm");
            return;
        }
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrement = () => {
        if (!sizeSelected) {
            toast.error("Vui lòng chọn kích cỡ sản phẩm");
            return;
        }
        if (stockQuantity !== null && quantity < stockQuantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleClickAddCart = async () => {
        if (!isLogin) {
            toast.error("Vui lòng đăng nhập để tiếp tục mua hàng");
            return;
        }
        if (!sizeSelected) {
            toast.error("Vui lòng chọn kích cỡ sản phẩm");
            return;
        }
        if (!userId) {
            toast.error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
            // You could also dispatch a logout action here if this state is unexpected
            // dispatch(logOut());
            return;
        }

        try {
            // Destructure `data` from the axios response
            const { data: res }: { data: ApiResponse } = await handleAddProductToCart({
                userId: userId,
                productId: product.id,
                sizeId: sizeSelected,
                quantity: quantity,
                // The backend should ALWAYS recalculate the price for security.
                // We send it here just for reference.
                totalPrice: quantity * (product.price - (product.price * product.discount) / 100),
            });
            // Note: `productId` should be the integer `id` for our refactored backend
            if (res && res.errCode === 0) {
                dispatch(fetchAllProductCart({ userId: userId }));
                toast.success("Thêm sản phẩm vào giỏ hàng thành công");
            }
        } catch (error: any) {
            if (error.response.data.errCode === 2) {
                toast.error("Sản phẩm đã có trong giỏ hàng");
            } else {
                console.log(error);
                if (error?.response?.data?.errCode === -4) {
                    toast.error("Phiên bản đăng nhập hết hạn");
                    dispatch(logOut());
                } else {
                    toast.error(error?.response?.data?.message);
                }
            }
        }
    }

    return (
        <div className="product_detail_container">
            <div className="img_inf_product">
                {product.image && (
                    <Image
                        src={product.image}
                        priority
                        height={0}
                        width={0}
                        className="img_product"
                        sizes="100vw"
                        alt="product"
                    />
                )}

                <div className="info_product">
                    <h1 className="product-name">{product.name}</h1>

                    <div className="star_sold">
                        <Rating
                            style={{ fontSize: "3.875rem" }}
                            name="read-only"
                            value={product.rating ? product.rating : 0}
                            readOnly
                            precision={0.5}
                            size="large"
                        />
                        <span style={{ fontSize: "3rem", fontWeight: 600, marginLeft: 6 }}>
                            {product.rating}/5
                        </span>
                    </div>

                    <div className="price_product">
                        <p
                            style={{
                                color:
                                    product.discount !== 0
                                        ? "rgba(0,0,0,.54)"
                                        : "var(--primary-color)",
                                textDecoration: product.discount !== 0 ? "line-through" : "",
                                marginRight: 16,
                            }}
                        >
                            {currencyFormatter.format(product.price)}
                            <span
                                style={{
                                    textDecoration: "underline",
                                    marginLeft: 2,
                                }}
                            >
                                đ
                            </span>
                        </p>
                        {product.discount !== 0 ? (
                            <p>
                                {currencyFormatter.format(
                                    product.price - (product.price * product.discount) / 100
                                )}
                                <span
                                    style={{
                                        textDecoration: "underline",
                                        marginLeft: 2,
                                    }}
                                >
                                    đ
                                </span>
                            </p>
                        ) : null}
                    </div>

                    <Line color="var(--gray-color)" />

                    <div className="size_product">
                        <p>Size</p>
                        <div>
                            {sizeData?.length > 0 &&
                                sizeData.map((size) => (
                                    <button
                                        key={size.sizeId}
                                        onClick={() => handleClickSize(size.sizeId)}
                                        className={size.selected ? "selected" : undefined}
                                    >
                                        {size.sizeName}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <Line color="var(--gray-color)" />

                    <div className="product_number">
                        <div className="number">
                            <h5>Số lượng</h5>
                        </div>

                        <div className="quantity-stock">
                            <div className="quantity-btn-wrapper">
                                <button className="subtract-btn" onClick={handleDecrement}>
                                    <RemoveIcon className="icon" />
                                </button>
                                <p>{quantity}</p>
                                <button className="add-btn" onClick={handleIncrement}>
                                    <AddTwoToneIcon className="icon" />
                                </button>
                            </div>

                            {stockQuantity !== null && stockQuantity > 0 ? (
                                <p className="stock_product">{stockQuantity} sản phẩm có sẵn</p>
                            ) : stockQuantity === 0 ? (
                                <p className="stock_product">Sản phẩm đã hết hàng</p>
                            ) : null}
                        </div>
                    </div>

                    <Line color="var(--gray-color)" />

                    <button className="cart-btn" onClick={handleClickAddCart}>
                        {/* <i className="fas fa-shopping-cart"></i> */}
                        <h3>Thêm vào giỏ hàng</h3>
                    </button>
                </div>
            </div>

            <div className="share_this">
                <InlineShareButtons
                    config={{
                        alignment: "left", // alignment of buttons (left, center, right)
                        color: "social", // set the color of buttons (social, white)
                        enabled: true, // show/hide buttons (true, false)
                        font_size: 16, // font size for the buttons
                        labels: "cta", // button labels (cta, counts, null)
                        language: "en", // which language to use (see LANGUAGES)
                        networks: [
                            // which networks to include (see SHARING NETWORKS)
                            "messenger",
                            "facebook",
                            "twitter",
                        ],
                        padding: 12, // padding within buttons (INTEGER)
                        radius: 4, // the corner radius on each button (INTEGER)
                        // show_total: true,
                        size: 40, // the size of each button (INTEGER)

                        show_total: true
                        // OPTIONAL PARAMETERS

                        // min_count: 10,                    // (threshold for total share count to be displayed)
                        // url: 'https://e-commerce-xi-sepia.vercel.app', // (defaults to current url)
                        // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
                        // description: 'custom text',       // (defaults to og:description or twitter:description)
                        // title: 'custom title',            // (defaults to og:title or twitter:title)
                        // message: 'custom email text',     // (only for email sharing)
                        // subject: 'custom email subject',  // (only for email sharing)
                        // username: 'custom twitter handle' // (only for twitter sharing)
                    }}
                />
            </div>

            <div className="description_review_wrapper">
                <div className="des-review-btn-wrapper">
                    <div className="des-review-btn">
                        <button
                            // className={!checkComponent ? "no-focus" : null}
                            onClick={() => setIsDescriptionTab(true)}
                        >
                            <h4>Mô tả sản phẩm</h4>
                        </button>
                        {/* <Line color={!checkComponent ? "rgba(0, 0, 0, 0.1)" : "black"} /> */}
                    </div>
                    <div className="des-review-btn">
                        <button
                            // className={checkComponent ? "no-focus" : null}
                            onClick={() => setIsDescriptionTab(false)}
                        >
                            <h4>Phản hồi và Đánh giá</h4>
                        </button>
                        {/* <Line color={checkComponent ? "rgba(0, 0, 0, 0.1)" : "black"} /> */}
                    </div>
                </div>
                {isDescriptionTab ? (
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHTML }} />
                ) : (
                    <DisplayFeedbacks productId={product.id} />
                )}
            </div>
        </div>
    );
}

export default ProductDetailClient;
