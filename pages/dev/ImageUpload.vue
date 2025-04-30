<template>
    <RTPageWrapper>
        <!-- <RTYImageUpload @click="uploadImage()"/> -->
        <div class="parent-container">
        <h1>Profile Image Upload</h1>
        
        <!-- Image Upload Component -->
        <RTYImageUpload
          v-model="profileImage"
          :loading="uploading"
          :imageURL="defaultProfileImage"
          imageStyle="image-frame-rounded85"
          customAbsolute="customAbsolute"
          @onDone="handleImageUpload"
          @onDelete="handleImageDelete"
        />
        
        <!-- Display current image status -->
        <div class="status">
          <p v-if="profileImage">Image selected: {{ profileImage?.name || 'URL image' }}</p>
          <p v-else>No image selected</p>
        </div>
      </div>
    </RTPageWrapper>
</template>

<script setup>

async function uploadImage(file) {
  if (isEmpty(file)) return '';
  let dt = new DataTransfer();
  dt.items.add(file.file);
  let dtFiles = dt.files;
  let mfu = new splitFileUpload();
  await mfu.upload({
    file: model.value?.Image,
    local: true,
    fileTarget: dtFiles[0],
    complete: (result) => {},
    error: (errMsg) => {
      console.log('errMsg', errMsg);
    },
  });
}
// Reactive data
const profileImage = ref(null);
const uploading = ref(false);
const defaultProfileImage = ref('/img/default-profile.png');

// Handle image upload completion
const handleImageUpload = async (imageData) => {
  uploading.value = true;
  try {
    // Here you would typically send the image to your backend
    // For demonstration, we'll just simulate an API call
    console.log('Uploading image data:', imageData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you might do something like:
    // const response = await api.uploadProfileImage(imageData);
    // profileImage.value = response.imageUrl;
    
    console.log('Image uploaded successfully');
  } catch (error) {
    console.log('Error uploading image:', error);
  } finally {
    uploading.value = false;
  }
};

// Handle image deletion
const handleImageDelete = () => {
  console.log('Image deletion requested');
  profileImage.value = null;
  
  // In a real app, you might also call an API to delete from backend
  // await api.deleteProfileImage();
};
definePageMeta({ layout:'layout',middleware:'auth'})
</script>

<style scoped>
.parent-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.status {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>