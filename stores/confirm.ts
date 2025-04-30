import { defineStore } from 'pinia';

export const useConfirmStore = defineStore('confirm', {
  state: () => ({
    isOpen: false,
    title: 'Are you sure?',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info', // 'info' | 'success' | 'warning' | 'error',
    html: false,
    resolvePromise: null,
    onConfirm: () => {},
    onCancel: () => {},
  }),
  actions: {
  //   show(options) {
  //     this.isOpen = true;
  //     this.title = options.title || '';
  //     this.description = options.description || '';
  //     this.confirmText = options.confirmText || 'Confirm';
  //     this.cancelText = options.cancelText || 'Cancel';
  //     this.type = options.type || 'info';
  //     this.html = options.html || false;
      
  //     return new Promise((resolve) => {
  //       this.resolvePromise = resolve;
  //     });
  //   },
  //   confirm() {
  //     this.isOpen = false;
  //     this.resolvePromise(true);
  //   },
  //   cancel() {
  //     this.isOpen = false;
  //     this.resolvePromise(false);
  //   }
  // },

    open(payload: {
      title?: string
      description?: string
      confirmText?: string
      cancelText?: string
      type?: 'info' | 'success' | 'warning' | 'error',
      
      onConfirm: () => void
      onCancel?: () => void
    }) {
      this.$patch({
        isOpen: true,
        type: 'info', // default type
        ...payload
      });
    },
    close() {
      this.$patch({ isOpen: false });
    },
    confirm() {
      this.onConfirm();
      this.close();
    },
    cancel() {
      this.onCancel?.();
      this.close();
    }
  }
});