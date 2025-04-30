
<template>
  <USlideover
    v-model:open="open"
    :title="title"
    :ui="{
      width: `w-${size}`,
      footer: 'justify-end'
    }"
    :prevent-close="false"
  >
  <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="closeSlideover"
        />
      </div>
    </div>

    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto p-4">
      <slot />
    </div>

    <!-- Action buttons -->
  <div class="sticky bottom-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-end gap-2 p-4">
        <slot name="footer" />
      </div>
    </div>
  </USlideover>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps(['type','title','button','loading'])
// const title = computed(() => {props.title ?? 'Slideover'})
const emit = defineEmits(['update:modelValue'])
const closeSlideover = () => {
  emit('update:modelValue', false)
}
// const open  = ref(false)
const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// const closeSlideover = () => {
//   open.value = false
// }
</script>

<style lang="scss" scoped>
/* Ensure proper scrolling behavior */
// :deep(.overflow-y-auto) {
//   scrollbar-gutter: stable;
// }

// /* Sticky header/footer positioning */
// .sticky {
//   position: sticky;
// }
</style>