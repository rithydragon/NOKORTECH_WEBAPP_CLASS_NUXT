<template>
  <div
    :class="[
      'bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 ease-in-out',
      cardClass
    ]"
    @click="handleClick"
  >
    <!-- Image Section -->
    <div v-if="imageSrc" class="relative">
      <img :src="imageSrc" :alt="imageAlt" class="w-full h-48 object-cover" />
      <slot name="image-overlay"></slot>
    </div>

    <!-- Content Section -->
    <div :class="['p-4', contentClass]">
      <!-- Title -->
      <div class="flex items-center mb-2">
        <i v-if="icon" :class="[icon, 'text-xl mr-2', iconClass]"></i>
        <h2 v-if="title" :class="['text-xl font-bold', titleClass]">
          {{ title }}
        </h2>
      </div>
      <!-- Description -->
      <p v-if="description" :class="['text-sm text-gray-600', descriptionClass]">
        {{ description }}
      </p>
      <!-- Default Slot -->
      <slot></slot>
    </div>

    <!-- Actions Section -->
    <div v-if="$slots.actions" :class="['p-4 border-t', actionsClass]">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '' // Example: 'ri-book-line' (Remix Icon class)
    },
    imageSrc: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: 'Card image'
    },
    cardClass: {
      type: String,
      default: ''
    },
    contentClass: {
      type: String,
      default: ''
    },
    titleClass: {
      type: String,
      default: ''
    },
    descriptionClass: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: '' // Add custom styling for the icon if needed
    },
    actionsClass: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
