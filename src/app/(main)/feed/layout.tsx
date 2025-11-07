import UserLayout from "@/layout/userLayout/UserLayout";
import { PropsWithChildren } from "react";
import { categoryService } from "@/services/categoryService";

// This layout wraps the feed page with the main site navigation, header, and footer.
export default async function LayoutFeed({ children }: PropsWithChildren) {
  const categoriesResponse = await categoryService.getCategories();
  
  return <UserLayout categories={categoriesResponse.items}>{children}</UserLayout>;
}
