# OTP Slice Usage Guide

## New State Structure
```typescript
interface OtpState {
  verificationContext: string | null; // User's email
  verification: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: LoginResponse | null;
  };
  resend: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}
```

## Usage Examples

### OTP Verification Component
```typescript
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  verifyOtp, 
  resendOtp,
  selectOtpContext,
  selectVerificationState,
  selectResendState 
} from '@/lib/redux/features/auth/otpSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const OtpVerificationForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const email = useAppSelector(selectOtpContext);
  const verificationState = useAppSelector(selectVerificationState);
  const resendState = useAppSelector(selectResendState);

  const handleVerifyOtp = async (otpCode: string) => {
    if (!email) return;
    
    const result = await dispatch(verifyOtp({ email, otpCode }));
    
    if (verifyOtp.fulfilled.match(result)) {
      toast.success("OTP verified successfully!");
      // Handle successful login (store tokens, redirect, etc.)
      router.push('/dashboard');
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    
    const result = await dispatch(resendOtp(email));
    
    if (resendOtp.fulfilled.match(result)) {
      toast.success("OTP sent successfully!");
    }
  };

  if (!email) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h2>Enter OTP sent to {email}</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        handleVerifyOtp(formData.get('otp') as string);
      }}>
        <input 
          name="otp" 
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
        />
        
        <button 
          type="submit" 
          disabled={verificationState.status === 'loading'}
        >
          {verificationState.status === 'loading' ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      {verificationState.error && (
        <div className="error">{verificationState.error}</div>
      )}

      <button 
        onClick={handleResendOtp}
        disabled={resendState.status === 'loading'}
      >
        {resendState.status === 'loading' ? 'Sending...' : 'Resend OTP'}
      </button>

      {resendState.error && (
        <div className="error">{resendState.error}</div>
      )}
    </div>
  );
};
```

### Integration with Password Reset Flow
```typescript
// In ForgotPasswordForm component
const handleForgotPassword = async (email: string) => {
  const result = await dispatch(sendPasswordResetOtp(email));
  
  if (sendPasswordResetOtp.fulfilled.match(result)) {
    // Set context for OTP verification
    dispatch(startOtpVerification(email));
    toast.success("OTP sent to your email!");
    router.push('/verify-otp');
  }
};
```

### Reset Password with OTP Component
```typescript
const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const email = useAppSelector(selectOtpContext);

  const handleResetPassword = async (otpCode: string, newPassword: string) => {
    if (!email) return;
    
    const result = await dispatch(authService.resetPassword({
      token: '', // If using token-based reset
      otpCode,
      newPassword
    }));
    
    if (result.success) {
      toast.success("Password reset successfully!");
      dispatch(clearOtpState());
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="otp" placeholder="Enter OTP" required />
      <input name="password" type="password" placeholder="New Password" required />
      <button type="submit">Reset Password</button>
    </form>
  );
};
```

## Key Features

1. **Separate State Management**: Verification and resend operations have independent state
2. **Context Preservation**: Email context maintained throughout OTP flow
3. **Error Handling**: Granular error states for different operations
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Clean Integration**: Works seamlessly with auth service layer

## Best Practices

1. **Always check context**: Verify email exists before OTP operations
2. **Handle side effects in components**: Toast notifications, navigation, token storage
3. **Clear state appropriately**: Use specific clear actions for granular control
4. **Validate OTP format**: Client-side validation before API calls