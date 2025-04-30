import { compressImage } from '~/utils/imageCompressor';

export const useImageUpload = () => {
  const validateImage = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Only JPEG, PNG, WEBP, or GIF images are allowed';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  const prepareImageForUpload = async (file: File): Promise<File> => {
    const validationError = validateImage(file);
    if (validationError) {
      throw new Error(validationError);
    }

    try {
      // Only compress images larger than 1MB
      if (file.size > 1024 * 1024) {
        return await compressImage(file, {
          quality: 0.7,
          maxWidth: 1200,
          maxHeight: 1200
        });
      }
      return file;
    } catch (error) {
      console.log('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  };

  return {
    validateImage,
    prepareImageForUpload
  };
};