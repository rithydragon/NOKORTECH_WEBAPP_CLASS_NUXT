<template>
  <NuxtLoadingIndicator color="gold" />
  <NuxtLayout  :transition="{ name: 'page', mode: 'out-in' }">
    <div :class="{ darkMode }">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <Toast />
  <RTYConfirm />
  <GlobalLoader ref="loader" />
  <UNotifications :ui="{ wrapper: 'z-[1000]' }" />
  <InternetNetworkStatus />
</template>

<script setup>
import { ref, watchEffect, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const darkMode = ref(true) // Default dark mode

const isLoading = ref(false)

// Watch for language change and trigger loading and page reload
// watch(locale, (newLocale, oldLocale) => {
//   if (newLocale !== oldLocale) {
//     isLoading.value = true
//     // Simulate loading time for demonstration
//     setTimeout(() => {
//       // Reload the page
//       window.location.reload()
//     }, 1000) // Adjust the time as per your needs
//     isLoading.value = false
//   }
// })

// Watch for language change and update the body class
watchEffect(() => {
  nextTick(() => {
    const body = document.body

    // Remove any existing font classes
    body.classList.remove('en-font', 'km-font')

    // Add the appropriate class based on the current language
    if (locale.value === 'km') {
      body.classList.add('km-font')  // Add Khmer font class
    } else {
      body.classList.add('en-font')  // Add English font class
    }
  })
})

</script>

<style scoped></style>
