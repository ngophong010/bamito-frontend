export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/user/", // More specific disallow rules are often better
        "/admin/",
        "/cart",
        "/checkout",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
