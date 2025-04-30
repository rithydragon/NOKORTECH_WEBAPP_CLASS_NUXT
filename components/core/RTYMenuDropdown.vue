<template>
  <div class="relative">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-50"
    >
      <USpin class="h-5 w-5 text-primary-500" />
    </div>

    <!-- Dropdown -->
    <UDropdownMenu
      :ui="{
        width:
          optionsWidth === 'full'
            ? 'w-full'
            : optionsWidth === 'min'
            ? 'w-min'
            : 'w-auto',
        item: {
          disabled: 'cursor-not-allowed opacity-50'
        }
      }"
    >
      <!-- Trigger Button -->
      <UButton
        :label="displayValue"
        :trailing-icon="isLoading ? undefined : 'i-heroicons-chevron-down-20-solid'"
        :disabled="disabled || isLoading"
        :color="buttonColor"
        :variant="error ? 'outline' : 'solid'"
        :size="size"
        :class="[
          'justify-between',
          { 'w-full': optionsWidth === 'full' },
          error ? 'border-red-500' : ''
        ]"
      />

      <!-- Dropdown Items -->
      <template #items>
        <!-- Empty State -->
        <div
          v-if="!isLoading && items.length === 0"
          class="px-4 py-2 text-sm text-gray-500"
        >
          {{ emptyText }}
        </div>

        <!-- Items -->
        <UDropdownItem
          v-for="item in items"
          :key="item.value"
          :disabled="item.disabled"
          @click="selectItem(item.value)"
          :class="[
            modelValue === item.value
              ? 'bg-primary-50 text-primary-700'
              : 'hover:bg-gray-50'
          ]"
        >
          <slot name="option" :item="item">
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              v-if="modelValue === item.value"
              name="i-heroicons-check-20-solid"
              class="ml-auto h-5 w-5 text-primary-600"
            />
          </slot>
        </UDropdownItem>
      </template>
    </UDropdownMenu>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Object],
  options: { type: Array, default: () => [] },
  api: [String, Object, Function],
  itemValue: { type: String, default: 'value' },
  itemLabel: { type: String, default: 'label' },
  placeholder: { type: String, default: 'Select an option' },
  emptyText: { type: String, default: 'No options available' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'primary', 'danger', 'success'].includes(val)
  },
  optionsWidth: {
    type: String,
    default: 'match',
    validator: (val) => ['match', 'full', 'min'].includes(val)
  },
  error: String
})

const emit = defineEmits(['update:modelValue', 'fetch', 'error'])

const apiItems = ref([])
const internalLoading = ref(false)
const internalError = ref(null)

const isLoading = computed(() => props.loading || internalLoading.value)

const items = computed(() => {
  const raw = props.api ? apiItems.value : props.options
  return raw.map(option => {
    if (typeof option === 'object' && option !== null) {
      return {
        value: option[props.itemValue] ?? option.value,
        label: option[props.itemLabel] ?? option.label,
        disabled: option.disabled ?? false
      }
    }
    return { value: option, label: String(option), disabled: false }
  })
})

const displayValue = computed(() => {
  if (isLoading.value) return 'Loading...'
  const selected = items.value.find(i => i.value === props.modelValue)
  return selected?.label || props.placeholder
})

const buttonColor = computed(() => {
  if (props.error) return 'red'
  const map = {
    default: 'gray',
    primary: 'primary',
    danger: 'red',
    success: 'green'
  }
  return map[props.variant]
})

async function fetchData() {
  if (!props.api) {
    apiItems.value = []
    return
  }

  internalLoading.value = true
  internalError.value = null

  try {
    let response

    if (typeof props.api === 'string') {
      const { data } = await useHttp(props.api)
      response = data.value
    } else if (typeof props.api === 'object' && props.api.url) {
      const { url, method = 'GET', params, headers, body } = props.api
      const { data } = await useHttp(url, { method, params, headers, body })
      response = data.value
    } else if (typeof props.api === 'function') {
      response = await props.api()
    } else {
      throw new Error('Invalid API configuration')
    }

    let items = []
    if (Array.isArray(response)) items = response
    else if (response?.data) items = response.data
    else if (response?.results) items = response.results
    else if (response) items = [response]

    apiItems.value = items.map(item => ({
      value: item[props.itemValue] ?? item.value,
      label: item[props.itemLabel] ?? item.label,
      disabled: item.disabled ?? false
    }))

    emit('fetch', apiItems.value)
  } catch (err) {
    internalError.value = err.message || 'Failed to fetch'
    emit('error', err)
    apiItems.value = []
  } finally {
    internalLoading.value = false
  }
}

function selectItem(value) {
  emit('update:modelValue', value)
}

watch(() => props.api, fetchData, { immediate: true })
watch(() => {
  if (props.api && typeof props.api === 'object' && props.api.params) {
    return JSON.stringify(props.api.params)
  }
  return null
}, fetchData)

defineExpose({ refresh: fetchData })
</script>
