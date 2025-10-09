import { handleGetAllProductService } from "@/services/productService";
import { convertSlugUrl } from "@/utils/serverUtils";

const getAllProduct = async () => {
  let res = await handleGetAllProductService(0, 1, "");
  if (res && res.errCode === 0) {
    // console.log(res.data)
    return res.data;
  }
};

const URL = "https://e-commerce-xi-sepia.vercel.app";

export default async function sitemap() {
  const products = await getAllProduct();

  const productURL = products.map((product) => ({
    url: `${URL}/${convertSlugUrl(
      product.productTypeData.productTypeName
    )}-${product.productTypeData.productTypeId.toLowerCase()}/${convertSlugUrl(
      product.name
    )}-${product.productId.toLowerCase()}`,
    lastModified: new Date(),
    priority: 1,
  }));
  return [...productURL];
}
