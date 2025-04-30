// components.config.js
export default [
    // Register core components globally
    {
      path: '~/components/core',
    //   global: true
    },
    // Register UI components globally
    {
        path: '~/components/ui',
        // global: true
      },
      {
        path: '~/components/ui/table',
        // global: true
      },

    // Register all components automatically from the main components directory
    '~/components'
  ]
  