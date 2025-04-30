<template>
  <div class="flex flex-col items-center gap-6">
    <div class="relative group">
      <div class="avatar-container">
        <img 
          :src="displayImage" 
          alt="Profile picture"
          class="avatar-image"
          :class="{ 'brightness-75': showPreview }"
        >

        <!-- Upload/Delete Buttons -->
        <div class="action-buttons">
          <button
            @click.stop="openFilePicker"
            class="icon-button"
            title="Change avatar"
          >
            <Icon name="ph:camera" size="20" class="text-gray-800 dark:text-white" />
          </button>

          <button
            v-if="userStore.userData"
            @click.stop="confirmDelete"
            class="icon-button"
            title="Remove avatar"
          >
            <Icon name="ph:trash" size="20" class="text-red-500" />
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div 
        v-if="userStore.loading"
        class="loading-overlay"
      >
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Preview Modal -->
    <div 
      v-if="showPreview"
      class="preview-modal"
      @click.self="closePreview"
    >
      <div class="preview-content">
        <img 
          :src="previewImage" 
          alt="Preview"
          class="preview-image"
        >

        <div class="preview-actions">
          <button
            v-if="!userStore.loading"
            @click="uploadAvatar"
            class="btn-save"
            title="Save avatar"
          >
            <Icon name="ph:check" size="24" />
          </button>

          <button
            @click="closePreview"
            class="btn-cancel"
            title="Cancel"
          >
            <Icon name="ph:x" size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="userStore.error" class="error-text">
      {{ userStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const fileInput = ref(null);

const previewImage = ref(null);
const showPreview = ref(false);

const displayImage = computed(() => {
  return previewImage.value || userStore.avatar || '/images/default-avatar.png';
});

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange1111 = (event) => {
  const input = event.target;
  if (input.files?.[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result;
      showPreview.value = true;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const uploadAvatar11 = async () => {
  const file = fileInput.value?.files?.[0];
  console.log('Selected file:', file);	
  if (file) {
    try {
      await userStore.updateAvatar(file);
      closePreview();
    } catch (error) {
      showPreview.value = true
      alert('Upload failed:', error);
    }
  }
};

const handleFileChange11 = async (event) => {
    const input = event.target;
    if (input.files?.[0]) {
        // Validate file type before uploading
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target?.result;
            showPreview.value = true;
        };
        reader.readAsDataURL(file);

        try {
            await store.updateAvatar(file);
            // Success handling
        } catch (error) {
            console.log('Upload failed:', error);
            // Reset preview on error
            previewImage.value = null;
            showPreview.value = false;
            input.value = ''; // Clear the file input
        }
    }
};

const uploadAvatar1111 = async () => {
  const file = fileInput.value?.files?.[0];
  
  if (!file) {
    alert('Please select a file first');
    return;
  }

  console.log('Selected file:', file);

  // Client-side validation
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
    return;
  }

  // Size limit (2MB example)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    alert('Image size must be less than 2MB');
    return;
  }

  try {
    loading.value = true; // Show loading state
    await userStore.updateAvatar(file);
    
    // Success handling
    closePreview();
    // Optional: show success message
    // You could use a toast notification library instead of alert
    alert('Avatar updated successfully!');
    
  } catch (error) {
    console.log('Upload error:', error);
    showPreview.value = true;
    
    // Better error messaging
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to upload avatar. Please try again.';
    alert(errorMessage);
    
  } finally {
    loading.value = false;
    // Reset file input to allow selecting the same file again
    if (fileInput.value) fileInput.value.value = '';
  }
};

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete your avatar?')) {
    try {
      await userStore.deleteAvatar();
    } catch (error) {
      console.log('Delete failed:', error);
    }
  }
};

const closePreview = () => {
  showPreview.value = false;
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleFileChange = async (event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  const { prepareImageForUpload } = useImageUpload();

  try {
    // Show loading state
    loading.value = true;

    // Process and compress image
    const processedFile = await prepareImageForUpload(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
      showPreview.value = true;
    };
    reader.readAsDataURL(processedFile);

  } catch (error) {
    console.log('Error processing image:', error);
    alert(error instanceof Error ? error.message : 'Invalid image file');
    // Reset input
    if (input) input.value = '';
  } finally {
    loading.value = false;
  }
};

const uploadAvatar = async () => {
  if (!fileInput.value?.files?.[0]) return;

  const { prepareImageForUpload } = useImageUpload();

  try {
    loading.value = true;
    const file = fileInput.value.files[0];
    const compressedFile = await prepareImageForUpload(file);
    await userStore.updateAvatar(compressedFile);
    closePreview();
    // Show success message
    useToast().success('Avatar updated successfully!');
  } catch (error) {
    console.log('Upload error:', error);
    useToast().error(error instanceof Error ? error.message : 'Upload failed');
  } finally {
    loading.value = false;
  }
};


</script>

<style lang="scss" scoped>
.avatar-container {
  width: 10rem;
  height: 10rem;
  border-radius: 9999px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.action-buttons {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .action-buttons {
  opacity: 1;
}

.icon-button {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.icon-button:hover {
  transform: scale(1.1);
}

.dark .icon-button {
  background-color: rgba(31, 41, 55, 0.9); // dark:bg-gray-800/90
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 9999px;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.preview-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.preview-content {
  position: relative;
  background-color: white;
  border-radius: 0.75rem;
  max-width: 42rem;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.dark .preview-content {
  background-color: #111827; // dark:bg-gray-900
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.preview-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-save {
  padding: 0.5rem;
  background-color: #22c55e;
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.btn-save:hover {
  background-color: #16a34a;
}

.btn-cancel {
  padding: 0.5rem;
  background-color: #ef4444;
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #dc2626;
}

.error-text {
  color: #ef4444;
  text-align: center;
  max-width: 20rem;
  font-size: 0.875rem; // text-sm
}

// Custom Scrollbar
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
</style>


<!-- // Example with more options
const compressedFile = await compressImage(file, {
  quality: 0.6,           // Quality level (0-1)
  maxWidth: 1024,         // Maximum width
  maxHeight: 1024,        // Maximum height
  convertSize: Infinity,   // Don't auto-convert to JPEG
  mimeType: 'auto',       // Keep original mime type
  resize: 'cover'         // Resize mode ('cover', 'contain', etc.)
}); -->