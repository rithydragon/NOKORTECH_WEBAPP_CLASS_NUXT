
module.exports = {
    darkMode: 'class',
    content: [
        './node_modules/@nuxt/ui/**/*.{js,ts,vue}', // Include Nuxt UI components
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.{js,ts,vue}",
        "./pages/**/*.{js,ts,vue}",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
        './nuxt.config.{js,ts}',
        "./node_modules/flowbite/**/*.{js,ts}",
    ],
    theme: {
        screens: {
            xs: "614px",
            sm: "1002px",
            md: "1022px",
            lg: "1092px",
            xl: "1280px",
        },
        fontSize: {
            'xxs': '0.625rem', // Custom small size
            'xl': '1rem',
            'xxl': '0.75rem',
            '5xl': '5.5rem',   // Custom large size
            'icon-sm': '0.95rem',
            'icon-md': '1rem',
            'icon-lg': '1.25rem',
            'icon-xl': '1.5rem',
            'icon-2xl': '1.7rem',
            'icon-standard': '0.97rem',
            'normal': '0.82rem'
        },
        extend: {
            colors: {
                //Color Object
                agridev: {
                    50: "#5F99F7",
                    100: "#FFFFFF", //RGB(255,255,255)  //white
                    110: "#f5f5f5", // Neotral 1000 for back  //white
                    150: "#008a0bfa",  //RGB(255,255,255)  //white
                    200: "#38444d",
                    300: "#202e3a",
                    400: "#253341",
                    500: "#5F99F7",
                    550: "#3b0764", //purple 950
                    560: "#5b21b6", //Violet 800
                    570: "#d8b4fe", //purple 500
                    600: "#5F99F7",
                    700: "#192734",
                    800: "#162d40",
                    900: "#15202b",  //black
                    1000: "#000000", //RGB(0,0,0) //Black 
                    1100: "#1a202c",
                    1200: "#F6F9F8", //white
                    1300: "#5F99F7", //RGB(246,249,248)  //white
                    1400: "#008a0bfa", //rgba(0,138,11,0.98)
                    1600: "#f6f6f6", //rgba(0,138,11,0.98)
                    1700: "#fcfcfc", //rgba(0,138,11,0.98)
                    1900: "#593bff", //blue 
                    1950: "#f0f0ff", //blue 
                    2000: "#4a044e", //Fuchsia 950
                    2100: ""
                },
                agridev_background: {
                    default: "#0f172a", //slate 900
                },
                // agridev_bg : {
                //   light: '#67e8f9',
                //   // DEFAULT: '#0f172a',
                //   dark: '#0e7490',
                // },
                // transparent: 'transparent',
                // current: 'currentColor',
                // 'white': '#ffffff',
            },
        },
        plugins: [
            require('@tailwindcss/forms'),
        ],
    }
}