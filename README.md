
# Setup
```bash
# Setup first
npx nuxi@latest init <project-name>
npx nuxi@latest init  NOKORTECH_LMS_WEBAPP_NUXT
# 

```
npm i --save-dev @types/node

# Library
```bash
# Nuxt UI
npx nuxi@latest module add ui
npm install pinia
npm install @headlessui/vue
npm install crypto-js
# Chart
npm install chart.js
npm install universal-cookie
# or
yarn add universal-cookie
```
npm install crypto-js
npm install compressorjs //image compressor
# Packages &Modules
```bash

# language switch package 
npm install @nuxtjs/i18n --save
npm install vue-i18n
npm install axios js-cookie
# Icon
npm install remixicon --save
npm install browser-sync --save

# Sass language style
npm install --save-dev sass sass-loader

# Install Font
npx nuxi@latest module add google-fonts

# API
npm install axios
npm install pinia cookie-universal-nuxt jwt-decode
# Pinia: State management.
# cookie-universal-nuxt: Store authentication tokens.
# jwt-decode: Decode JWT tokens to get user roles.

npm install tailwindcss @tailwindcss/vite

# Cookies
npm install js-cookie --save

# Vue Route
npm install vue-router

# Content
npm install @nuxt/content

npm install  vue-final-modal @vueuse/core image-compression
npm install @headlessui/vue
```
npm install @nuxt/image
<!-- npm install tailwindcss@latest @tailwindcss/postcss7-compat autoprefixer@latest -->

npm install date-fns
npm install -D tailwindcss postcss autoprefixer
npm install vue-cropperjs cropperjs


npm install xlsx file-saver
# Styles
```bash
# Create tailwind.config.js file
npx tailwindcss init

# modules
npm install -D @nuxtjs/tailwindcss
npm install @tailwindcss/forms
npm install -D tailwindcss postcss autoprefixer

# 
node .output/server/index.mjs  //ecosystem.config.cjs



npm install vue3-cropper
npm install vue-cropperjs cropperjs
```


# Upgrade
```bash
# Upgrade Nuxt
npx nuxi@latest upgrade --force

```



## Navigate page
const { queryParams } = useQueryParams()

// Navigate with data
queryParams('/target-page', { 
  userId: 123, 
  token: 'secure-token' 
})

// Alternative syntax
queryParams({
  path: '/dashboard',
  data: { dashboardView: 'analytics' }
})


## Target page
const { queryParams } = useQueryParams()

// Get decrypted data
const param = queryParams().data

console.log(param) // { userId: 123, token: 'secure-token' }

// Use in template
<template>
  <div v-if="param">
    User ID: {{ param.userId }}
    <button @click="navigateWithNewData">Update</button>
  </div>
</template>

<script setup>
const { queryParams } = useQueryParams()

function navigateWithNewData() {
  // You can reuse the same function to navigate
  queryParams('/other-page', { newData: 'value' })
}
</script>


// Example with more options
const compressedFile = await compressImage(file, {
  quality: 0.6,           // Quality level (0-1)
  maxWidth: 1024,         // Maximum width
  maxHeight: 1024,        // Maximum height
  convertSize: Infinity,   // Don't auto-convert to JPEG
  mimeType: 'auto',       // Keep original mime type
  resize: 'cover'         // Resize mode ('cover', 'contain', etc.)
});

const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  setTimeout(() => notification.message = '', 3000)
}

    <!-- Notification -->
    <transition name="fade">
      <div 
        v-if="notification.message"
        class="notification"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </transition>


    // In components or composables
const { notify } = useNotification()

// Success notification
notify('Profile updated successfully!')

// Error notification
notify('Failed to save changes', 'error')

// Warning notification
notify('This action cannot be undone', 'warning')

// Info notification
notify('New messages available', 'info')

## Reload page
recommend from deepseek
```
//Global reload page 
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    window.location.href = to.fullPath
  }
})
to nuxt config
export default defineNuxtConfig({
  router: {
    middleware: ['reload']
  }
})
```