import { useAuthStore } from '~/stores/auth';
const toast = useToast()
const publicRoutes = ['/auths/login', '/auths/register'];
const authRoutes = ['/auths/login', '/auths/register'];


export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  
  // 1. Skip public routes (except auth routes for authenticated users)
  if (publicRoutes.includes(to.path)) {
    if (auth.isAuthenticated && authRoutes.includes(to.path)) {
      return navigateTo('/');
    }
    return;
  }

  // 2. Initial state check
  if (!auth.isAuthenticated) {
    toast.add({color:'red',title:'User unauthenticated login'})
    return handleUnauthorized(to);
  }

  // 3. Perform auth check only when needed
  try {
    // Check auth state without token verification
    const isStillValid = await auth.checkAuthState();
    if (!isStillValid) {
      toast.add({color:'red', title:'Session expired. Please login again!'})
      return handleUnauthorized(to, 'Session expired. Please login again.');
    }

    // Role check
    if (to.meta.requiresRole && !hasRequiredRole(to, auth.user?.role)) {
      return navigateTo(auth.user ? '/' : '/auths/login');
    }
  } catch (error) {
    toast.add({color:'red', title:('Auth error:', error)})
    return handleUnauthorized(to);
  }
});

function handleUnauthorized(to, message) {
  if (process.client) {
    toast.add({color:'red', title:message || 'Please login to continue'})
    console.log(message || 'Please login to continue');
  }
  
  return navigateTo(`/auths/login/next=${encodeURIComponent(to.fullPath)}`, {
    replace: true,
    external: false
  });
}

function hasRequiredRole(to, userRole) {
  const requiredRole = to.meta?.requiresRole;
  if (!requiredRole) return true;
  if (!userRole) return false;
  
  return Array.isArray(requiredRole)
    ? requiredRole.includes(userRole)
    : requiredRole === userRole;
}