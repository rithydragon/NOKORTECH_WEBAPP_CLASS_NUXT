// plugins/tBy.js

export default defineNuxtPlugin((nuxtApp) => {
    // Global function to retrieve language-specific content
    const tBy = (text) => {
      const { locale } = useI18n(); // Access the current locale (language)
  
      // Logic to return content based on the current language
      if (locale.value === 'km') {
        // Return Khmer text if available, else fallback to English
        return text.km || text.en;
      } else {
        // Default to English if locale is not Khmer
        return text.en || text.km; // Fallback to Khmer if no English provided
      }
    };
  
    // Make the `tBy` function available globally through Vue's `globalProperties`
    nuxtApp.vueApp.config.globalProperties.tBy = tBy;
  });
  