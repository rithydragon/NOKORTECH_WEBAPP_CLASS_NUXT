import { version } from "vue";  // Vue version import
import componentsConfig from "./stores/components.config";  // Your custom component configuration
import getComponentPaths from "./assets/js/getComponentPaths";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',  // Compatibility for future dates
  devtools: { enabled: true },  // Enable Nuxt devtools for development
  ssr: false,
  // Modules to include in your Nuxt project
  modules: [// Nuxt i18n for internationalization (multi-language support)
    '@nuxtjs/i18n', '@nuxt/ui', '@nuxtjs/tailwindcss'],
  // modules: [...moduleList, ...["@nuxtjs/i18n"]],?
  // imports: {
  //   dirs: ["./stores/**"],
  // },
  imports: {
    dirs: ['stores', 'utils'],
  },
  // Development server configuration
  devServer: {
    port: 4582,  // Port for dev server
    host: '0.0.0.0',  // Allow external devices to access the development server
  },

  vite: {
    server: {
      host: '0.0.0.0',
      hmr: {
        clientPort: 4582
      },
      fs: {
        strict: true
      }
    }
  },
  // Nuxt project structure settings
  srcDir: ".",  // Defines the root directory
  dir: {
    app: "app",  // Defines the "app" directory for your components, pages, etc.
  },

  image: {
    // Configure your image provider (e.g., Cloudinary, Local, etc.)
    provider: 'static', // Use 'static' for local images
  },
  // Component configuration
  components: componentsConfig,  // Assuming you've customized component imports
  // components: getComponentPaths(),  // Assuming you've customized component imports

  // Plugins to use in your Nuxt project (if any)
  plugins: ['~/plugins/plugin.js'],

  router: {
    middleware: ['auth'], // Apply auth middleware globally
  },
  // Global CSS files to include in your project
  css: ['./assets/styles/global.scss', './assets/css/tailwind.css'],

  // App-related configurations (page transitions, meta tags, etc.)
  app: {
    rootId: 'nokortech',  // Custom root element ID
    rootTag: 'nokortech-main',  // Custom root element tag
    baseUrl: '/',  // Base URL for routing
    buildAssetsDir: '_nokortech',  // Directory for build assets
    pageTransition: { name: 'page', mode: 'out-in' },  // Page transition animation
    layoutTransition: { name: 'layout', mode: 'out-in' },  // Layout transition animation
    head: {
      title: 'NOKORTECH LMS',  // Default title for your app
      htmlAttrs: {
        lang: 'en',  // Language attribute for the HTML element
      },
      bodyAttrs: {
        class: 'nokortech-com-body',  // Custom class for body element
      },
      meta: [
        { charset: 'utf-8' },  // Character encoding
        { name: 'viewport', content: 'width=device-width' },  // Viewport meta tag
        { hid: 'description', name: 'description', content: 'Dashboard - is a lightweight, minimal, fast loading front-end dashboard theme. It is built with Vue.js and Nuxt.js.' },  // Meta description
      ],
      link: [
        { rel: 'icon', href: '/NOKORTECH-LOGO.png', type: 'image/png', sizes: '32x32' },  // Favicon
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.css' },  // Remix icons
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/heroicons@2.2.0/+esm' },  // Hero icons
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },  // Preconnect to Google Fonts
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },  // Preconnect to Google Fonts (needed for secure loading)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Moul&display=swap' },  // Preconnect to Google Fonts (needed for secure loading)
        { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Siemreap&display=swap" },  // Preconnect to Google Fonts (needed for secure loading)
      ],
      script: [
        { src: `https://code.jquery.com/jquery-3.7.1.min.js` },
        {
          src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHSFxjmOZavhWhhNDP4CXWLEi_bxvx0Rs`,
        },
        {
          src: "https://cdn.jsdelivr.net/npm/@easylogic/colorpicker@1.10.5/dist/colorpicker.min.js",
          defer: true,
        },
        // { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-treetable/3.2.0/jquery.treetable.min.js' },
        // { src: 'https://cdn.jsdelivr.net/npm/jquery-treetable@3.2.0/jquery.treetable.js' },
      ],
    }
  },

  // i18n (Internationalization) Configuration
  locale: 'en',  // Default language for your app
  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'km', name: 'Khmer', iso: 'km-KH', file: 'km.json', img: "/lang/cambodia_flag.svg", },
    ],
    lazy: true,  // Lazy load language files
    langDir: 'lang/',  // Directory where language files are stored
    defaultLocale: 'en',  // Set default locale to English
    strategy: 'no_prefix',  // Use no prefix strategy for the language routes
    // strategy: 'prefix_except_default', // or prefix_and_default
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  // vueI18n: {
  //   compilerOptions: {
  //     isCustomElement: (tag) => ['b', 'i', 'strong'].includes(tag)
  //   }
  // vite: {
  //   server: {
  //     fs: {
  //       strict: true
  //     }
  //   }
  // },
  // nitro: {
  //   devProxy: {
  //     '/api': {
  //       target: process.env.API_BASE_URL || 'http://localhost:5000/api',
  //       changeOrigin: true,
  //       cookieDomainRewrite: 'localhost'
  //     }
  //   }
  // },
  // },
  // vite: {
  //   esbuild: {
  //     drop: ["console", "debugger"],
  //   },
  //   server: {
  //     fs: {
  //       strict: true
  //     }
  //   },
  //   resolve: {
  //     alias: {
  //       "@": "/src",  // Alias for the src directory
  //       "~": "/src",  // Alias for the src directory (same as above)
  //     },
  //   },
  //   css: {
  //     preprocessorOptions: {
  //       scss: {
  //         // additionalData: '@use "@/assets/styles/_vars.scss" as *;',
  //       },
  //     },
  //   },
  //   optimizeDeps: {
  //     exclude: ["#import"], // Exclude this module from Vite's optimization process
  //   },
  // },
  // nitro: {
  //   routeRules: {
  //     "/img/*.m4a": { headers: { "Content-Type": "audio/mp4" } },
  //   },
  // },
  // If using Nitro server
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://your-production-domain.com'
        }
      }
    }
  },
  // axios: {
  //   baseURL: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:65532', // Default base URL
  // },

  // Runtime configuration
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'NOKOR TECH',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiBase: process.env.API_BASE_URL || 'http://localhost:65532',  // API base URL
      version: version,  // Vue version dynamically injected
      dateFormat: 'MMM dd, YYYY',  // Date format
      timeFormat: 'hh:mm:ss aa',  // Time format
    },
  },
  // Optional: if you want auto-imports

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: 'tailwind.config',  // Path to your Tailwind CSS configuration file
    exposeConfig: {
      level: 2,  // Level of exposure of Tailwind config (2 is more customizable)
    },
    viewer: true,  // Enable the Tailwind CSS viewer (useful for debugging)
  },

  // Color Mode 

  colorMode: {
    preference: 'light',  // Default color mode (light/dark)
    fallback: 'light',  // Fallback color mode if no preference is detected
  },
})