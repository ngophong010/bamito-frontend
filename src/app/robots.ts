// /src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: [ // Best practice: Use an array for multiple user agents or rule groups
      {
        userAgent: "*",
        allow: "/",
        // Disallow private user-specific and admin pages
        disallow: [
          "/user/",
          "/admin/",
          "/cart",
          "/login",
          "/register",
        ],
      },
      // You could add other user agents here, e.g., for Googlebot-Image
      // {
      //   userAgent: "Googlebot-Image",
      //   disallow: "/private-images/",
      // },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
