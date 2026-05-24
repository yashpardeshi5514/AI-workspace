'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
export function ProtectedRoute({ children }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);
    if (!isAuthenticated()) {
        return null;
    }
    return <>{children}</>;
}
//# sourceMappingURL=ProtectedRoute.js.map