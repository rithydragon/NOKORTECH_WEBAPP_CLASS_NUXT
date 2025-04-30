import Compressor from 'compressorjs';

interface CompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  convertSize?: number;
}

export const compressImage = (file: File, options: CompressionOptions = {}): Promise<File | Blob> => {
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
          resolve(result as File);
        }
      },
      error(err) {
        console.log('Compression error:', err);
        reject(err);
      }
    });
  });
};

export const getFileFromBlob = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now()
  });
};