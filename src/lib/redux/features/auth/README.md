# Auth Slice Migration Guide

## ⚠️ Breaking Changes

The authSlice has been refactored to remove side effects and follow Redux best practices.

## Before (Old Pattern)
```typescript
// ❌ Side effects in Redux thunk
const handleRegister = () => {
  dispatch(registerUser({ data, router })); // Toast and navigation handled in Redux
};
```

## After (New Pattern)
```typescript
// ✅ Side effects in component
const handleRegister = async (data: RegisterDTO) => {
  const result = await dispatch(registerUser(data));
  
  if (registerUser.fulfilled.match(result)) {
    toast.success(result.payload.message || "Please check your email to activate your account.");
    router.push('/login');
  } else if (registerUser.rejected.match(result)) {
    toast.error(result.payload || "Registration failed");
  }
};
```

## New State Structure
```typescript
interface AuthState {
  registration: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: RegisterResponse | null;
  };
  passwordReset: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    email: string | null;
  };
}
```

## Usage Examples

### Registration Component
```typescript
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { registerUser, selectRegistrationState } from '@/lib/redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector(selectRegistrationState);

  const handleSubmit = async (data: RegisterDTO) => {
    const result = await dispatch(registerUser(data));
    
    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful! Please check your email.");
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### Password Reset Component
```typescript
const ForgotPasswordForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector(selectPasswordResetState);

  const handleSubmit = async (email: string) => {
    const result = await dispatch(sendPasswordResetOtp(email));
    
    if (sendPasswordResetOtp.fulfilled.match(result)) {
      toast.success("OTP sent successfully!");
      // Set email in OTP slice for next step
      dispatch(startOtpVerification(email));
      router.push('/change-password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email input */}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send OTP'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

## Benefits of New Pattern

1. **Pure Redux**: No side effects in reducers/thunks
2. **Testable**: Easy to test Redux logic separately from UI effects
3. **Flexible**: Components control their own side effects
4. **Maintainable**: Clear separation of concerns
5. **Type Safe**: Proper TypeScript throughout