<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',  // Default to 'primary' button type
  },
  color: {
    type: String,
    default: '',  // Will be overridden by type or the parent's value
  },
  variant: {
    type: String,
    default: 'solid', // Default variant for button
  },
  size: {
    type: String,
    default: 'md',
  },
  class: {
    type: String,
    default: '',
  },
  apiData: {  // New prop for receiving data from the API
    type: Object,
    default: () => ({}),
  },
  disabled: {  // Prop to handle disabled state
    type: Boolean,
    default: false,
  },
});

// Default styles and icon mappings for different button types
const buttonStyles = {
  primary: {
    color: 'blue',
    icon: 'ri-check-circle-line', // RemixIcon: check-circle
  },
  save: {
    color: 'green',
    icon: 'ri-save-line', // RemixIcon: save
  },
  create: {
    color: 'blue',
    icon: 'ri-add-circle-line', // RemixIcon: add-circle
  },
  update: {
    color: 'yellow',
    icon: 'ri-edit-line', // RemixIcon: edit
  },
  delete: {
    color: 'red',
    icon: 'ri-delete-bin-line', // RemixIcon: delete-bin
  },
  // Add other button types similarly...
};

const computedColor = computed(() => props.color || buttonStyles[props.type]?.color);
const computedIcon = computed(() => props.icon || buttonStyles[props.type]?.icon);

const emit = defineEmits(['click', 'api-data-received']);

// API Data handling: watch prop and emit when API data changes
const apiData = ref(props.apiData);

watch(() => props.apiData, (newData) => {
  apiData.value = newData;
  emit('api-data-received', apiData.value); // Emit updated data when it changes
});

function onClick() {
  if (props.disabled) return; // Prevent click if button is disabled
  emit('click', { message: 'Button clicked', apiData: apiData.value });
}
</script>

<template>
  <UButton
    :label="label"
    :color="computedColor"
    :variant="variant"
    :size="size"
    :class="class"
    :disabled="disabled"
    @click="onClick"
  >
    <i v-if="computedIcon" :class="['ri', computedIcon]"></i> <!-- Adding RemixIcon -->
  </UButton>
</template>

<style scoped>
/* Optionally, you can add some scoped styles for your button component here */
</style>
