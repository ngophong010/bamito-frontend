import { handleGetAllProductTypeService, handleGetAllProductService } from "@/services/productService";
import { createSlug } from "@/utils/formatters";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const productTypes = await handleGetAllProductService("", "", "", false).then(res => res.data || []);
  // const productTypesURL = productTypes.map((product) => ({
  //   url: `${URL}/${createUrl(
  //     product.productTypeName
  //   )}-${product.productTypeId.toLowerCase()}/sitemap.xml`,
  //   lastModified: new Date(),
  //   priority: 0.5,
  // }));
  const productEntries = productTypes.map((productType) => ({
    url: `${SITE_URL}/${createSlug(productType.productTypeName)}-${productType.productTypeId.toLowerCase()}`,
    lastModified: productType.updatedAt || new Date(),
    priority: 0.8,
  }));

  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/sale-off`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/feed`,
      lastModified: new Date(),
      priority: 0.6,
    },
    // {
    //   url: `${SITE_URL}/privacy-policy`,
    //   lastModified: new Date(),
    //   priority: 0.8,
    // },
  ];

  return [
    ...staticPages,
    ...productTypeEntries,
    ...productEntries,
  ];
}
