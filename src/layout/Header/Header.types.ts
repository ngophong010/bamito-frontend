import { UserState } from '@/types/auth';

export interface HeaderProps {
  className?: string;
}

export interface HeaderState {
  cartItems: number;
  userInfo: UserState | null;
  loading: boolean;
  error: string | null;
}

export interface NavigationProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export interface UserMenuProps {
  user: UserState | null;
  onLogout: () => void;
}