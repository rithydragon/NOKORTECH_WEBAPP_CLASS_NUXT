import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  esbuild: {
    jsxInject: 'import React from "react";',  // Add this if you're using React
    parser: {
      plugins: ['optionalChainingAssign'],
    },
  },
})

// npm update vite vue
