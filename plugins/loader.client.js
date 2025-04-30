export default defineNuxtPlugin((nuxtApp) => {
    const loader = ref(null)
    
    nuxtApp.hook('app:mounted', () => {
      // Get loader instance after app is mounted
      loader.value = nuxtApp.vueApp.config.globalProperties.$loader
    })
  
    // Add loader to global properties
    nuxtApp.vueApp.config.globalProperties.$loader = {
      start: (msg) => loader.value?.start(msg),
      finish: () => loader.value?.finish()
    }
  })