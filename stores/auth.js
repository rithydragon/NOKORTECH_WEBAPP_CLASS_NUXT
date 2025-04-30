import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { useRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
import { clearCookie } from '../utils/cookies'; // Adjust the import path as necessary
import { useState } from '#app'; // Adjust the import path as necessary
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';
import { useHttp } from '../utils/useHttp'; // Adjust the import path as necessary
import { navigateTo } from '#app';
import api from '~/helpers/api';
// Capture the current path
const router = useRouter();
import { v4 as uuidv4 } from 'uuid'
export const useAuthStore = defineStore('auth', {
    // export const useAuth = () => useState('authToken', () => null);  // Store authentication state
    state: () => ({
        _hydrated: false,
        rty_auth_token: null,
        rty_access_token: null,
        rty_refresh_token: null,
        token: null,
        lastRefresh: null,
        permissions: [],
        logoutTimer: null,
        isLoading: false,
        isAuthenticate: false,
        refreshTokenExpiry: null,
        refreshTokenCookie: null,
        user: null,
        isRefreshing: false,
        isAuthenticated: false,
        deviceId: '',
        refreshTokenValue: null // ✅ renamed to avoid conflict
    }),
    // persist: true,// Enable Nuxt persistence

    getters: {
        currentUser: (state) => state.user,
        isAuthentication: (state) => {
            return !!useCookie('rty_access_token').value;
            !!state.user && !!state.rty_access_token
        }
    },

    actions: {
        initDeviceId() {
            if (process.client) {
                const savedId = localStorage.getItem('device_id')
                if (savedId) {
                    this.deviceId = savedId
                } else {
                    const newId = uuidv4() // generate a new device ID
                    localStorage.setItem('device_id', newId)
                    this.deviceId = newId
                }
            }
        },
        async initialize() {
            // Initialize store from cookies
            this.accessToken = useCookie('rty_access_token').value || null;
            this.refreshToken = useCookie('rty_refresh_token').value || null;
            this.isAuthenticated = !!this.accessToken;

            if (this.isAuthenticated) {
                try {
                    // Fetch user data if authenticated
                    await this.fetchUser();
                } catch (error) {
                    this.logout();
                }
            }
        },
        async checkAuthState() {
            // Simple check without server verification
            if (this.isAuthenticated) {
                return true;
            }

            // Optional: Add lightweight token presence check
            const token = useCookie('rty_access_token').value;
            if (!token) {
                this.logout();
                return false;
            }

            return this.isAuthenticated;
        },

        async login(credentials) {
            try {
                 // Clear any existing tokens first
                // this.clearTokens();
                const { data, error } = await useHttp('/api/auth/login', {
                    method: 'POST',
                    data: credentials,
                    credentials: 'include', // This is crucial
                })

                if (error) throw error

                // Set client-side cookie (if not httpOnly from backend)
                if (process.client && data.accessToken) {
                    const accessToken = useCookie('rty_access_token', {
                        maxAge: 60 * 60 * 24, // 1  
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                        path: '/'
                    })
                    accessToken.value = data.accessToken
                }
                // // Set client-side cookie (if not httpOnly from backend)
                if (process.client && data.accessToken) {
                    const accessToken = useCookie('rty_refresh_token', {
                        maxAge: 60 * 60 * 24, // 1  
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                        path: '/'
                    })
                    accessToken.value = data.accessToken
                }
                const token = useCookie('rty_access_token').value;
                if (token) {
                    const decoded = jwtDecode(token);
                    console.log('Token expires:', new Date(decoded.exp * 1000));
                }
                this.user = data.user
                await this.hydrate()
                await navigateTo('/')

                return true
            } catch (error) {
                console.log('Login failed:', error)
                this.clearAuth()
                throw error
            }
            // const cookieOptions = {
            //     sameSite: 'lax',
            //     path: '/',
            //     secure: process.env.NODE_ENV === 'production', // true in production
            //     httpOnly: true
            //   };

            //   const accessToken = useCookie('rty_access_token', cookieOptions);
            //   const refreshToken = useCookie('rty_refresh_token', cookieOptions);
        },

        handleAuthSuccess(data) {
            // Set tokens
            if (process.client) {
              const accessToken = useCookie('rty_access_token', {
                maxAge: 60 * 60, // 1 hour
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/'
              });
              
              const refreshToken = useCookie('rty_refresh_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/'
              });
        
              accessToken.value = data.accessToken;
              refreshToken.value = data.refreshToken;
            }
        
            // Set user data
            this.user = data.user;
            this.message = null;
        
            // Show success toast
            // const toast = useToast();
            // toast.add({ color: 'green', title: 'Login successful' });
        
            // Hydrate and navigate
            this.hydrate();
            navigateTo('/');
          },
        
          handleAuthError(error) {
            console.log('Authentication error:', error);
            
            // Clear any existing auth data
            this.clearAuth();
            
            // Determine error message
            let errorMessage = 'Login failed';
            if (error.response) {
              // Handle HTTP error responses
              const status = error.response.status;
              const data = error.response.data;
              
              if (status === 401) {
                errorMessage = data.message || 'Invalid credentials';
              } else if (status === 400) {
                errorMessage = data.message || 'Validation error';
              } else if (status === 500) {
                errorMessage = 'Server error - please try again later';
              } else if (data?.message) {
                errorMessage = data.message;
              }
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            // Set store message
            this.message = errorMessage;
            
            // Show error toast
            const toast = useToast();
            toast.add({ 
              color: 'red', 
              title: errorMessage,
              timeout: 5000 // 5 seconds
            });
          },
        clearAuthData() {
            this.user = null;
            this.isAuthenticate = false;
            deleteCookie('rty_access_token');
            deleteCookie('rty_refresh_token');
        },

        get isAuthenticate() {
            const cookies = useCookies();
            return !!this.token || !!cookies.get('rty_auth_token');
        },

        async signup(userData) {
            const router = useRouter();

            try {
                const { data } = await useHttp('/api/auth/signup', {
                    method: 'POST',
                });

                if (error.value) {
                    throw new Error(error.value.message || 'Registration failed');
                }

                if (!data.value?.success) {
                    throw new Error(data.value?.message || 'Registration failed');
                }

                console.log('Signup Data:', data); // Log the data data

                if (data) {
                    this.rty_auth_token = data.token;
                    this.rty_access_token = data.accessToken;
                    this.rty_refresh_token = data.refreshToken;

                    this.user = jwtDecode(data.accessToken); // Decode user info

                    navigateTo('/'); // Redirect to profile
                    return true;
                }
                return false;
            } catch (error) {
                console.log('Signup Error:', error);
                throw new Error(error.data?.error || 'Signup failed');
            }
        },

        async getUserProfile() {
            this.isLoading = true;

            try {
                // 1. Get token from cookies with proper typing
                const accessToken = useCookie('rty_access_token').value;

                if (!accessToken) {
                    throw new Error('No authentication token found');
                }

                // 2. Verify token locally first
                try {
                    const decoded = jwtDecode(accessToken);
                    if (decoded.exp < Date.now() / 1000) {
                        throw new Error('Token expired');
                    }
                } catch (decodeError) {
                    console.log('Token validation failed:', decodeError);
                    throw new Error('Invalid authentication token');
                }

                // 3. Make API request with proper authorization
                const { data, error } = await useHttp('/api/user/profile', {
                    method: 'POST', // Changed to GET as profile should be a GET request
                });

                if (error) {
                    // Handle specific error cases
                    if (error.status === 401) {
                        throw new Error('Session expired. Please login again.');
                    } else if (error.status === 404) {
                        throw new Error('User profile not found');
                    } else {
                        throw new Error(error.message || 'Failed to fetch profile');
                    }
                }

                // 4. Validate response data
                // if (!data || !data.id) {
                //     throw new Error('Invalid profile data received');
                // }

                // 5. Update store
                this.user = data;
                return data;

            } catch (error) {
                console.log('Profile fetch failed:', error);

                // Clear auth if token is invalid
                if (error.message.includes('expired') ||
                    error.message.includes('Invalid authentication')) {
                    this.clearAuth();
                }

                throw error; // Re-throw for component handling
            } finally {
                this.isLoading = false;
            }
        },

        async refreshToken() {
            if (this.isRefreshing) return false;
            this.isRefreshing = true;

            try {
                const refreshToken = useCookie('rty_refresh_token').value;
                  if (!refreshToken) throw new Error('No refresh token');

                const { data, error } = await useHttp('/api/auth/refresh_token', {
                    method: 'POST',
                    credentials: 'include', // important: send cookies
                    // data: { refreshToken:refreshToken }
                });

                if (error || !data?.accessToken) throw error || new Error('Refresh failed');

                // Update access token cookie
            // Update access token cookie
                const accessCookie = useCookie('rty_access_token', {
                    maxAge: 10 * 60, // 10 minutes
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    path: '/'
                });
                accessCookie.value = data.accessToken;

                return true;
            } catch (error) {
                console.log('Refresh failed:', error);
                this.clearAuth();
                return false;
            } finally {
                this.isRefreshing = false;
            }
        },

        async isAuthenticated() {
            try {
                const accessToken = useCookie('rty_access_token').value;

                // Immediate return if no token
                if (!accessToken) {
                    console.debug('[AUTH] No access token');
                    return false;
                }

                // Decode token to check expiration
                const decoded = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;
                const bufferTime = 300; // 5 minute buffer (reduced from 10)

                // Token is still valid
                if (decoded.exp > currentTime + bufferTime) {
                    return true;
                }

                // Token needs refresh
                console.debug('[AUTH] Token needs refresh');
                return await this.refreshToken();

            } catch (error) {
                console.log('[AUTH] Authentication check failed:', error);
                return false;
            }
        },

        async checkAuth() {
            const accessToken = useCookie('rty_access_token').value;
            const refreshToken = useCookie('rty_refresh_token').value;
            console.log('Access ---Check auth:', useCookie('rty_access_token').value);
            console.log('Refresh:', useCookie('rty_refresh_token').value);

            if (!accessToken) return false;

            try {
                const decoded = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;
                const bufferTime = 1200; // 10 minute buffer (1200 seconds)

                // 2. Check if token is expired or near expiration
                if (decoded.exp < currentTime + bufferTime) {
                    console.log('[AUTH] Token expired or near expiration (10 minute buffer), attempting refresh...');
                    if (refreshToken) {
                        return await this.refreshToken();
                    }
                    return false;
                }

                // 3. Verify with backend (only if not in SSR)
                if (process.client) {
                    const { data, error } = await useHttp('/api/auth/verify_token', {
                        method: 'POST',
                        data: { accessToken: accessToken },
                        credentials: 'include', // This is crucial
                    });
                    this.isAuthenticated = data

                    if (error) {
                        console.log('[AUTH] Backend verification failed-----------------------------------:', error);
                        if (error.status === 401 && refreshToken) {
                            return await this.refreshToken();
                        }
                        return false;
                    }

                    // Update user data if returned
                    if (data?.user) {
                        this.user = data.user;
                    }
                }

                return true;
            } catch (error) {
                console.log('[AUTH] Check auth failed:', error);
                return false;
            }
        },

        async scheduleRefresh(expiresIn) {
            const REFRESH_THRESHOLD = 60000; // 1 minute before expiry

            const refreshTime = expiresIn * 1000 - REFRESH_THRESHOLD;

            if (refreshTime > 0) {
                setTimeout(async () => {
                    try {
                        const { data } = await useHttp('/api/auth/refresh', {
                            method:"POST",
                            credentials: true
                        });
                        setTokens(data);
                        scheduleRefresh(data.expiresIn);
                    } catch (error) {
                        console.log('Silent refresh failed', error);
                    }
                }, refreshTime);
            }
        },

        async silentCheck() {
            // Wait for hydration
            if (!this._hydrated) await this.hydrate()

            const tokenCookie = useCookie('rty_access_token')
            const token = tokenCookie.value

            // No token in cookie
            if (!token) return false

            try {
                const decoded = jwtDecode(token)

                console.log("Decode access store in store ----------------> ", decoded)

                const isExpired = decoded.exp < Date.now() / 1000
                console.log("Is expired in store ----------------> ", isExpired)

                if (isExpired) {
                    const refreshed = await this.refreshToken()
                    if (!refreshed) return false
                }

                // Optional: Verify with backend (useful if token revocation/blacklist is implemented)
                const { data, error } = await useHttp('/api/auth/verify_token', {
                    method: 'POST'
                })
                console.log( "Refresh Token data      ----------", data)

                return !error
            } catch (err) {
                console.log('Silent check failed:', err)
                return false
            }
        },

        async checkSession() {
            try {
                console.log('Refreshing with token   ========  lll:', this.refreshToken);
                const res = await this.refreshToken();
                console.log('New access token ====================lllllllllk:', res);
            } catch (err) {
                console.log('Failed to refresh token:', err);
            }
        },

        setAuthCookies(data) {
            console.log("Set Auth Cookies Data:", data); // Log the data
            console.log("Set Auth Cookies Data access token from backend :", data.accessToken); // Log the data
            const accessCookie = () => ({
                maxAge: 60 * 60 * 24 * 7, // 1 week
                secure: process.env.NODE_ENV !== 'development', // false in dev
                sameSite: 'lax', // Changed from strict
                path: '/', // Critical for cross-route persistence
                httpOnly: false, // Needed for client-side access
                domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.yourdomain.com'
            });
            accessCookie.value = data.accessToken;
        },

        // SSR Compatibility:
        // In your auth store
        async init() {
            if (process.server) return

            await this.hydrate()
            await this.checkAuthState()
        },


        setAccessToken(token) {
            this.accessToken = token;
            this.isAuthenticated = !!token;
            useCookie('rty_access_token').value = token;
        },

        // setRefreshToken(token) {
        //     this.refreshToken = token;
        //     useCookie('rty_refresh_token').value = token;
        // },
        setTokens(access, refresh, expiresIn) {
            this.accessToken = access
            this.refreshToken = refresh
            this.refreshTokenExpiry = new Date(Date.now() + expiresIn * 1000)
        },

        clearTokens() {
            this.accessToken = null
            this.refreshToken = null
            this.refreshTokenExpiry = null
        },

        async logout() {
            try {
                // 1. Send logout request to server
                const { data } = await useHttp('/api/auth/logout', {
                    method: 'POST',
                    data: { token: this.rty_access_token },
                });

                console.log("Logout success =================> ", data);

                // 2. Clear client-side authentication state
                this.clearAuthState();

                // 3. Clear cookies properly
                this.clearAuthCookies();

                // 4. Navigate to login page
                await this.redirectToLogin();
                this.isAuthenticate = false
                // Redirect to login

                if (process.client) {
                    navigateTo('/auths/login', { replace: true });
                }
                // if (process.client) {
                //     localStorage.removeItem('auth_data')
                // }
            } catch (error) {
                console.log('Logout error:', error);
                // 5. Fallback cleanup and redirect
                this.fallbackLogout();
            }
        },

        async redirectToLogin() {
            try {
                await navigateTo('/auths/login');
            } catch (navigationError) {
                console.warn('Navigation error, using fallback:', navigationError);
                window.location.href = '/auths/login';
            }
        },

        // Decode token (if needed)
        decodeToken(token) {
            if (!token) return null;
            try {
                return jwtDecode(token); // Decode the token
            } catch (error) {
                console.log('Error decoding token:', error);
                return null;
            }
        },

        async hydrate() {
            if (process.client) {
                this.rty_access_token = useCookie('rty_access_token').value
                this.rty_refresh_token = useCookie('rty_refresh_token').value
                this._hydrated = true
            }
        },

        // Helper methods for better organization
        clearAuthState() {
            // Clear in-memory auth state
            this.user = null;
            this.permissions = [];
            this.lastRefresh = null;
            this.rty_auth_token = null;


            // Clear logout timer if it exists
            if (this.logoutTimer) {
                clearTimeout(this.logoutTimer);
                this.logoutTimer = null;
            }
        },

        clearAuthCookies() {
            // Standard cookie names (adjust as needed)

            const accessCookie = useCookie('rty_access_token');
            const refreshCookie = useCookie('rty_refresh_token');

            accessCookie.value = null;
            refreshCookie.value = null;
            this.user = null;


            // After clearing, go to homepage
            useCookie('i18n_redirected').value = null

            // After clearing, go to homepage  ///add
            if (process.client) {
                navigateTo('/')
            }
        },

        fallbackLogout() {
            // Comprehensive fallback cleanup
            this.clearAuthState();
            this.clearAuthCookies();

            // Force hard redirect as last resort
            window.location.href = '/auths/login';
        },

        // Add this method to check multiple permissions
        hasAnyPermission(requiredPermissions) {
            if (!requiredPermissions || requiredPermissions.length === 0) return true;
            return requiredPermissions.some(perm => this.permissions.includes(perm));
        },

        async loadFromCookies() {
            const authTokenCookie = useCookie('rty_auth_token');
            const accessTokenCookie = useCookie('rty_access_token');
            const refreshTokenCookie = useCookie('rty_refresh_token');

            this.rty_auth_token = authTokenCookie.value;
            this.rty_access_token = accessTokenCookie.value;
            this.rty_refresh_token = refreshTokenCookie.value;

            if (this.rty_access_token) {
                this.isAuthenticate = true;
            }
        },

        clearAuth() {
            // Clear state
            this.rty_auth_token = null;
            this.rty_access_token = null;
            this.rty_refresh_token = null;
            this.user = null;
            this.permissions = [];
            this.isAuthenticate = false;
            this.lastRefresh = null;

            // Clear cookies
            const cookieOptions = {
                maxAge: -1,
                expires: new Date(0),
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            };

            useCookie('rty_auth_token', cookieOptions).value = null;
            useCookie('rty_access_token', cookieOptions).value = null;
            useCookie('rty_refresh_token', cookieOptions).value = null;

            // Clear any timers
            if (this.logoutTimer) {
                clearTimeout(this.logoutTimer);
                this.logoutTimer = null;
            }
        },

        setupTokenRefresh(expiresIn) {
            // Refresh token 5 minutes before expiry
            const refreshTime = (expiresIn - 300) * 1000;

            if (this.logoutTimer) {
                clearTimeout(this.logoutTimer);
            }

            this.logoutTimer = setTimeout(async () => {
                await this.refreshToken();
            }, refreshTime);
        },

        async verifyToken(token) {
            try {
                const { data, error } = await useHttp('/api/auth/verify_token', {
                    method: 'POST',
                    data: { accessToken: token }
                });

                console.log("Error Token:", error);
                console.log("Verify Token:", data);

                if (!data?.user) {
                    throw new Error('Invalid token');
                }

                console.log('Token verification response:', { data, error });

                if (error || !data?.user) {
                    const errMessage = error?.message || 'Invalid token response';
                    console.log('Token verification failed:', errMessage);
                    throw new Error(errMessage);
                }

                // Set authentication state
                this.rty_auth_token = token;
                this.user = data.user;
                this.lastRefresh = new Date().toISOString();

                // Save cookie


                console.debug('Token verified successfully for user:', data.user.id);

            } catch (error) {
                console.log('Token verification failed:', error);
                this.user = null;
                this.rty_auth_token = null;
                this.lastRefresh = null;

                // Clear cookie
                authCookie.value = null;
                authCookie.options.maxAge = -1;
                this.clearAuthState();
                // Logout and throw
                await this.logout();
                throw error;
            }
        },

        //   function onLoginSuccess() {
        //     // Retrieve the saved redirect path from localStorage
        //     const redirectPath = localStorage.getItem('redirectPath') || '/';

        //     // Redirect to the path that was stored (or default to the homepage)
        //     router.push(redirectPath);



        // Start auto-logout timer
        startAutoLogoutTimer() {
            if (!this.rty_auth_token) return;

            // Decode the token to get the expiration time
            const decodedToken = jwtDecode(this.rty_auth_token);
            const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();

            // Calculate the remaining time until the token expires
            const timeUntilExpiration = expirationTime - currentTime;

            if (timeUntilExpiration > 0) {
                // Set a timer to log out the user when the token expires
                this.logoutTimer = setTimeout(() => {
                    this.logout(); // Log out the user
                }, timeUntilExpiration);
            } else {
                // If the token is already expired, log out immediately
                this.logout();
            }
        },

        setUser(userData) {
            console.log('Setting User Data:', userData);
            this.user = userData;
            console.log("888888888888 Set user : ", this.user)
        },

        loadFromStorage() {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                this.rty_auth_token = savedToken;
                this.user = JSON.parse(savedUser);

                // ✅ Just use the getter without assigning to it
                console.log('Is Authenticated?-------------================', this.isAuthenticate);

                console.log('User data loaded from localStorage:', this.user);
            } else {
                console.log('No saved user data found in localStorage.');
            }
        }

        // hasRole(requiredRole) {
        //     return this.user?.role === requiredRole;
        // },
    }
});

function setTokens(data) {
    console.log("Set Token ==============", data);

    // ✅ Only set the access token (short-lived, client-side)
    const accessCookie = useCookie('rty_access_token', {
        path: '/',
        maxAge: 60 * 5, // 5 minutes
        // secure: process.env.NODE_ENV === 'production' ,  // or true
        // sameSite: 'Strict',
        sameSite: 'lax'
        // secure: true, // ❗only in production over HTTPS
    });

    accessCookie.value = data.accessToken;

    // ❌ Do NOT set the refresh token here
    // It's already securely stored as an HttpOnly cookie by the backend (e.g., in login response)

    // Optional: store in memory or Pinia if needed
    // this.rty_access_token = data.accessToken;
}
// useCookie('rty_access_token', {
//     path: '/',
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: false, // Only if you need access client-side (for SPA)
//   });

// <script setup>
// const auth = useAuthStore();

// // ❌ WRONG - Trying to modify a getter
// auth.isAuthenticate = true;

// // ✅ CORRECT - Use actions to modify state
// auth.login(credentials);
// </script>



// 'set' on proxy: trap returned falsish for property 'isAuthenticate'
// It definitely means you're doing something like this in your app:

// ts
// Copy
// Edit
// authStore.isAuthenticate = false // ❌ Wrong! This will throw the proxy error.
// Because isAuthenticate is read-only.


// SSR Considerations:

// Use useCookie() consistently (don't mix with document.cookie)

// Ensure cookies are passed in API calls between client/server


// Nuxt cannot set a cookie with httpOnly: true from the client-side.
// → So it simply does nothing, and the token is not stored.
// but should set in backend api

// Make sure it’s:

// httpOnly: true ✅

// sameSite is compatible with your frontend setup.

// secure is only true in production (or disabled for localhost).

