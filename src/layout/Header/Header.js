"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import {
  faChevronDown,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { toast } from "react-toastify";
import "./Header.scss";
import { logOut } from "../../redux-toolkit/userSlice";
import { handleGetAllCategoryService } from "../../services/productService";
import UserMenu from "../../components/UserMenu/UserMenu";
import Search from "../../components/Search/Search";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";
import { USER_MENU } from "../../utils/menu";
import TippyCart from "../../components/TippyCart/TippyCart";
import { createSlug } from "@/utils/formatters";
import CategoriesMenu from "@/components/CategoriesMenu/CategoriesMenu";
import { useCallback } from "react";

const USER_MENU_DELAY = [0, 300];
const PRODUCT_MENU_DELAY = [0, 500];
const CART_TIPPY_OFFSET = [-26, 5];

// const CategoriesMenu = () => {
//   const [categories, setCategories] = useState([]);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   let getAllCategory = async () => {
//     try {
//       let res = await handleGetAllCategoryService();
//       if (res && res.errCode === 0) {
//         setCategoriess(res?.data);
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message);
//     }
//   };
//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   const handleChangeCategory = (categoryId, categoryName) => {
//     dispatch(handleChangePage(1));
//     router.push(
//       `/${createSlug(categoryName)}-${categoryId.toLowerCase()}`
//     );
//     // router.push(`/product/${categoryId}`);
//   };

//   return (
//     <>
//       {categories.map((item, index) => {
//         return (
//           <div
//             key={index}
//             className="product-type-wrapper"
//             onClick={() =>
//               handleChangeCategory(item.categoryId, item.categoryName)
//             }
//           >
//             <h1>{item.categoryName}</h1>
//           </div>
//         );
//       })}
//     </>
//   );
// };

function Header() {
  const [isTippyOn, setIsTippyOn] = useState(false);
  const [categories, setCategoriess] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const login = useSelector((state) => state.user.login);
  const avatarUser = useSelector((state) => state.user.userInfo?.avatar);
  const roleId = useSelector((state) => state.user.userInfo?.roleData?.roleId);
  const productCountInCart = useSelector((state) => state.cart?.totalProduct);

  useEffect(() => {
    const fetchCategoriess = async () => {
      try {
        const res = await handleGetAllCategoryService();
        if (res && res.errCode === 0) {
          setCategoriess(res.data || []);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load product types");
      }
    };
    fetchCategoriess();
  }, []);

  const handleLogOut = useCallback(() => dispatch(logOut()), [dispatch]);

  const handleCategoryClick = useCallback(() => {
    dispatch(handleChangePage(1));
  }, [dispatch]);

  const handleClickCart = () => {
    router.push("/user/cart");
  };

  let handleClickSaleOff = () => {
    dispatch(handleChangePage(1));
    router.push("/sale-off");
  };

  let handleClickFeed = () => {
    router.push("/feed");
  };

  return (
    <div className="header-container">
      <Link href="/">
        <Image src="/images/color-logo.png" alt="logo" height={50} width={100} />
      </Link>

      <Tippy
        onShow={() => {
          setIsTippyOn(true);
        }}
        onHide={() => {
          setIsTippyOn(false);
        }}
        placement="bottom"
        interactive
        delay={PRODUCT_MENU_DELAY}
        // offset={[0, 3]}
        render={(attrs) => (
          <div className="drop-down-menu" tabIndex="-1" {...attrs}>
            {/* <CategoriessMenu /> */}
            <CategoriessMenu
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        )}
      >
        <div className="drop-down-product">
          <span className={`text ${isTippyOn ? "is-tippy-on" : null}`}>
            SẢN PHẨM
          </span>
          <FontAwesomeIcon
            className={`icon ${isTippyOn ? "is-tippy-on" : null}`}
            icon={faChevronDown}
          />
        </div>
      </Tippy>

      <Link href="/sale-off" className="btn-sale-off" onClick={() => dispatch(handleChangePage(1))}>
        SALE OFF
      </Link>

      <Link href="/feed" className="btn-sale-off" onClick={handleClickFeed}>
        TIN TỨC
      </Link>

      <Search></Search>

      <div className="header-wrap-cart-actions">
        {login ? (
          <Tippy
            placement="bottom-end"
            interactive
            delay={[0, 100]}
            offset={CART_TIPPY_OFFSET}
            render={(attrs) => (
              <div
                className="drop-down-menu"
                tabIndex="-1"
                {...attrs}
                style={{ width: 550, borderRadius: 5 }}
              >
                <TippyCart></TippyCart>
              </div>
            )}
          >
            {/* <div className="header-cart" onClick={handleClickCart}>
              <ShoppingCartOutlinedIcon className="header-cart-icon"></ShoppingCartOutlinedIcon>
              <span className="header-cart-notification">
                {productCountInCart}
              </span>
            </div> */}
            <Link href="/user/cart" className="header-cart" onClick={handleClickCart}>
              <ShoppingCartOutlinedIcon className="header-cart-icon"></ShoppingCartOutlinedIcon>
              <span className="header-cart-notification">
                {productCountInCart}
              </span>
            </Link>
          </Tippy>
        ) : null}

        {login ? (
          <div className="header-actions">
            <Tippy
              interactive
              placement="bottom-end"
              delay={USER_MENU_DELAY}
              render={(attrs) => (
                <UserMenu
                  attrs={attrs}
                  handleLogOut={handleLogOut}
                  menu={USER_MENU}
                  roleId={roleId}
                />
              )}
            >
              <button className="header-action-btn">
                <Image
                  src={avatarUser ? avatarUser : "/images/default-avatar.png"}
                  alt="User avatar"
                  height={50}
                  width={50}
                  className="action-avatar"
                  style={{ border: "1px solid var(--primary-color)" }}
                />
              </button>
            </Tippy>
          </div>
        ) : (
          <div className="header-action-btn">
            <Link href="/login" className="login-btn">
              <FontAwesomeIcon icon={faRightToBracket} />
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
