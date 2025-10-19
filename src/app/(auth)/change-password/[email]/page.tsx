"use client";
import React, { Suspense } from 'react'; // Import Suspense
import ChangePasswordForm from './ChangePasswordForm'; // Create a new component for the logic
import Loading from '@/components/Loading/Loading';

// Best practice for pages that use `useSearchParams` is to wrap the logic
// component in a Suspense boundary.
const ChangePasswordPage = () => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <ChangePasswordForm />
        </Suspense>
    );
};

export default ChangePasswordPage;
