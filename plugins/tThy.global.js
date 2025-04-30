export default defineNuxtPlugin(() => {
  // Define the tTy function globally
  globalThis.tThy = ({ km, en }) => {
    // Access the reactive locale state
    const currentLocale = useState('currentLocale').value || 'en'; // Default to English
    return currentLocale === 'km' ? km : en;
  };
});
