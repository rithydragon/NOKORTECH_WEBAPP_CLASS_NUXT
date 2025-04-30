import { useAuthStore } from '~/stores/auth';

const toast = useToast();
const publicRoutes = ['/auths/login', '/auths/register', '/auths/forgot-password'];
const authRoutes = ['/auths/login', '/auths/register'];

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  
  // Configure cookies with proper attributes
  const accessToken = useCookie('rty_access_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  
  const refreshToken = useCookie('rty_refresh_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  // 1. Skip middleware for public routes
  if (publicRoutes.includes(to.path)) {
    if (auth.isAuthenticated && authRoutes.includes(to.path)) {
      toast.add({ color: 'blue', title: 'You are already logged in' });
      return navigateTo('/');
    }
    return;
  }

  // 2. Check if we have tokens
  const hasTokens = accessToken.value || refreshToken.value;
  
  if (!hasTokens) {
    return handleUnauthorized(to, 'Please login to continue');
  }

  // 3. If not authenticated but has tokens, try to refresh
  if (!auth.isAuthenticated && refreshToken.value) {
    try {
      const refreshed = await auth.refreshToken();
      if (refreshed) return; // Successfully refreshed
    } catch (error) {
      console.log('Refresh failed:', error);
      // Don't clear tokens here - let the auth store handle it
      return handleUnauthorized(to, 'Session expired. Please login again.');
    }
  }

  // 4. Final check - if still not authenticated, redirect
  if (!auth.isAuthenticated) {
    return handleUnauthorized(to, 'Please login to continue');
  }

  // 5. Role check (only if authenticated)
  if (to.meta.requiresRole && !hasRequiredRole(to, auth.user?.role)) {
    toast.add({ color: 'red', title: 'Permission denied' });
    return navigateTo(auth.user ? '/' : '/auths/login');
  }
});

function handleUnauthorized(to, message) {
  // Don't clear cookies here - let the auth store handle it
  if (process.client) {
    toast.add({
      color: 'red',
      title: message,
      timeout: 5000
    });
  }

  const redirectPath = to.fullPath === '/' ? '' : `?next=${encodeURIComponent(to.fullPath)}`;
  return navigateTo(`/auths/login${redirectPath}`);
}

function hasRequiredRole(to, userRole) {
  const requiredRole = to.meta?.requiresRole;
  if (!requiredRole) return true;
  if (!userRole) return false;
  return Array.isArray(requiredRole) 
    ? requiredRole.includes(userRole)
    : requiredRole === userRole;
}