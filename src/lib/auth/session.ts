import { cookies } from 'next/headers';
import { jwtManager } from './jwt';
import { User } from '@/types';

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
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtManager.decodeToken(token);
        if (!decoded || jwtManager.isTokenExpired(token)) {
            return null;
        }
        // In a real system, you might also quickly check if the user still exists in the DB
        return { id: decoded.userId, role: decoded.roleId };
    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
};
