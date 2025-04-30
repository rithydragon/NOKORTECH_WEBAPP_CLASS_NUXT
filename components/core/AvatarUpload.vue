<script setup lang="ts">
const userStore = useUserStore();
const fileInput = ref<HTMLInputElement>();
const previewImage = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const uploadAvatar = async () => {
  if (fileInput.value?.files?.[0]) {
    try {
      await userStore.updateAvatar(fileInput.value.files[0]);
      previewImage.value = null;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative group">
      <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
        <img 
          :src="previewImage || userStore.avatar || '/images/profile_male.png'" 
          alt="Profile picture"
          class="w-full h-full object-cover"
        >
      </div>
      <button
        @click="fileInput?.click()"
        class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition-all"
      >
        <Icon name="material-symbols:edit" size="20" />
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <button
      v-if="previewImage"
      @click="uploadAvatar"
      class="btn btn-primary btn-sm"
      :disabled="userStore.loading"
    >
      <span v-if="userStore.loading" class="loading loading-spinner"></span>
      Save Avatar
    </button>
  </div>
</template>