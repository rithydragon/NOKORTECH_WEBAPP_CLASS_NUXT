
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig(); // Get the API URL from runtime config

  // Create a custom fetch function with the base URL
  const customFetch = async (url, options = {}) => {
    const response = await fetch(`${config.apiUrl}${url}`, {
      ...options,
    });
    return response.json(); // Assuming JSON response, customize as needed
  };

  // Inject custom fetch into the app context
  nuxtApp.provide('fetch', customFetch);
});
