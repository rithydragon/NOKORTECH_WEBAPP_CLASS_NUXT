import { ref } from 'vue';

export const useImageCrop = () => {
  const showCropper = ref(false);
  const imageToCrop = ref('');
  const croppedImage = ref<File | null>(null);

  const openCropper = (imageSrc: string) => {
    imageToCrop.value = imageSrc;
    showCropper.value = true;
  };

  const closeCropper = () => {
    showCropper.value = false;
    imageToCrop.value = '';
  };

  const handleCropped = (file: File) => {
    croppedImage.value = file;
    closeCropper();
  };

  return {
    showCropper,
    imageToCrop,
    croppedImage,
    openCropper,
    closeCropper,
    handleCropped
  };
};