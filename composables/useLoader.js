export const useLoader = () => {
    const loader = inject('loader')
    
    const startLoading = (message = 'Loading...') => {
      loader?.value?.start(message)
    }
    
    const finishLoading = () => {
      loader?.value?.finish()
    }
    
    return {
      startLoading,
      finishLoading
    }
  }