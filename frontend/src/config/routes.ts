export const PUBLIC_ROUTES = ['user/login', 'user/register'];

export const PROTECTED_ROUTES = ['/dashboard'];

export const AUTH_ROUTES = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES];

export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname.includes(route));
}

export function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => pathname.includes(route));
}

export function extractLocale(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    return parts[0] || 'en';
}

export function extractRoute(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    return '/' + parts.slice(1).join('/');
}
