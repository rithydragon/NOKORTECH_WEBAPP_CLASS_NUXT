<template>
    
    <!-- <div v-if="isOpen" class="cropper-modal"> -->
    <div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl p-4">
        <button 
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <i class="ri-close-line text-2xl"></i>
        </button>
        
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ title || 'Crop your image' }}
        </h2>
        
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <div class="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <vue-cropper
                ref="cropper"
                :src="imageSrc"
                :aspect-ratio="aspectRatio"
                :view-mode="2"
                :auto-crop-area="0.8"
                :min-container-width="300"
                :min-container-height="300"
                :background="false"
                :responsive="true"
                :check-orientation="false"
                class="cropper"
              />
            </div>
          </div>
          
          <div class="w-full md:w-64 flex flex-col gap-4">
            <div class="preview-container bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div 
                class="preview"
                :style="{
                  width: `${previewSize}px`,
                  height: `${previewSize}px`,
                  borderRadius: rounded ? '50%' : '4px'
                }"
              />
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Zoom</label>
              <input
                v-model="zoomValue"
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                class="w-full"
                @input="setZoom"
              />
              
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Rotation</label>
              <input
                v-model="rotationValue"
                type="range"
                min="-180"
                max="180"
                step="1"
                class="w-full"
                @input="setRotation"
              />
            </div>
            
            <div class="flex gap-2 mt-2">
              <button
                @click="resetCropper"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Reset
              </button>
              <button
                @click="cropImage"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700 transition-colors"
              >
                Crop & Save
              </button>
              <button @click="handleConfirm">Confirm</button>
    <button @click="handleCancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import VueCropper from 'vue-cropperjs';
  // import 'cropperjs/dist/cropper.css';
  // import 'cropperjs/cropper.css';
  import 'cropperjs/dist/cropper.css';

  import { useCropperStore } from '~/stores/useCropper';

const cropperStore = useCropperStore();
const { isOpen, imageSrc, options } = storeToRefs(cropperStore);

const handleConfirm = () => {
  // Get cropped canvas and convert to blob
  const canvas = cropper.getCroppedCanvas({
    width: options.value.width,
    height: options.value.height,
    fillColor: '#fff'
  });
  
  canvas.toBlob((blob) => {
    if (blob) {
      cropperStore.confirm(blob);
    }
  }, 'image/png');
};

const handleCancel = () => {
  cropperStore.cancel();
};
  const props = defineProps({
    show: Boolean,
    imageSrc: String,
    aspectRatio: {
      type: Number,
      default: 1
    },
    rounded: {
      type: Boolean,
      default: false
    },
    title: String,
    previewSize: {
      type: Number,
      default: 150
    }
  });
  
  const emit = defineEmits(['close', 'cropped']);
  
  const cropper = ref(null);
  const zoomValue = ref(1);
  const rotationValue = ref(0);
  
  const setZoom = () => {
    cropper.value?.setZoom(zoomValue.value);
  };
  
  const setRotation = () => {
    cropper.value?.rotateTo(rotationValue.value);
  };
  
  const resetCropper = () => {
    zoomValue.value = 1;
    rotationValue.value = 0;
    cropper.value?.reset();
  };
  
  const cropImage = () => {
    if (!cropper.value) return;
  
    cropper.value.getCroppedCanvas({
      width: 500,
      height: 500,
      minWidth: 256,
      minHeight: 256,
      maxWidth: 2000,
      maxHeight: 2000,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    }).toBlob((blob) => {
      const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
      emit('cropped', file);
      closeModal();
    }, 'image/png');
  };
  
  const closeModal = () => {
    emit('close');
  };
  
  watch(() => props.show, (newVal) => {
    if (newVal) {
      resetCropper();
    }
  });
  </script>
  
  <style scoped>
  .cropper {
    width: 100%;
    height: 100%;
  }
  
  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  
  .preview {
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    outline: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .dark input[type="range"] {
    background: #4b5563;
  }
  
  .dark input[type="range"]::-webkit-slider-thumb {
    background: #6366f1;
  }
  </style>
