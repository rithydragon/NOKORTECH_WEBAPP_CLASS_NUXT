<template>
  <div class="rty-pagination">
    <div class="flex items-center justify-between ">


      <!-- Items per page selector -->
      <div class="pagination-left">
        <span class="label">Show</span>
        <USelect v-model="perPageModel" :options="perPageOptions" class="select" :ui="{
          width: 'w-24',
          base: 'cursor-pointer',
          rounded: 'rounded-lg',
          padding: 'py-1.5 px-3',
          color: {
            white: {
              outline: 'shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
            }
          }
        }" 
        @change="onPerPageChange"
        />
        <span class="label">entries</span>
      </div>

      <!-- Page info -->
      <div class="pagination-center">
        Showing <span class="highlight">{{ startIndex + 1 }}</span> to
        <span class="highlight">{{ endIndex }}</span> of
        <span class="highlight">{{ totalItems }}</span> entries
      </div>

      <!-- Pagination controls -->
      <div class="pagination-right page-controls">
        <!-- <UButton
          icon="i-heroicons-chevron-left-20-solid"
          :disabled="currentPage === 1"
          color="gray"
          variant="ghost"
          class="nav-btn"
          @click="goToPage(currentPage - 1)"
        /> -->

        <!-- First Page Button -->
        <RTYTooltip text="First page" position="top">
          <UButton icon="i-heroicons-chevron-double-left-20-solid" :disabled="currentPage === 1" color="gray"
            variant="ghost" class="nav-btn" @click="goToPage(1)" />
        </RTYTooltip>

        <!-- Previous Page Button -->
        <RTYTooltip :text="`Previous page (${currentPage - 1})`" position="top">
          <UButton icon="i-heroicons-chevron-left-20-solid" :disabled="currentPage === 1" color="gray" variant="ghost"
            class="nav-btn" @click="goToPage(currentPage - 1)" />
        </RTYTooltip>

        <!-- <div class="page-numbers">
          <template v-for="page in visiblePages" :key="page">
            <UButton
              v-if="page === '...'"
              :label="page"
              color="gray"
              variant="ghost"
              disabled
              class="page-dots"
            />
            <UButton
              v-else
              :label="page.toString()"
              :color="page === currentPage ? 'primary' : 'gray'"
              :variant="page === currentPage ? 'solid' : 'ghost'"
              class="page-btn"
              @click="goToPage(page)"
            />
          </template>
</div> -->

        <!-- Page Numbers -->
        <div class="page-numbers">
          <template v-for="page in visiblePages" :key="page">
            <RTYTooltip v-if="page === '...'" :text="`Jump to page`" position="top">
              <UButton :label="page" color="gray" variant="ghost" disabled class="page-dots" />
            </RTYTooltip>
            <RTYTooltip v-else :text="`Page ${page}`" position="top">
              <UButton :label="page.toString()" :color="page === currentPage ? 'primary' : 'gray'"
                :variant="page === currentPage ? 'solid' : 'ghost'" class="page-btn" @click="goToPage(page)" />
            </RTYTooltip>
          </template>
        </div>
        <!-- Next Page Button -->
        <RTYTooltip :text="`Next page (${currentPage + 1})`" position="top">
          <UButton icon="i-heroicons-chevron-right-20-solid" :disabled="currentPage === totalPages" color="gray"
            variant="ghost" class="nav-btn" @click="goToPage(currentPage + 1)" />
        </RTYTooltip>

        <!-- Last Page Button -->
        <RTYTooltip :text="`Last page (${totalPages})`" position="top">
          <UButton icon="i-heroicons-chevron-double-right-20-solid" :disabled="currentPage === totalPages" color="gray"
            variant="ghost" class="nav-btn" @click="goToPage(totalPages)" />
        </RTYTooltip>

        <!-- <UButton
          icon="i-heroicons-chevron-right-20-solid"
          :disabled="currentPage === totalPages"
          color="gray"
          variant="ghost"
          class="nav-btn"
          @click="goToPage(currentPage + 1)"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  perPage: {
    type: Number,
    required: true,
    default: 10
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  perPageOptions: {
    type: Array,
    // default: () => [10, 25, 50, 100]
    default: () => [10, 25, 50, { value: 100, label: 'Show All' }]
  },
  maxVisiblePages: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage', 'update:perPage', 'page-changed'])

const perPageModel1 = ref(props.perPage)

const perPageModel = computed({
  get: () => props.perPage,
  set: (value) => {
    emit('update:perPage', value)
    // Optionally emit a separate event if needed
    emit('per-page-changed', value)
  }
})
// / Modify the select options display
const formattedOptions = computed(() => {
  return props.perPageOptions.map(option => {
    if (typeof option === 'object') return option;
    return { value: option, label: option.toString() };
  });
});
// Computed properties
const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))
const startIndex = computed(() => (props.currentPage - 1) * props.perPage)
const endIndex = computed(() => Math.min(startIndex.value + props.perPage, props.totalItems))

// Generate visible page numbers with ellipsis
const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(props.currentPage - half, 1)
  let end = Math.min(start + props.maxVisiblePages - 1, totalPages.value)

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(end - props.maxVisiblePages + 1, 1)
  }

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

 

  if (end < totalPages.value) {
    if (end < totalPages.value - 1) pages.push('...')
    pages.push(totalPages.value)
  }

  return pages
})

// Methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('page-changed', page)
  }
}

const onPerPageChange = (value) => {
  console.log('Per Page Changed:', value)
  emit('update:perPage', value)

  // emit('update:currentPage', 1)   // Reset to first page when perPage changes
  // emit('page-changed', 1)

    // Removed the automatic page reset here as well
    emit('page-changed', props.currentPage)
}
</script>

<style lang="scss" scoped>
.rty-pagination {
  .pagination-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1rem;
  }

  .pagination-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .pagination-right{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
  }

  // /* Responsive adjustments */
  // @media (max-width: 640px) {
  //   @apply flex-col items-stretch;

  //   .per-page-selector {
  //     @apply justify-center;
  //   }

  //   .page-controls {
  //     @apply justify-center;
  //   }
  // }
}
</style>