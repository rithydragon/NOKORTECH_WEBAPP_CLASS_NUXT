<template>
  <div class="avatar-upload">
    <!-- Avatar Container -->
    <div class="avatar-container" :class="{ 'has-preview': showPreview }">
      <img 
        :src="displayImage || '/images/defaultProfile.png'" 
        alt="Profile picture"
        class="avatar-image"
      />

      <!-- Hover Buttons -->
      <div class="avatar-overlay">
        <button
          @click.stop="openFilePicker"
          class="avatar-button camera-button"
          title="Change avatar"
        >
          <Icon name="ph:camera" size="20" />
        </button>

        <button
          v-if="userStore.userData?.avatar"
          @click.stop="confirmDelete"
          class="avatar-button delete-button"
          title="Remove avatar"
        >
          <Icon name="ph:trash" size="20" />
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-spinner"></div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
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
          :src="previewImage || '/images/defaultProfile.png'" 
          alt="Preview"
          class="preview-image"
        />

        <div class="preview-actions">
          <button
            @click="uploadAvatar"
            class="action-button save-button"
            :disabled="loading"
          >
            <Icon name="ph:check" size="20" />
            <span>Save</span>
          </button>

          <button
            @click="closePreview"
            class="action-button cancel-button"
          >
            <Icon name="ph:x" size="20" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <transition name="fade">
      <div 
        v-if="notification.message"
        class="notification"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const fileInput = ref(null)
const previewImage = ref(null)
const showPreview = ref(false)
const loading = ref(false)
import { useImageCompression } from '~/composables/useImageCompression';
    // In components or composables
    const { notify } = useNotification()

// Success notification
notify('Profile updated successfully!')

// Error notification
notify('Failed to save changes', 'error')

// Warning notification
notify('This action cannot be undone', 'warning')

// Info notification
notify('New messages available', 'info')

const notification = reactive({
  message: '',
  type: ''
})

const displayImage = computed(() => {
  return previewImage.value || userStore.userData?.avatar || '/images/default-avatar.png'
})

const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  setTimeout(() => notification.message = '', 3000)
}

const openFilePicker = () => fileInput.value?.click()

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete your avatar?')) {
    try {
      await userStore.deleteAvatar()
      showNotification('Avatar removed successfully!')
    } catch (error) {
      showNotification('Failed to remove avatar', 'error')
    }
  }
}

const closePreview = () => {
  showPreview.value = false
  previewImage.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    showNotification('Only JPG/PNG/WEBP images allowed', 'error')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showNotification('Image must be <5MB', 'error')
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
    showPreview.value = true
  }
  reader.readAsDataURL(file)
}

const uploadAvatar1111 = async () => {
  if (!fileInput.value?.files?.[0]) return;

  const { compressImage } = useImageCompression();
  const { notify } = useNotification();

  try {
    loading.value = true;
    const file = fileInput.value.files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      notify('Only JPG, PNG, or WEBP images are allowed', 'error');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB
      notify('Image must be smaller than 5MB', 'error');
      return;
    }

    // Compress image
    const compressedFile = await compressImage(file, {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800
    });

    // Create FormData
    const formData = new FormData();
    formData.append('Image', compressedFile);
    formData.append('UserId', userStore.userId);

    // Upload avatar
    await userStore.updateAvatar(formData);
    
    closePreview();
    notify('Avatar updated successfully!', 'success');
    
  } catch (error) {
    console.log('Upload error:', error);
    notify(
      error.response?.data?.message || 
      error.message || 
      'Upload failed. Please try again.',
      'error'
    );
  } finally {
    loading.value = false;
  }
};

const uploadAvatar = async () => {
  if (!fileInput.value?.files?.[0]) return;

  try {
    loading.value = true;
    
    // Get fresh token before upload
    // await userStore?.refreshToken(); // Add this line
    
    const file = fileInput.value.files[0];
    // // const compressedFile = await prepareImageForUpload(file);
    // const compressedFile = await compressImage(file, {
    //   quality: 0.7,
    //   maxWidth: 800,
    //   maxHeight: 800
    // });


    await userStore.updateAvatar(file);
    
    closePreview();
    showNotification('Avatar updated successfully!');
  } catch (error) {
    console.log('Upload error:', error);
    showNotification(
      error.response?.data?.message || 
      error.message || 
      'Upload failed. Please try again.',
      'error'
    );
    
    // Don't redirect here - let the http interceptor handle it
  } finally {
    loading.value = false;
  }
};

const uploadAvatar11 = async () => {
  if (!fileInput.value?.files?.[0]) return

  try {
    loading.value = true
    await userStore.updateAvatar(fileInput.value.files[0])
    closePreview()
    showNotification('Avatar updated successfully!')
  } catch (error) {
    showNotification(error.message || 'Upload failed', 'error')
  } finally {
    loading.value = false
  }
}
const uploadAvatar22 = async () => {
  if (!fileInput.value?.files?.[0]) return;

  try {
    loading.value = true;
    const file = fileInput.value.files[0];
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('Image', file);
    formData.append('UserId', userStore.userData.UserId);

    const { data, error } = await useHttp('/api/user/upload_avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    if (error) throw error;

    closePreview();
    showNotification('Avatar updated successfully!');
    
    // Update user data in store
    await userStore.fetchUserData();
    
  } catch (error) {
    console.log('Upload error:', error);
    showNotification(
      error.response?.data?.message || 
      error.message || 
      'Upload failed. Please try again.',
      'error'
    );
  } finally {
    loading.value = false;
  }
};

</script>

<style lang="scss">
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  .avatar-container {
    position: relative;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &.has-preview {
      filter: brightness(0.7);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }

    .avatar-button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &.camera-button {
        background-color: rgba(255, 255, 255, 0.9);
        color: #333;

        &:hover {
          background-color: white;
          transform: scale(1.1);
        }
      }

      &.delete-button {
        background-color: rgba(239, 68, 68, 0.9);
        color: white;

        &:hover {
          background-color: rgb(239, 68, 68);
          transform: scale(1.1);
        }
      }
    }

    .loading-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
  }

  .file-input {
    display: none;
  }

  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .preview-content {
      background-color: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 30rem;
      padding: 1.5rem;

      .preview-image {
        width: 100%;
        max-height: 20rem;
        object-fit: contain;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .preview-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;

          &.save-button {
            background-color: #3b82f6;
            color: white;

            &:hover:not(:disabled) {
              background-color: #2563eb;
            }

            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
          }

          &.cancel-button {
            background-color: #e5e7eb;
            color: #4b5563;

            &:hover {
              background-color: #d1d5db;
            }
          }
        }
      }
    }
  }

  .notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &.success {
      background-color: #10b981;
    }

    &.error {
      background-color: #ef4444;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>~/composables/useImageCompression