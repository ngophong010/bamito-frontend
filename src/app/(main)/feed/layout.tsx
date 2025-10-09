import UserLayout from "@/layout/userLayout/UserLayout";
import { PropsWithChildren } from "react";

// This layout wraps the feed page with the main site navigation, header, and footer.
export default function LayoutFeed({ children }: PropsWithChildren) {
  return <UserLayout>{children}</UserLayout>;
}
