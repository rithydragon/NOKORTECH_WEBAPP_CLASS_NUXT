<template>
    <div class="relative">
      <!-- Loading indicator -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10">
        <Spinner class="h-5 w-5 text-primary-500" />
      </div>
  
      <HeadlessListbox 
        v-model="selectedValue" 
        :disabled="disabled || loading"
      >
        <div class="relative">
          <!-- Button trigger -->
          <HeadlessListboxButton
            :class="[
              'w-full rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1',
              buttonSizeClass,
              buttonVariantClass,
              borderClass,
              { 
                'opacity-50 cursor-not-allowed': disabled || loading,
                'border-gray-300': !error,
                'border-red-500': error
              }
            ]"
            :disabled="disabled || loading"
          >
            <span class="block truncate">
              <slot name="selected" :selected="selectedItem" :loading="loading">
                {{ displaySelectedValue }}
              </slot>
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon 
                :class="[
                  'h-5 w-5',
                  error ? 'text-red-500' : 'text-gray-400'
                ]" 
                aria-hidden="true" 
              />
            </span>
          </HeadlessListboxButton>
  
          <!-- Dropdown options -->
          <transition
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <HeadlessListboxOptions
              :class="[
                'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                optionsWidthClass
              ]"
            >
              <!-- Empty state -->
              <div 
                v-if="!loading && processedItems.length === 0" 
                class="px-4 py-2 text-sm text-gray-500"
              >
                {{ emptyText }}
              </div>
  
              <!-- Options list -->
              <HeadlessListboxOption
                v-for="item in processedItems"
                :key="item.value"
                v-slot="{ active, selected }"
                :value="item.value"
                :disabled="item.disabled"
                as="template"
              >
                <li
                  :class="[
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-primary-100 text-primary-900' : 'text-gray-900',
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <slot name="option" :item="item" :active="active" :selected="selected">
                    <span :class="['block truncate', selected ? 'font-semibold' : 'font-normal']">
                      {{ item.label }}
                    </span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </slot>
                </li>
              </HeadlessListboxOption>
            </HeadlessListboxOptions>
          </transition>
        </div>
      </HeadlessListbox>
  
      <!-- Error message -->
      <p v-if="error" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
  import { computed, watch, ref, onMounted } from 'vue'
  import Spinner from '../LoadingSpinner.vue'
  
  interface SelectItem {
    value: any
    label: string
    disabled?: boolean
  }
  
  interface ApiConfig {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params?: Record<string, any>
    headers?: Record<string, string>
    body?: any
  }
  
  type ApiSource = string | ApiConfig | (() => Promise<any>)
  
  const props = withDefaults(defineProps<{
    modelValue: any
    options?: SelectItem[] // Static options
    api?: ApiSource // API endpoint (string), config object, or function
    itemValue?: string // Key for value in API response objects
    itemLabel?: string // Key for label in API response objects
    placeholder?: string
    emptyText?: string
    disabled?: boolean
    loading?: boolean // External loading control
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'primary' | 'danger' | 'success'
    optionsWidth?: 'match' | 'full' | 'min'
    error?: string
  }>(), {
    placeholder: 'Select an option',
    emptyText: 'No options available',
    disabled: false,
    loading: false,
    size: 'md',
    variant: 'default',
    optionsWidth: 'match',
    itemValue: 'value',
    itemLabel: 'label'
  })
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'fetch', items: SelectItem[]): void
    (e: 'error', error: Error): void
  }>()
  
  const internalLoading = ref(false)
  const apiItems = ref<SelectItem[]>([])
  const error = ref<string | null>(null)
  
  const isLoading = computed(() => props.loading || internalLoading.value)
  
  // Process items from either options or API
  const processedItems = computed(() => {
    if (props.api) {
      return apiItems.value
    }
    return props.options || []
  })
  
  const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const selectedItem = computed(() => 
    processedItems.value.find(item => item.value === props.modelValue)
  )
  
  const displaySelectedValue = computed(() => {
    if (isLoading.value) return 'Loading...'
    return selectedItem.value?.label || props.placeholder
  })
  
  // Style classes
  const buttonSizeClass = computed(() => ({
    sm: 'text-sm py-1.5',
    md: 'text-base py-2',
    lg: 'text-lg py-2.5'
  }[props.size]))
  
  const buttonVariantClass = computed(() => ({
    default: 'text-gray-900',
    primary: 'text-primary-900',
    danger: 'text-red-900',
    success: 'text-green-900'
  }[props.variant]))
  
  const borderClass = computed(() => ({
    default: 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    primary: 'border-primary-500 focus:ring-primary-500 focus:border-primary-500',
    danger: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-500 focus:ring-green-500 focus:border-green-500'
  }[props.variant]))
  
  const optionsWidthClass = computed(() => ({
    match: 'w-auto min-w-[var(--button-width)]',
    full: 'w-full',
    min: 'w-auto min-w-min'
  }[props.optionsWidth]))
  
  // Fetch API data when api prop changes
  watch(() => props.api, fetchData, { immediate: true })
  watch(() => props.api && typeof props.api !== 'function' ? 
    JSON.stringify((props.api as ApiConfig).params) : null, 
    fetchData, 
    { deep: true }
  )
  
  async function fetchData() {
    if (!props.api) return
  
    error.value = null
    internalLoading.value = true
  
    try {
      let response: any
  
      if (typeof props.api === 'string') {
        // String URL - make GET request
        const { data } = await useFetch(props.api)
        response = data.value
      } else if (typeof props.api === 'object' && props.api.url) {
        // API config object
        const { url, method = 'GET', params, headers, body } = props.api
        const { data } = await useFetch(url, {
          method,
          params,
          headers,
          body
        })
        response = data.value
      } else if (typeof props.api === 'function') {
        // Function - call directly
        response = await props.api()
      } else {
        throw new Error('Invalid API configuration')
      }
  
      // Normalize different API response formats
      let items: any[] = []
      if (Array.isArray(response)) {
        items = response
      } else if (response?.data) {
        items = response.data
      } else if (response?.results) {
        items = response.results
      } else if (response) {
        items = [response] // Single item
      }
  
      // Transform items if custom keys are provided
      apiItems.value = items.map(item => ({
        value: item[props.itemValue],
        label: item[props.itemLabel],
        disabled: item.disabled
      }))
  
      emit('fetch', apiItems.value)
    } catch (err) {
      error.value = err.message || 'Failed to load options'
      emit('error', err)
      apiItems.value = []
    } finally {
      internalLoading.value = false
    }
  }
  
  // Expose fetch method for manual refresh
  defineExpose({
    refresh: fetchData
  })
  </script>

<!-- 
String URL (GET)
<DropdownSelect
  v-model="selectedUser"
  api="/api/users"
/>

2. API Config Object
<DropdownSelect
  v-model="selectedProduct"
  :api="{
    url: '/api/products',
    method: 'POST',
    body: { category: 'electronics' }
  }"
/>

3. Async Function
<DropdownSelect
  v-model="selectedItem"
  :api="fetchCustomData"
/>

<script setup>
async function fetchCustomData() {
  const { data } = await useFetch('/api/custom', {
    method: 'GET',
    params: { filter: 'active' }
  })
  return data.value
}
</script> -->