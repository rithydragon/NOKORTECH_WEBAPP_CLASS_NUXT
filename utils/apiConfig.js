// utils/apiConfig.js
export const apiConfig = {
    baseURL: process.env.API_BASE_URL || 'http://localhost:65532', // Fallback to localhost if env variable is not set
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
  };