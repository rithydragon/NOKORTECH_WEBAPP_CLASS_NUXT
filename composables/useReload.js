// export const useReload = () => {
//     const router = useRouter()
    
//     router.beforeEach((to, from, next) => {
//       if (process.client && to.path !== from.path) {
//         window.location.href = to.fullPath
//         return
//       }
//       next()
//     })
//   }

// composables/useForceReload.js
// export const useReload = (options = {}) => {
//   const router = useRouter()
//   const { delay = 50 } = options

//   router.beforeEach((to, from, next) => {
//     // Only run on client side and for actual route changes
//     if (process.client && to.path !== from.path) {
//       setTimeout(() => {
//         window.location.href = to.fullPath
//       }, delay)
//       return // Cancel the navigation
//     }
//     next()
//   })
// }

// composables/useReload.js
export const useReload = (delay = 50) => {
  if (process.client) {
    const router = useRouter()
    
    router.beforeEach((to, from) => {
      if (to.path !== from.path) {
        setTimeout(() => {
          window.location.href = to.fullPath
        }, delay)
        return false // Cancel the navigation
      }
    })
  }
}