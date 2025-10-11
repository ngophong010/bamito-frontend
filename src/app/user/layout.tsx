import UserLayout from "@/layout/userLayout/UserLayout";
import ProtectUser from "@/ProtectUser";

export default function LayoutUser({ children }) {
  return (
    <UserLayout>
      <ProtectUser>{children}</ProtectUser>
    </UserLayout>
  );
}
