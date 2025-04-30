/**
 * Generate localized path
 * @param {string} path - Route path without locale prefix
 * @param {Object} options - Configuration options
 * @param {string} [options.locale] - Target locale (defaults to current locale)
 * @param {Object} options.i18n - Vue I18n instance
 * @param {Object} options.nuxtApp - Nuxt app instance
 * @returns {string} Localized path string
 */
export const createLocalePath = (path, { locale, i18n, nuxtApp }) => {
    // Get target locale (provided or current)
    const targetLocale = locale || i18n.global.locale.value
    
    // Skip processing for absolute paths and URLs
    if (path.startsWith('http') || path.startsWith('/')) {
      return path
    }
    
    // Check if we should skip locale prefix for default locale
    const isDefaultLocale = targetLocale === i18n.global.fallbackLocale.value
    const prefixDisabled = !(nuxtApp.$i18n || {}).routing?.strategy?.prefixExceptDefault
    
    if (isDefaultLocale && prefixDisabled) {
      return `/${path}`
    }
    
    // Return localized path with prefix
    return `/${targetLocale}/${path}`
  }