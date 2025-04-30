import { useAuthStore } from '~/stores/auth';

const toast = useToast();
const publicRoutes = ['/auths/login', '/auths/register', '/auths/forgot-password'];
const authRoutes = ['/auths/login', '/auths/register'];

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const accessToken = useCookie('rty_access_token');
  const refreshToken = useCookie('rty_refresh_token');

  // 1. Skip middleware for public routes (unless authenticated user tries to access auth routes)
  if (publicRoutes.includes(to.path)) {
    if (auth.isAuthenticated && authRoutes.includes(to.path)) {
      toast.add({ color: 'blue', title: 'You are already logged in' });
      return navigateTo('/');
    }
    return;
  }

  // 2. Check token presence before any auth logic
  if (!accessToken.value && !refreshToken.value) {
    toast.add({ color: 'orange', title: 'No authentication tokens found' });
    return handleUnauthorized(to);
  }

  // 3. Initial state check
  if (!auth.isAuthenticated) {
    try {
      // Attempt silent refresh if we have a refresh token
      if (refreshToken.value) {
        const refreshed = await auth.refreshToken();
        if (refreshed) {
          return; // Continue navigation after successful refresh
        }
      }
      toast.add({ color: 'red', title: 'Session expired. Please login again.' });
      return handleUnauthorized(to);
    } catch (error) {
      console.log('Token refresh failed:', error);
      return handleUnauthorized(to, 'Session expired. Please login again.');
    }
  }

  // 4. Verify token validity
  try {
    const isValid = await auth.verifyToken(accessToken.value);
    if (!isValid) {
      toast.add({ color: 'red', title: 'Invalid session detected' });
      return handleUnauthorized(to);
    }

    // 5. Role-based access control
    if (to.meta.requiresRole && !hasRequiredRole(to, auth.user?.role)) {
      toast.add({ 
        color: 'red', 
        title: 'You do not have permission to access this page' 
      });
      return navigateTo(auth.user ? '/' : '/auths/login');
    }
  } catch (error) {
    console.log('Auth verification error:', error);
    toast.add({ color: 'red', title: 'Authentication check failed' });
    return handleUnauthorized(to);
  }
});

function handleUnauthorized(to, message) {
  // Clear invalid tokens
  const accessToken = useCookie('rty_access_token');
  const refreshToken = useCookie('rty_refresh_token');
  accessToken.value = null;
  refreshToken.value = null;

  if (process.client) {
    toast.add({
      color: 'red',
      title: message || 'Please login to continue',
      timeout: 5000
    });
  }

  // Preserve the original destination
  const redirectPath = to.fullPath === '/' ? '' : `?next=${encodeURIComponent(to.fullPath)}`;
  
  return navigateTo(`/auths/login${redirectPath}`, {
    replace: true,
    external: false
  });
}

function hasRequiredRole(to, userRole) {
  const requiredRole = to.meta?.requiresRole;
  if (!requiredRole) return true;
  if (!userRole) return false;
  
  // Handle both array and single role requirements
  return Array.isArray(requiredRole)
    ? requiredRole.includes(userRole)
    : requiredRole === userRole;
}