

<template>
  <div class="overflow-x-auto">
    <div class="flex justify-between items-center mb-4">
      <UInput
        v-model="searchQuery"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass"
        @change="getData"
      />
      <UButton
        label="Refresh"
        icon="i-heroicons-arrow-path"
        @click="refreshData"
      />
    </div>

    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="index"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <div class="flex items-center justify-between cursor-pointer" @click="sortColumn(column.key)">
              <span>{{ column.label }}</span>
              <i v-if="sortKey === column.key" class="ml-1" :class="sortOrder === 'asc' ? 'ri-arrow-drop-up-fill' : 'ri-arrow-drop-down-fill'"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-4 text-center">
            <div class="flex justify-center items-center">
              <USpinner class="mr-2" />
              <span>Loading data...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="filteredData.length === 0">
          <td :colspan="columns.length" class="px-6 py-4 text-center text-gray-500">
            No records found
          </td>
        </tr>
        <tr v-for="(row, index) in paginatedData" :key="index" class="hover:bg-gray-50">
          <td
            v-for="(column, hIndex) in columns"
            :key="hIndex"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          >
            <template v-if="column.key === 'actions'">
              <slot name="actions" :data="row"></slot>
            </template>
            <template v-else>
              {{ row[column.key] || '-' }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    
    <RTYPagination
      v-model:current-page="currentPage"
      v-model:per-page="perPage"
      :total-items="filteredData?.length"
      :per-page-options="[5, 10, 25, 50]"
      :max-visible-pages="7"
      @page-changed="getData"
      class="mt-6"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  api: {
    type: String,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['refresh'])

const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const perPage = ref(10)
const data = ref([])
const searchQuery = ref('')
const loading = ref(true)
const totalPages = ref(1)
const totalItems = ref(150)

// Fetch data from API
const getData = async () => {
  loading.value = true
  try {
    const response = await useHttp(props.api, {
      params: {
        page: currentPage.value,
        perPage: perPage.value,
        sort: sortKey.value,
        order: sortOrder.value,
        search: searchQuery.value
      }
    })
    data.value = response.data
    totalPages.value = response.totalPages || Math.ceil(response.total / perPage.value)
  } catch (error) {
    console.log('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// Watch for changes to API URL
watch(() => props.api, getData, { immediate: true })

// Computed properties
const processedData = computed(() => {
  if (!data.value) return []
  return [...data.value]
})

const filteredData = computed(() => {
  if (!searchQuery.value) return processedData.value
  return processedData.value.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
  ))
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = currentPage.value * perPage.value
  return filteredData.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => Math.min(currentPage.value * perPage.value, filteredData.value.length))

// Methods
const sortColumn = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  getData()
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  getData()
}

const refreshData = () => {
  currentPage.value = 1
  searchQuery.value = ''
  getData()
  emit('refresh')
}

//pagination
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalItems: 0
})


</script>