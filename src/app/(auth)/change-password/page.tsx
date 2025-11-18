"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to forgot-password if no email/token is provided
    router.replace('/forgot-password');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>
      Redirecting...
    </div>
  );
}