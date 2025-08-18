"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchAllProductCart } from "../../redux-toolkit/cartSlice";
import "./TippyCart.scss";
import { createSlug } from "@/utils/formatters";
import { handleGetProductTypeService } from "@/services/productTypeService";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const getProductTypeName = async (id) => {
  const res = await handleGetProductTypeService(id);
  if (res && res?.errCode === 0) {
    return res?.data?.productTypeName;
  }
  console.log(res);
};

const TippyCart = () => {
  const userId = useSelector((state) => state.user.userInfo?.id);
  const products = useSelector((state) => state?.cart?.allProduct);
  const productCountInCart = useSelector((state) => state.cart?.totalProduct);
  const [updatedProducts, setUpdatedProducts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchAllProductCart({ userId: userId }));
      const productsWithNames = await Promise.all(
        products.map(async (product) => {
          const productTypeName = await getProductTypeName(
            product.productTypeId
          );
          return { ...product, productTypeName: productTypeName };
        })
      );
      setUpdatedProducts(productsWithNames);
    };
    getData();
  }, []);

  return (
    <div className="tippy-cart-container">
      <h2 className="tippy-cart-title">Sản Phẩm Mới Thêm</h2>
      {updatedProducts && updatedProducts.length > 0 ? (
        updatedProducts.map((product, index) => {
          if (index >= 5) return null;
          return (
            <Link
              className="product-item"
              key={index}
              href={`/${createSlug(
                product.productTypeName
              )}-${product.productTypeId.toLowerCase()}/${createSlug(
                product.name
              )}-${product.productId.toLowerCase()}`}
            >
              <div className="product-wrap-img-name">
                <Image
                  src={product.image}
                  alt="badminton"
                  width={54}
                  height={54}
                  className="product-img"
                ></Image>
                <div className="product-name">{`${product.name.slice(
                  0,
                  37
                )}...`}</div>
              </div>
              <div className="product-price">
                {currencyFormatter.format(product.price)}
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: 2,
                  }}
                >
                  đ
                </span>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="no-product">
          <h2 style={{ textAlign: "center" }}>Không có sản phẩm nào</h2>
          <Image
            src="/images/noProduct.png"
            width={0}
            height={400}
            sizes="100vw"
            alt=":(("
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      )}
      {products && products?.length > 0 ? (
        <div className="tippy-cart-footer">
          {productCountInCart > 5 ? (
            <span className="count-product-in-cart">
              {productCountInCart - 5} Thêm Hàng Vào Giỏ
            </span>
          ) : null}

          <Link
            href="/user/cart"
            className="btn-show-cart"
            style={{ marginLeft: "auto" }}
          >
            Xem giỏ hàng
          </Link>
        </div>
      ) : null}
    </div>
  );
};
export default TippyCart;
