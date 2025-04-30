// // utils/cookies.js
// export const getCookie = (name) => {
//   if (process.client) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//   }
//   return undefined;
// };

// export const deleteCookie = (name) => {
//   if (process.client) {
//     document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
//   }
// };

// export const setCookie = (name, value, days = 7) => {
//   if (process.client) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     document.cookie = `${name}=${value}; Path=/; Expires=${date.toUTCString()}; SameSite=Lax`;
//   }
// };

// utils/cookies.js

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|undefined} Cookie value or undefined if not found
 */
export const getCookie = (name) => {
  if (process.client) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  return undefined;
};

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name to delete
 * @param {string} [path='/'] - Path for which the cookie is valid
 */
export const deleteCookie = (name, path = '/') => {
  if (process.client) {
    document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
};

// Alias deleteCookie as clearCookie for backward compatibility
export const clearCookie = deleteCookie;

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} [days=7] - Days until expiration
 * @param {string} [path='/'] - Path for which the cookie is valid
 * @param {boolean} [secure=false] - Set secure flag
 * @param {string} [sameSite='Lax'] - SameSite attribute
 */
export const setCookie = (name, value, days = 7, path = '/', secure = false, sameSite = 'Lax') => {
  if (process.client) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const secureFlag = secure ? '; Secure' : '';
    document.cookie = `${name}=${value}; Path=${path}; Expires=${date.toUTCString()}; SameSite=${sameSite}${secureFlag}`;
  }
};