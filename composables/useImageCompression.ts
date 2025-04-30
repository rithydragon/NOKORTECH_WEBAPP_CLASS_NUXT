import Compressor from 'compressorjs';

export const useImageCompression = () => {
  const compressImage = (file, options = {}) => {
    const defaultOptions = {
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      convertSize: 1000000, // Convert to JPEG if size > 1MB
      ...options
    };

    return new Promise((resolve, reject) => {
      new Compressor(file, {
        ...defaultOptions,
        success(result) {
          // Convert Blob to File if needed
          if (result instanceof Blob && !(result instanceof File)) {
            const compressedFile = new File([result], file.name, {
              type: result.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(result);
          }
        },
        error(err) {
          console.log('Compression error:', err);
          reject(err);
        }
      });
    });
  };

  return {
    compressImage
  };
};