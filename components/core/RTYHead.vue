<!-- components/common/RTYHead.vue -->
<script setup>
import { computed, useRuntimeConfig, useRoute } from '#imports'

const props = defineProps({
  title: String,
  description: {
    type: String,
    default: ''
  },
  keywords: {
    type: Array,
    default: () => []
  },
  image: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'website'
  },
  noIndex: {
    type: Boolean,
    default: false
  },
  canonicalUrl: {
    type: String,
    default: ''
  },
  meta: {
    type: Array,
    default: () => []
  },
  link: {
    type: Array,
    default: () => []
  },
  script: {
    type: Array,
    default: () => []
  }
})

const config = useRuntimeConfig() // Don't destructure here
const route = useRoute()

// Correct way to access public runtime config
const defaultTitle = config.public?.appName || 'NokorTech'
const defaultDescription = 'A modern web application'
const defaultImage = '/social-preview.png'
const defaultUrl = config.public?.baseUrl || 'https://example.com'
// Get meta from route or use defaults
const pageMeta = computed(() => route.meta || {})
// const pageTitle = computed(() => pageMeta.value.pageTitle || config.public.appName || 'My App')
const pageIcon = computed(() => pageMeta.value.pageIcon || '/images/NOKORTECH-LOGO.png')

// Computed meta tags
const pageTitle = computed(() =>  props.title ? `${props.title} || ${defaultTitle}` : defaultTitle ||pageMeta.value.pageTitle || config.public.appName || 'My App'


)

// useHead({
//   title: props.title ? `${props.title} | ${config.appName}` : config.appName
// })

const pageDescription = computed(() => props.description || defaultDescription)
const pageImage = computed(() => props.image || defaultImage)
const pageUrl = computed(() => props.url || `${defaultUrl}${route.path}`)
const pageKeywords = computed(() => props.keywords.join(', '))

useHead({
//   title: props.title ? `${props.title} | ${config.appName}` : config.appName,

  title: pageTitle,
  meta: [
    // Basic meta
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: pageKeywords },
    
    // Open Graph / Facebook
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: pageImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: props.type },
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage },
    
    // Robots
    { name: 'robots', content: props.noIndex ? 'noindex, nofollow' : 'index, follow' },
    
    // Additional meta from props
    ...props.meta
  ],
//   link: [
//     { rel: 'icon', href: pageIcon }
//   ],
  link: [
    // Canonical URL
    props.canonicalUrl 
      ? { rel: 'canonical', href: props.canonicalUrl }
      : { rel: 'canonical', href: pageUrl } ? { rel: 'icon', href: pageIcon } : '',
    
    // Additional links from props
    ...props.link
  ],
    // JSON-LD structured data
    script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: pageTitle.value,  // Fixed: using .value
        description: pageDescription.value,  // Fixed: using .value
        url: pageUrl.value  // Fixed: using .value
      })
    },

    // Additional scripts from props
    ...props.script
  ]
})

watch(pageTitle, (newVal) => {
  document.title = newVal
}, { immediate: true })


// In RTYHead component
onMounted(() => {
  console.log('RTYHead mounted', {
    title: pageTitle.value,
    description: pageDescription.value
  })
})

// Optional: Watch for changes if you have dynamic routes
watch(pageMeta, (newVal) => {
  document.title = newVal.pageTitle || config.public.appName || 'My App'
}, { immediate: true })

</script>

<template>
  <!-- This component doesn't render anything, it just manages head tags -->
</template>


<!-- pages/index.vue -->
<!-- <script setup>
definePageMeta({
  pageTitle: 'Home Dashboard',
  pageIcon: '/home-icon.ico'
})
</script>

<template>
  <RTYHead />
</template> -->