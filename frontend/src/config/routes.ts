export const PUBLIC_ROUTES = ['user/login', 'user/register'];

export const PROTECTED_ROUTES = [
    'dashboard',
    'profile',
    'rules',
    'rules/create',
    'rules/[id]',
    'rules/[id]/edit',
    'broken',
];

export function isPublicRoute(pathname: string): boolean {
    const normalized = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    return PUBLIC_ROUTES.some(
        (route) => normalized === route || normalized.startsWith(route + '/')
    );
}

export function isProtectedRoute(pathname: string): boolean {
    const normalized = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    return PROTECTED_ROUTES.some((route) => {
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}(/|$)`);
        return regex.test(normalized);
    });
}

export function extractLocale(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    return parts[0] || 'en';
}

export function extractRoute(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    return '/' + parts.slice(1).join('/');
}
