"use client";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/joy/Skeleton";
import { useEffect, useState } from "react";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import { useDispatch, useSelector } from "react-redux";
import { loadingProduct } from "../../redux-toolkit/productSlice";
import Link from "next/link";
import Image from "next/image";
import {
  handleGetAllProductOfTheCategory,
  handleGetAllCategoryService,
} from "../../services/productService";
import Rating from "@mui/material/Rating";
import { useRouter } from "next/navigation";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";
import { logOut, updateFavourites } from "../../redux-toolkit/userSlice";
import { toast } from "react-toastify";
import {
  handleCreateFavourite,
  handleDeleteFavourite,
  handleGetAllFavourite,
} from "../../services/userService";
import "./Introduce.scss";
import _ from "lodash";
import { convertSlugUrl } from "@/utils/commonUtils";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const Introduce = () => {
  const [allData, setAllData] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const favourites = useSelector((state) => state.user?.favourites);
  const userId = useSelector((state) => state.user?.userInfo?.id);

  let getProductClassify = async (racket, shoe, shirt) => {
    try {
      dispatch(loadingProduct(true));
      let resR = await handleGetAllProductOfTheProductType(
        racket.productTypeId,
        4,
        1
      );
      let resShirt = await handleGetAllProductOfTheProductType(
        shirt.productTypeId,
        4,
        1
      );
      let resShoe = await handleGetAllProductOfTheProductType(
        shoe.productTypeId,
        4,
        1
      );
      if (
        resR &&
        resShirt &&
        resShoe &&
        resR.errCode === 0 &&
        resShirt.errCode === 0 &&
        resShoe.errCode === 0
      ) {
        setAllData([
          {
            title: racket.productTypeName,
            id: racket.productTypeId,
            data: resR.data,
          },
          {
            title: shoe.productTypeName,
            id: shoe.productTypeId,
            data: resShoe.data,
          },
          {
            title: shirt.productTypeName,
            id: shirt.productTypeId,
            data: resShirt.data,
          },
        ]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      dispatch(loadingProduct(false));
    }
  };

  let getAllCategories = async () => {
    try {
      dispatch(loadingProduct(true));
      let res = await handleGetAllCategoryService();
      if (res && res.errCode === 0) {
        if (res?.data && res?.data?.length > 0) {
          let racket = res?.data.find(
            (productType) => productType.productTypeName === "Vợt cầu lông"
          );
          let shoe = res?.data.find(
            (productType) => productType.productTypeName === "Giày cầu lông"
          );
          let shirt = res?.data.find(
            (productType) => productType.productTypeName === "Áo cầu lông"
          );
          getProductClassify(racket, shoe, shirt);
        }
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.errCode === -4) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      dispatch(loadingProduct(false));
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (favourites && favourites.length > 0) {
      let newAllData = _.cloneDeep(allData);
      newAllData = newAllData.map((productType) => {
        let newProductType = { ...productType };
        newProductType.data = newProductType.data.map((product) => ({
          ...product,
          favourite: favourites.includes(product.productId),
        }));
        return newProductType;
      });
      setDataProducts(newAllData);
    } else {
      setDataProducts(allData);
    }
  }, [favourites, allData]);

  const handleClickMore = (productTypeId, productTypeName) => {
    dispatch(handleChangePage(1));
    router.push(
      `/${convertSlugUrl(productTypeName)}-${productTypeId.toLowerCase()}`
    );
  };

  const handleClickLike = async (productId, status) => {
    if (userId) {
      try {
        if (status === "like") {
          let res = await handleDeleteFavourite(userId, productId);
          if (res && res.errCode === 0) {
            let ress = await handleGetAllFavourite(userId);
            dispatch(updateFavourites(ress?.data));
          } else {
            toast.error(res?.message);
          }
        }
        if (status === "noLike") {
          let res = await handleCreateFavourite({
            productId: productId,
            userId: userId,
          });
          if (res && res.errCode === 0) {
            let ress = await handleGetAllFavourite(userId);
            dispatch(updateFavourites(ress?.data));
          } else {
            toast.error(res?.message);
          }
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.errCode === -4) {
          toast.error("Phiên bản đăng nhập hết hạn");
          dispatch(logOut());
        } else {
          toast.error(error?.response?.data?.message);
        }
      }
    } else {
      toast.error("Vui lòng đăng nhập");
    }
  };

  return (
    <>
      {dataProducts && dataProducts.length > 0 ? (
        dataProducts.map((item, index) => {
          return (
            <div className="introduce-badminton" key={index}>
              <div className="introduce-badminton-header">
                <h1 className="introduce-badminton-header-title">
                  {item.title}
                </h1>
                <div
                  onClick={() => handleClickMore(item.id, item.title)}
                  className="introduce-badminton-header-more"
                >
                  Xem tất cả
                </div>
              </div>
              <Grid container spacing={5}>
                {item.data &&
                  item.data.length > 0 &&
                  item.data.map((product, index) => {
                    return (
                      <Grid item xs={3} key={index}>
                        <Link
                          href={`/${convertSlugUrl(
                            product.productTypeData?.productTypeName
                          )}-${product.productTypeData?.productTypeId.toLowerCase()}/${convertSlugUrl(
                            product.name
                          )}-${product.productId.toLowerCase()}`}
                        >
                          <div className="introduce-badminton-item">
                            <div style={{ height: "450px" }}>
                              <Image
                                src={product.image}
                                width={0}
                                height={450}
                                sizes="100vw"
                                alt="badminton"
                                className="introduce-badminton-item-img"
                                style={{
                                  objectFit:
                                    item.title === "Áo cầu lông"
                                      ? "cover"
                                      : "contain",
                                }}
                              ></Image>
                              <button
                                className="favourite-btn"
                                onClick={(e) => e.preventDefault()}
                              >
                                {product.favourite ? (
                                  <FavoriteTwoToneIcon
                                    onClick={() => {
                                      handleClickLike(
                                        product.productId,
                                        "like"
                                      );
                                    }}
                                    className="favourite-icon"
                                    style={{ color: "red" }}
                                  />
                                ) : (
                                  <FavoriteBorderTwoToneIcon
                                    className="favourite-icon"
                                    onClick={() => {
                                      handleClickLike(
                                        product.productId,
                                        "noLike"
                                      );
                                    }}
                                  />
                                )}
                              </button>
                            </div>
                            <div className="introduce-badminton-item-name">
                              {product.name}
                            </div>
                            <div className="introduce-badminton-item-rating">
                              <Rating
                                defaultValue={0}
                                value={product.rating}
                                precision={0.5}
                                readOnly
                                style={{
                                  fontSize: "2.5rem",
                                  marginRight: "0.5rem",
                                }}
                              />
                              <p style={{ lineHeight: 1.5 }}>
                                {product.rating}/<span>5</span>
                              </p>
                            </div>
                            <div className="introduce-badminton-item-price">
                              <p
                                style={{
                                  color:
                                    product.discount !== 0
                                      ? "rgba(0,0,0,.54)"
                                      : "var(--primary-color)",
                                  textDecoration:
                                    product.discount !== 0
                                      ? "line-through"
                                      : "",
                                  marginRight: 10,
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
                                    product.price -
                                      (product.price * product.discount) / 100
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
                          </div>
                        </Link>
                      </Grid>
                    );
                  })}
              </Grid>
            </div>
          );
        })
      ) : (
        <>
          <div className="banner-loading-skeleton">
            <div className="loading-skeleton-title">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={200}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={90}
                height={40}
              />
            </div>
            <Grid container spacing={5}>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
            </Grid>
          </div>
          <div className="banner-loading-skeleton">
            <div className="loading-skeleton-title">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={200}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={90}
                height={40}
              />
            </div>
            <Grid container spacing={5}>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
            </Grid>
          </div>
          <div className="banner-loading-skeleton">
            <div className="loading-skeleton-title">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={200}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={90}
                height={40}
              />
            </div>
            <Grid container spacing={5}>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
            </Grid>
          </div>
          <div className="banner-loading-skeleton">
            <div className="loading-skeleton-title">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={200}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={90}
                height={40}
              />
            </div>
            <Grid container spacing={5}>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
              <Grid item xs={3}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={450}
                  style={{ borderRadius: 15 }}
                />
                <Skeleton
                  style={{ margin: "10px 0" }}
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={75}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="100%"
                  height={40}
                />
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </>
  );
};

export default Introduce;
