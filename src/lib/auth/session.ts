import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/utils/jwt'; // Your server-side JWT utility
import { User } from '@/types'; // Or a more specific session type

interface UserSession {
    id: number;
    role: string;
}

/**
 * A server-side only function to get the current user's session from cookies.
 * This can be called in Server Components, Route Handlers, and Server Actions.
 * @returns The user session payload or null if not authenticated.
 */
export const getUserSession = async (): Promise<UserSession | null> => {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = verifyAccessToken(token); // This should throw an error if invalid
        // In a real system, you might also quickly check if the user still exists in the DB
        return { id: decoded.id, role: decoded.role };
    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
};
