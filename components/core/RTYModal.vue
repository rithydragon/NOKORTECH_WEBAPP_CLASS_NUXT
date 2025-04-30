<template>
  <UModal :modelValue="show" @update:modelValue="handleUpdate" :title="getModalTitle" :size="modalSize">
    <!-- Modal Content -->
    <div v-if="mode === 'create' || mode === 'update'"
    :style="{ maxWidth: maxWidth, maxHeight: maxHeight }"
    >
      <form @submit.prevent="handleSubmit">
        <slot :data="modalData"></slot> <!-- Pass modal data as slot -->
        <div class="flex justify-end gap-3 mt-4">
          <UButton @click="closeModal" color="gray">{{ $t('cancel') }}</UButton>
          <UButton type="submit" color="primary">
            {{ mode === 'create' ? $t('create') : $t('update') }}
          </UButton>
        </div>
      </form>
    </div>

    <!-- Delete / Confirm Message -->
    <div v-else-if="mode === 'delete' || mode === 'confirm'" class="flex flex-col items-center">
      <p class="text-center text-gray-700">
        <span v-html="message"></span>
      </p>
      <div class="flex justify-end mt-4 gap-3">
        <UButton @click="closeModal" color="gray">{{ $t('cancel') }}</UButton>
        <UButton @click="handleConfirm" color="red">
          {{ mode === 'delete' ? $t('delete') : $t('confirm') }}
        </UButton>
      </div>
    </div>

    <!-- View Mode -->
    <div v-else-if="mode === 'view'" class="p-4">
      <slot :data="modalData"></slot> <!-- Pass modal data as slot -->
      <div class="flex justify-end mt-4">
        <UButton @click="closeModal" color="gray">{{ $t('close') }}</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  show: { type: Boolean, required: true },
  mode: { type: String, default: 'view' }, // 'create', 'update', 'delete', 'view', 'confirm'
  message: { type: String, default: '' }, // Message for delete or confirm
  data: { type: Object, default: () => ({}) }, // Dynamic data prop
  maxWidth: { type: String, default: '90vw' },
  maxHeight: { type: String, default: '90vh' },
});

const emits = defineEmits(['close', 'submit', 'confirm', 'update:show']);

const closeModal = () => {
  emits('close');
  emits('update:show', false); // Emit event to update the `show` prop in the parent
};

const handleUpdate = (value) => {
  emits('update:show', value); // Emit event to update the `show` prop in the parent
};

const handleSubmit = () => emits('submit');
const handleConfirm = () => emits('confirm');

// Compute modal title based on mode
const getModalTitle = computed(() => {
  switch (props.mode) {
    case 'create': return 'Create Academic Setting';
    case 'update': return 'Update Academic Setting';
    case 'delete': return 'Delete Academic Setting';
    case 'confirm': return 'Confirm Action';
    case 'view': return 'View Details';
    default: return 'Modal';
  }
});

// Compute modal size based on mode
const modalSize = computed(() => {
  switch (props.mode) {
    case 'create': return 'lg'; // Large for forms
    case 'update': return 'lg'; // Large for forms
    case 'delete': return 'md'; // Medium for confirmations
    case 'confirm': return 'sm'; // Small for alerts
    case 'view': return 'xl'; // Extra large for details
    default: return 'md';
  }
});

// Pass dynamic data for slot usage
const modalData = computed(() => props.data);
</script>