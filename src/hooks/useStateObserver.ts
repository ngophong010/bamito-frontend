import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { RootState } from '@/lib/redux/store';

// Custom hook for observing specific state changes
export const useStateObserver = <T>(
  selector: (state: RootState) => T,
  callback: (newValue: T, oldValue: T) => void,
  deps: React.DependencyList = []
) => {
  const currentValue = useAppSelector(selector);
  const previousValue = useRef<T>(currentValue);

  useEffect(() => {
    if (previousValue.current !== currentValue) {
      callback(currentValue, previousValue.current);
      previousValue.current = currentValue;
    }
  }, [currentValue, callback, ...deps]);
};

// Hook for observing cart changes
export const useCartObserver = (
  onCartChange: (totalCount: number, items: any[]) => void
) => {
  useStateObserver(
    (state) => ({ 
      totalCount: state.cart.totalCount, 
      items: state.cart.products 
    }),
    (newCart, oldCart) => {
      if (newCart.totalCount !== oldCart.totalCount || 
          newCart.items.length !== oldCart.items.length) {
        onCartChange(newCart.totalCount, newCart.items);
      }
    }
  );
};

// Hook for observing user authentication
export const useAuthObserver = (
  onAuthChange: (isLoggedIn: boolean, profile: any) => void
) => {
  useStateObserver(
    (state) => ({ 
      isLoggedIn: state.user.isLoggedIn, 
      profile: state.user.profile 
    }),
    (newAuth, oldAuth) => {
      if (newAuth.isLoggedIn !== oldAuth.isLoggedIn) {
        onAuthChange(newAuth.isLoggedIn, newAuth.profile);
      }
    }
  );
};