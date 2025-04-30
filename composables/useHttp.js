// // composables/useHttp.js
// export default async function useHttp(endpoint, options = {}) {
//     const { method = 'GET', data = {}, headers = {}, filters = {} } = options;
  
//     try {
//       const { $axios } = useNuxtApp();
//       const baseURL = useRuntimeConfig().public.apiBase;
  
//       // Get token from cookies
//       const token = useCookie('auth_token').value || '';
  
//       // Default headers, including Authorization token
//       const defaultHeaders = {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...headers,
//       };
  
//       // API Request Setup
//       const requestConfig = {
//         url: `${baseURL}${endpoint}`,
//         method,
//         headers: defaultHeaders,
//       };
  
//       // Attach data payload if not a GET request
//       if (method !== 'GET') {
//         requestConfig.data = data;
//       }
  
//       // Perform API request
//       const response = await $axios(requestConfig);
//       let resultData = response.data;
  
//       // Apply local filtering if necessary
//       if (Object.keys(filters).length > 0) {
//         resultData = resultData.filter((item) =>
//           Object.entries(filters).every(([key, value]) =>
//             item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase())
//           )
//         );
//       }
  
//       return { data: resultData, error: null };
  
//     } catch (error) {
//       console.log('API Request failed:', error);
  
//       // Handle unauthorized (401) errors
//       if (error.response?.status === 401) {
//         console.warn('Unauthorized access. Please login again.');
//         // Optionally, remove the token from cookies and redirect to login
//         useCookie('auth_token').value = null;
//         navigateTo('/login');
//       }
  
//       return { data: null, error: error.message || 'Unknown error occurred' };
//     }
//   }
import axios  from "axios";

export async function useHttp(endpoint, { method = 'GET', data = {}, headers = {}, filters = {} } = {}) {
    try {
      const { $axios, $config } = useNuxtApp();
      const baseURL = $config.public.apiBase || 'http://localhost:5643';
  
      // Get token from cookies
      const token = useCookie('auth_token')?.value || '';
  
      // Default headers, including Authorization token
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      };
  
      // API Request Setup
      const requestConfig = {
        url: `${baseURL}${endpoint}`,
        method,
        headers: defaultHeaders,
      };
  
      // Attach data payload if not a GET request
      if (method !== 'GET') {
        requestConfig.data = data;
      }
  
      // Perform API request
      const response = await axios(requestConfig);
      let resultData = response.data;
  
      // Apply local filtering if necessary
      if (Object.keys(filters).length > 0) {
        resultData = resultData.filter(item =>
          Object.entries(filters).every(([key, value]) =>
            item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        );
      }
  
      return Promise.resolve({ data: resultData, error: null });
  
    } catch (error) {
      console.log('API Request failed:', error);
  
      // Handle unauthorized (401) errors
      if (error.response?.status === 401) {
        console.warn('Unauthorized access. Please login again.');
        // Optionally, you can remove the token from cookies and redirect to login
      }
  
      return Promise.resolve({ data: null, error: error.message || 'Unknown error occurred' });
    }
  }