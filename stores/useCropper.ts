import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCropperStore = defineStore('cropper', () => {
  const isOpen = ref(false);
  const options = ref({
    width: 500,
    height: 500,
    isRounded: true,
    title: 'Upload image Profile'
  });
  const imageSrc = ref('');
  const resolvePromise = ref<((value: any) => void) | null>(null);
  const rejectPromise = ref<((reason?: any) => void) | null>(null);

  function crop(file: File, cropOptions?: any) {
    return new Promise((resolve, reject) => {
      // Read the file to get src
      const reader = new FileReader();
      reader.onload = (e) => {
        imageSrc.value = e.target?.result as string;
        options.value = { ...options.value, ...cropOptions };
        isOpen.value = true;
        resolvePromise.value = resolve;
        rejectPromise.value = reject;
      };
      reader.readAsDataURL(file);
    });
  }

  async function confirm(result: Blob) {
    if (resolvePromise.value) {
      resolvePromise.value({
        file: result,
        byteArray: await blobToByteArray(result)
      });
    }
    reset();
  }

  function cancel() {
    if (rejectPromise.value) {
      rejectPromise.value(new Error('User cancelled cropping'));
    }
    reset();
  }

  function reset() {
    isOpen.value = false;
    imageSrc.value = '';
    resolvePromise.value = null;
    rejectPromise.value = null;
  }

  async function blobToByteArray(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  return {
    isOpen,
    options,
    imageSrc,
    crop,
    confirm,
    cancel
  };
});