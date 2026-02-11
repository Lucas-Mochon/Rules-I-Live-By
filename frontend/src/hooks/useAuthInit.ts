'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';

export function useAuthInit() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const authService = AuthService.getInstance();
                const userService = UserService.getInstance();

                if (authService.isAuthenticated()) {
                    await userService.fetchMe();
                }
            } catch (err) {
                void err;
                AuthService.getInstance().logout();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    return { isLoading };
}
