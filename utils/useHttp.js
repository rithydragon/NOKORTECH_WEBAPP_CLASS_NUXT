const { accessToken, refreshAccessToken } = useAuth()
export async function useHttp(endpoint, options = {}) {
  const {
    method = 'GET',
    data = {},
    headers = {},
    filters = {},
    retryOn401 = true // Add option to control 401 retry behavior
  } = options;

  try {
    const { $config } = useNuxtApp();
    const baseURL = $config.public.apiBase || 'http://localhost:65532';

    // Get token from cookies with proper fallback
    const token = useCookie('rty_access_token').value || 
                 useCookie('rty_auth_token').value || 
                 '';

    // const token = useCookie('rty_access_token').value |
    console.log("Token in useHttp ----< k ", token);
    // Prepare headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    // Build URL with query params for GET requests
    let url = `${baseURL}${endpoint}`;
    if (method.toUpperCase() === 'GET' && data && Object.keys(data).length > 0) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      url += `?${params.toString()}`;
    }

    // Log request in development
    if (process.dev) {
      console.log('API Request →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→:', {
        url,
        method,
        headers: defaultHeaders,
        body: method !== 'GET' ? data : undefined,
      });
    }

    // Make the API call
    const response = await $fetch(url, {
      method,
      headers: defaultHeaders,
      body: method !== 'GET' ? data : undefined,
      ...options,
    });

    // Apply filters if provided and response is array
    let resultData = response;
    if (filters && Object.keys(filters).length > 0 && Array.isArray(resultData)) {
      resultData = resultData.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          const itemValue = item[key] !== undefined ? String(item[key]) : '';
          const filterValue = String(value);
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }

    return { data: resultData, error: null };

  } catch (error) {
    // const status = error.response?.status;
    // const route = useRoute();
    // const isLoginPage = route.path.includes('/auths/login');
    // const isTokenPresent = !!(useCookie('rty_access_token').value || useCookie('rty_auth_token').value);
    // const isPublicApi = endpoint.startsWith('/public') || endpoint.includes('/open');
    //  // Smart 401 handling
    // // Handle 401 unauthorized errors
    // if (status === 401) {
    //   const refreshed = await refreshAccessToken()
    //   if (refreshed) {
    //     return await $fetch(url, {
    //       ...options,
    //       retryOn401: false, // Prevent infinite loop
    //       headers: {
    //         ...options.headers,
    //         Authorization: `Bearer ${accessToken.value}`
    //       }
    //     })
    //   }
    // }
    // // throw err
    // }
    // if (status === 401 && !isPublicApi && !isLoginPage && isTokenPresent && process.client ) {
    //   console.warn('[Auth] Auto-logout triggered on secure route due to 401');

    //   // if (process.client) {
    //     // Clear auth cookies
    //     useCookie('rty_access_token').value = null;
    //     useCookie('rty_auth_token').value = null;
    //     useCookie('rty_refresh_token').value = null;
    //     useCookie('i18n_redirected').value = null;
        
    //     // Redirect to login
    //     const currentPath = useRoute().fullPath;
    //     navigateTo(`/auths/login?next=${encodeURIComponent(currentPath)}`, { 
    //       replace: true 
    //     });
    //   // }
    //   return { data: null, error: 'Unauthorized - Redirected to login' };
    // }

    // // Log error in development
    // if (process.dev) {
    //   console.log('API Error →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→:', {
    //     message: error.message,
    //     status: status,
    //     data: error.data,
    //   });
    // }

    // Return error response
    
        // Auto-logout on 401 if refresh fails or not attempted
  
    const status = error.response?.status
    const isTokenPresent = !!(useCookie('rty_access_token').value || useCookie('rty_auth_token').value)
    
    // Handle 401 unauthorized errors with token refresh
    if (status === 401 && retryOn401 && isTokenPresent && !isPublicApi && !isLoginPage) {
      try {
        console.log('Attempting token refresh...')
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          console.log('Token refreshed, retrying request...')
          // Get new token
          const newToken = useCookie('rty_access_token').value || 
                          useCookie('rty_auth_token').value || 
                          ''
          // Retry the request with new token
          return await useHttp(endpoint, {
            ...options,
            retryOn401: false, // Prevent infinite loop
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            }
          })
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
    }

    if (status === 401 && !isPublicApi && !isLoginPage && isTokenPresent && process.client) {
      console.warn('[Auth] Auto-logout triggered due to 401')
      // Clear auth cookies
      useCookie('rty_access_token').value = null
      useCookie('rty_auth_token').value = null
      useCookie('rty_refresh_token').value = null
      useCookie('i18n_redirected').value = null
      
      // Redirect to login
      const currentPath = route.fullPath
      navigateTo(`/auths/login?next=${encodeURIComponent(currentPath)}`, { 
        replace: true 
      })
      return { data: null, error: 'Unauthorized - Redirected to login' }
    }

    // Log error in development
    if (process.dev) {
      console.error('API Error:', {
        message: error.message,
        status: status,
        data: error.data,
      })
    }
      
    const errorMessage = error.data?.message || error.message || 'Unknown error occurred';
    return { data: null, error: errorMessage };
  }
}


// Usage Examples:Usage Examples://.
// // GET request with query params
// const { data, error } = await useHttp('/api/users', {
//   data: { page: 1, limit: 10 }
// });

// // POST request
// const { data, error } = await useHttp('/api/users', {
//   method: 'POST',
//   data: { name: 'John', email: 'john@example.com' }
// });

// // With filters
// const { data, error } = await useHttp('/api/users', {
//   filters: { role: 'admin' }
// });

// // Error handling
// if (error) {
//   console.log('Request failed:', error);
// } else {
//   console.log('Data:', data);
// }