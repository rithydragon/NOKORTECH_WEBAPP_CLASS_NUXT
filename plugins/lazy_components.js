// plugins/lazy-components.js
import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'

const sanitizeComponentName = (name) => {
  // Removes spaces and special characters
  return name.replace(/[^a-zA-Z0-9_]/g, '')
}

export default defineNuxtPlugin(nuxtApp => {
  const registeredComponents = new Set()

  // Utility function to register components
  const registerComponent = (path, component) => {
    const componentName = sanitizeComponentName(path.split('/').pop().replace('.vue', ''))
    if (!registeredComponents.has(componentName)) {
      nuxtApp.vueApp.component(componentName, defineAsyncComponent(component))
      registeredComponents.add(componentName)
    }
  }

  // Dynamically import and register components lazily
  const coreComponents = import.meta.glob('~/components/core/*.vue')
  for (const [path, component] of Object.entries(coreComponents)) {
    registerComponent(path, component)
  }

  const uiComponents = import.meta.glob('~/components/ui/*.vue')
  for (const [path, component] of Object.entries(uiComponents)) {
    registerComponent(path, component)
  }

  const allComponents = import.meta.glob('~/components/*.vue')
  for (const [path, component] of Object.entries(allComponents)) {
    registerComponent(path, component)
  }

  const uiTableComponents = import.meta.glob('~/components/ui/table*.vue')
  for (const [path, component] of Object.entries(uiTableComponents)) {
    registerComponent(path, component)
  }
})
