
export const useConfirm = () => {
    const confirmStore = useConfirmStore()
  
    const confirm = (options: {
      title?: string
      description?: string
      confirmText?: string
      cancelText?: string
      onCancel?: () => void
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        confirmStore.open({
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => {
            options.onCancel?.()
            resolve(false)
          }
        })
      })
    }
  
    return { confirm }
  }