import { type UserProfile } from '@/types/user';
import { type Category } from '@/types/category';

/**
 * Props for the main Header component
 * @interface HeaderProps
 */
export interface HeaderProps {
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * State interface for the Header component
 * @interface HeaderState
 */
export interface HeaderState {
  /** Number of items in the shopping cart */
  cartItems: number;
  /** Currently logged in user information */
  userInfo: UserProfile | null;
  /** Loading state for async operations */
  loading: boolean;
  /** Error message if any operation fails */
  error: string | null;
}

/**
 * Props for the Navigation component
 * @interface NavigationProps
 */
export interface NavigationProps {
  /** List of categories to display in the navigation */
  categories: Pick<Category, 'id' | 'name' | 'slug'>[];
  /** Optional className for styling */
  className?: string;
}

/**
 * Props for the CartButton component
 * @interface CartButtonProps
 */
export interface CartButtonProps {
  /** Number of items in cart to display */
  itemCount: number;
  /** Click handler for the cart button */
  onClick: () => void;
  /** Optional className for styling */
  className?: string;
  /** Flag to disable the button */
  disabled?: boolean;
}

/**
 * Props for the UserMenu component
 * @interface UserMenuProps
 */
export interface UserMenuProps {
  /** Currently logged in user or null if not logged in */
  user: UserProfile | null;
  /** Handler for user logout action */
  onLogout: () => Promise<void>;
  /** Optional className for styling */
  className?: string;
}
