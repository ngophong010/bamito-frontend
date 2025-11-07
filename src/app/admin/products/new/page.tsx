"use client";
import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setLoading } from "@/lib/redux/features/admin/shared/adminUISlice";
import { productService } from "@/services/productService";
import { regex } from "@/lib/utils";
import Image from "next/image";
import { logOut } from "@/lib/redux/features/user/userSlice";
import { RootState } from "@/lib/redux/store";
import { ApiError } from "@/repositories/errors";

const mdParser = new MarkdownIt();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ProductFormData {
  productID: string;
  brandID: string;
  category: string;
  productName: string;
  price: string;
  discount?: string;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ProductPost = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();
  
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const isEditMode = pathname.includes("/edit");
  // Note: dataPost is legacy and should be migrated to new admin slices
  const dataPost = useAppSelector((state: RootState) => state.admin?.dataPost as any);
  const data = dataPost?.data;
  const categoryData = dataPost?.categoryData || [];
  const brandData = dataPost?.brandData || [];
  
  const [imageValue, setImageValue] = useState<string>("/images/ImgNoProduct.png");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [desContent, setDesContent] = useState<string>("");
  const [desHTML, setDesHTML] = useState<string>("");

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setFileImage(file);
      setImageValue(objUrl);
      setImageError(false);
    } else {
      setFileImage(null);
      setImageValue("/images/ImgNoProduct.png");
      setImageError(true);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("productID", data.productId);
      setValue("brandID", data.brandData?.brandId);
      setValue("category", data.categoryData?.categoryId);
      setValue("productName", data.name);
      setValue("price", currencyFormatter.format(data.price));
      setValue("discount", data.discount?.toString());
      setImageValue(data.image);
      
      if (data.descriptionContent && data.descriptionContent !== "null") {
        setDesContent(data.descriptionContent);
        setDesHTML(data.descriptionHTML);
      }
    }
  }, [data, setValue]);

  const handleCreateProduct = async (submitData: ProductFormData) => {
    if (!fileImage) {
      setImageError(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", fileImage);
    formData.append("productId", submitData.productID);
    formData.append("brandId", submitData.brandID);
    formData.append("categoryId", submitData.category);
    formData.append("name", submitData.productName);
    formData.append("price", submitData.price.replace(/\./g, ""));
    formData.append("descriptionContent", desContent);
    formData.append("descriptionHTML", desHTML);

    await productService.createProduct(formData);
    toast.success("Thêm sản phẩm thành công");
    router.push("/admin/products");
  };

  const handleUpdateProduct = async (submitData: ProductFormData) => {
    if (!data?.id) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    const formData = new FormData();
    if (fileImage) formData.append("image", fileImage);
    formData.append("productId", submitData.productID);
    formData.append("brandId", submitData.brandID);
    formData.append("categoryId", submitData.category);
    formData.append("name", submitData.productName);
    formData.append("price", submitData.price.replace(/\./g, ""));
    formData.append("discount", submitData.discount || "0");
    formData.append("descriptionContent", desContent);
    formData.append("descriptionHTML", desHTML);

    await productService.updateProduct(data.id, formData);
    toast.success("Cập nhật sản phẩm thành công");
    router.push("/admin/products");
  };

  const onSubmit = async (submitData: ProductFormData) => {
    try {
      dispatch(setLoading({ key: 'productForm', loading: true }));
      
      if (isEditMode) {
        await handleUpdateProduct(submitData);
      } else {
        await handleCreateProduct(submitData);
      }
    } catch (err) {
      const error = err as ApiError;
      
      if (error.code === 'PRODUCT_ID_EXISTS') {
        toast.error("Mã sản phẩm đã tồn tại");
      } else if (error.code === 'PRODUCT_NAME_EXISTS') {
        toast.error("Tên sản phẩm đã tồn tại");
      } else if (error.code === 'PRODUCT_NOT_FOUND') {
        toast.error("Sản phẩm không tồn tại");
      } else if (error.code === 'SESSION_EXPIRED') {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      } else {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    } finally {
      dispatch(setLoading({ key: 'productForm', loading: false }));
    }
  };

  const handleChangeMarkdown = ({ html, text }: { html: string; text: string }) => {
    setDesContent(text);
    setDesHTML(html);
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const price = e.target.value.replace(/[^\d]/g, "");
      setValue("price", currencyFormatter.format(Number(price)), {
        shouldValidate: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="Modal-Add" style={{ width: 800 }}>
      <h2 style={{ margin: "20px 0 30px 0", fontSize: 30, fontWeight: "bold" }}>
        {isEditMode ? "Sửa thông tin sản phẩm" : "Thêm sản phẩm"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: 290 }}>
          <Image
            src={imageValue}
            alt="Product"
            height={250}
            width={200}
            style={{ height: 250, width: 200, objectFit: "contain", borderRadius: 10, border: "1px solid gray" }}
          />
          {imageError && (
            <p style={{ color: "red", fontSize: "var(--small-fontSize)", marginTop: "1rem" }}>
              Tải hình ảnh sản phẩm
            </p>
          )}
        </div>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ height: "4rem" }}>
          Tải ảnh lên
          <VisuallyHiddenInput type="file" onChange={handleChangeImage} accept="image/*" />
        </Button>
      </div>

      <div className="modal-add-input-wrapper">
        <div className="modal-add-input modal-add-input-flex">
          <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Mã sản phẩm</p>
          <Controller
            control={control}
            name="productID"
            rules={{ required: "Nhập mã sản phẩm" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.productID}
                variant="filled"
                hiddenLabel
                InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                style={{ marginTop: 15, width: "100%" }}
              />
            )}
          />
          {errors.productID && <p className="error-message-flex">{errors.productID.message}</p>}
        </div>

        <div className="modal-add-input modal-add-input-flex">
          <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Loại sản phẩm</p>
          <Controller
            control={control}
            name="category"
            rules={{ required: "Chọn loại sản phẩm" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.category}
                select
                variant="filled"
                hiddenLabel
                InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                SelectProps={{
                  IconComponent: () => <ArrowDropDownIcon style={{ fontSize: "3.5rem" }} />,
                }}
                style={{ marginTop: 15, width: "100%" }}
              >
                {categoryData?.map((option: any) => (
                  <MenuItem key={option.categoryId} value={option.categoryId} style={{ fontSize: "var(--text-fontSize)" }}>
                    {option.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {errors.category && <p className="error-message-flex">{errors.category.message}</p>}
        </div>
      </div>

      <div className="modal-add-input-wrapper">
        <div className="modal-add-input modal-add-input-flex">
          <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Thương hiệu</p>
          <Controller
            control={control}
            name="brandID"
            rules={{ required: "Chọn thương hiệu" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.brandID}
                select
                variant="filled"
                hiddenLabel
                InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                SelectProps={{
                  IconComponent: () => <ArrowDropDownIcon style={{ fontSize: "3.5rem" }} />,
                }}
                style={{ marginTop: 15, width: "100%" }}
              >
                {brandData?.map((option: any) => (
                  <MenuItem key={option.brandId} value={option.brandId} style={{ fontSize: "var(--text-fontSize)" }}>
                    {option.brandName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {errors.brandID && <p className="error-message">{errors.brandID.message}</p>}
        </div>

        <div className="modal-add-input modal-add-input-flex">
          <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Giá (VND)</p>
          <Controller
            control={control}
            name="price"
            rules={{
              required: "Nhập giá sản phẩm",
              pattern: { value: regex.PRICE, message: "Giá không hợp lệ" },
            }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.price}
                variant="filled"
                hiddenLabel
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e);
                  handleChangePrice(e);
                }}
                InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                style={{ marginTop: 15, width: "100%" }}
              />
            )}
          />
          {errors.price && <p className="error-message-flex">{errors.price.message}</p>}
        </div>
      </div>

      <div className="modal-add-input-wrapper">
        <div className="modal-add-input modal-add-input-flex">
          <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Tên sản phẩm</p>
          <Controller
            control={control}
            name="productName"
            rules={{ required: "Nhập tên sản phẩm" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.productName}
                variant="filled"
                hiddenLabel
                InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                style={{ marginTop: 15, width: "100%" }}
              />
            )}
          />
          {errors.productName && <p className="error-message">{errors.productName.message}</p>}
        </div>

        {isEditMode && (
          <div className="modal-add-input modal-add-input-flex">
            <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099" }}>Giảm giá (%)</p>
            <Controller
              control={control}
              name="discount"
              rules={{
                pattern: { value: regex.DISCOUNT, message: "Giảm giá không hợp lệ" },
              }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.discount}
                  variant="filled"
                  hiddenLabel
                  InputProps={{ style: { fontSize: "var(--text-fontSize)" } }}
                  style={{ marginTop: 15, width: "100%" }}
                />
              )}
            />
            {errors.discount && <p className="error-message">{errors.discount.message}</p>}
          </div>
        )}
      </div>

      <div>
        <p style={{ fontSize: 18, fontWeight: "Bold", color: "#00000099", margin: "14px 0" }}>Mô tả</p>
        <MdEditor
          style={{ width: "100%", height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          value={desContent}
          onChange={handleChangeMarkdown}
        />
      </div>

      <Button type="submit" variant="contained" className="btn" style={{ margin: "30px 0" }}>
        {isEditMode ? "Cập nhật" : "Thêm"}
      </Button>
    </form>
  );
};

export default ProductPost;
