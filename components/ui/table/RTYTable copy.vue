  <template>
    <div class="" :class="{ 'border rounded-lg': options?.tblBorder }">
      <!-- Table Header Slot -->
      <div class="rty-table-container">
        <div class="table-head-top">
          <!-- Left & Center (Will be on the RIGHT due to reverse) -->
          <div class="table-head-top__left-center">
            <div v-if="$slots['headerRight']" class="table-head-top__slot-right">
              <slot name="headerRight" />
            </div>
          </div>

          <div v-if="$slots['headerCenter']" class="table-head-top__center">
            <slot name="headerCenter" />
          </div>

          <!-- Right side (Will be on the LEFT due to reverse) -->
          <div class="table-head-top__right">
            <div v-if="$slots['headerLeft']" class="table-head-top__left">
              <slot name="headerLeft" />
            </div>
            <UInput :model-value="searchQuery" :placeholder="$t('search_')" icon="i-heroicons-magnifying-glass"
              @update:modelValue="handleSearch" class="table-head-top__search" />
            <UButton icon="i-heroicons-arrow-path" :loading="loading" @click="reload" class="table-head-top__reload" />
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-10">
          <div class="loading-bar"></div>
        </div>

        <!-- Table Wrapper -->
        <div class="table-wrapper">
          <UProgress v-if="loading" size="xs" orientation="horizontal" color="neutral" />
          <!-- Table Header (outside scroll area) -->
          <div class="table-header">
            <table ref="tableRef">
              <thead>
                <tr>
                  <th v-for="(column, index) in processedColumns" :key="index" scope="col">
                    <div :class="{ 'cursor-pointer': column.sortable }"
                      @click="column.sortable ? sortColumn(column.key) : null">
                      <span class="whitespace-nowrap">{{ column.label }}</span>
                      <span>{{ console.log("Columem : ", column.label) }}</span>
                      <i v-if="sortKey === column.key" class="ml-1"
                        :class="sortOrder === 'asc' ? 'ri-arrow-drop-up-fill' : 'ri-arrow-drop-down-fill'"></i>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- Scrollable Table Body -->
          <div class="table-body">
            <table>
              <tbody :style="{ maxHeight: options?.scrollHeight || '500px' }">
                <tr v-if="paginatedData.length === 0">
                  <td :colspan="processedColumns?.length" class="text-center py-10">
                    <i class="ri-database-2-line"></i> {{ $t('no_data') }}
                  </td>
                </tr>

                <!-- Data rows -->
                <template v-for="(row, rowIndex) in paginatedData" :key="row.id || rowIndex">
                  <tr>
                    <td v-for="(column, hIndex) in columns" :key="hIndex">
                      <template v-if="column.data === 'actions'">
                        <slot name="actions" :data="row"></slot>
                      </template>
                      <template v-else-if="column.slot">
                        <slot :name="`${column.data}`" :data="row"></slot>
                      </template>
                      <template v-else-if="column.render">
                        {{ column.render(data) }}
                      </template>
                      <template v-else>
                        {{ row[column.data] || '-' }}
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pagination Component -->
      <div class="py-6">
        <RTYPagination v-if="options?.pagination !== false && showPagination"
          v-model:current-page="pagination.currentPage" v-model:per-page="pagination.pageSize"
          :totalItems="pagination.totalItems" :totalPages="pagination.totalPages"
          :perPage-options="options?.perPageOptions || [10, 25, 50, 100]" @update:current-page="handlePageChange"
          @update:per-page="handlePageSizeChange" />
      </div>
    </div>
  </template>

<script setup>
const props = defineProps({
  api: {
    type: [String, Object],
    required: true,
    validator: (value) => {
      if (typeof value === 'string') return true
      if (typeof value === 'object') {
        return value.url && typeof value.url === 'string'
      }
      return false
    }
  },
  data: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({
      pagination: true,
      loading: true,
      tblBorder: true,
      columnVisibility: true,
      pageSizeOptions: [5, 10, 25, 50],
      initialFilters: {},
      scrollHeight: '500px',
      fixedRowCount: 10,
    })
  },
  initialSearch: {
    type: String,
    default: ''
  },
  autoLoad: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  columns: {
    type: Array,
    required: true,
    validator: (cols) => cols.every(col => col.key && col.label)
  },
  showColumnVisibility: {
    type: Boolean,
    default: true
  },
  pageSizeOptions: {
    type: Array,
    default: () => [5, 10, 25, 50]
  },
  requestConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'row-click',
  'refresh',
  'loaded',
  'error',
  'update:search',
  'update:filters',
  'update:data',
  'reload',
  'column-visibility-change'
])

const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = ref(10)
const data = ref([])
const searchQuery = ref('')
const loading = ref(true)
const totalPages = ref(1)
const totalItems = ref(150)
// const tableData = ref({})
const tableRef = ref(null)
// const pageSize = ref(props.pageSize)
const visibleColumns = ref({})
const showPagination = ref(true)
const tableData = ref([])


// Reactive state
const pagination = reactive({
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10
})

// Reactive state
const internalSearchQuery = ref(props.initialSearch)
const activeFilters = ref({ ...props.options.initialFilters })


// Initialize visible columns
props.columns?.forEach(col => {
  visibleColumns.value[col.key] = col.visible !== false
})

const getData = async () => {
  loading.value = true
  try {
    let apiConfig = {
      method: 'GET',
      params: {
        page: pagination.currentPage,
        size: pagination.pageSize,
        ...(sortKey.value && {
          sort: sortKey.value,
          order: sortOrder.value
        }),
        ...(searchQuery.value && { search: searchQuery.value })
      }
    }

    if (typeof props.api === 'string') {
      apiConfig.url = props.api
    } else {
      Object.assign(apiConfig, props.api)
    }

    const { data } = await useHttp(apiConfig.url, apiConfig)

    // Update table data and pagination from backend response
    tableData.value = data.data || data.items || data.content || []

    // Update pagination from backend
    if (data.pagination) {
      pagination.totalItems = data.pagination.totalItems
      pagination.totalPages = data.pagination.totalPages
      // Don't override currentPage from backend unless it's invalid
      if (data.pagination.currentPage !== pagination.currentPage &&
        data.pagination.currentPage <= data.pagination.totalPages) {
        pagination.currentPage = data.pagination.currentPage
      }
      pagination.pageSize = data.pagination.pageSize
    } else {
      // Fallback if pagination data is at root level
      pagination.totalItems = data.totalItems ?? data.totalElements ?? data.total
      pagination.totalPages = data.totalPages ?? data.totalPages
      // Only update currentPage if it's different and valid
      const newPage = data.currentPage ?? (data.number + 1)
      if (newPage !== pagination.currentPage && newPage <= pagination.totalPages) {
        pagination.currentPage = newPage
      }
      pagination.pageSize = data.pageSize ?? data.size
    }

    emit('loaded', {
      data: tableData.value,
      pagination
    })

  } catch (error) {
    console.log('Error fetching data:', error)
    emit('error', error)
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// Handle page change
const handlePageChange = async (page) => {
  console.log("Page changed to =============: ", page)
  pagination.currentPage = page
  await getData()
}

const allData = ref([]);
const showAll = ref(false);

const handlePageSizeChange = async (size) => {
  if (size === 100) { // Special case for "Show All"
    // Fetch all data (up to 100 records)
    const { data } = await useHttp(props.api, {
      params: {
        size: 100, // Maximum records to fetch
        ...(sortKey.value && {
          sort: sortKey.value,
          order: sortOrder.value
        }),
        ...(searchQuery.value && { search: searchQuery.value })
      }
    });

    tableData.value = data.data || data.items || [];
    pagination.totalItems = tableData.value.length;
    pagination.pageSize = size;
    pagination.currentPage = 1;
    pagination.totalPages = 1; // Only one page when showing all

    // Hide pagination controls when showing all
    showPagination.value = false;
  } else {
    // Normal pagination behavior
    pagination.pageSize = size;
    pagination.currentPage = 1;
    showPagination.value = true;
    await getData();
  }
}

// Make sure to watch for perPage changes if using v-model
watch(() => pagination.pageSize, (newSize) => {
  console.log("Page size changed to ===========: ", newSize)
  handlePageSizeChange(newSize)
})


// Process columns to add metadata
const processedColumns = computed(() => {
  return props.columns.map(col => ({
    ...col,
    slot: !!col.slot, // Mark if column uses slot
    visible: col.visible !== false, // Default to visible unless explicitly false
    sortable: col.sortable !== false // Default to sortable unless explicitly false
  }))
})

// Filter visible columns
const visibleProcessedColumns = computed(() => {
  return processedColumns.value.filter(col => visibleColumns.value[col.key])
})
// Column visibility dropdown items
const columnVisibilityItems = computed(() => {
  return processedColumns.value
    .filter(col => col.key !== 'actions')
    .map(col => ({
      key: col.key,
      label: col.label
    }))
})

function compareValues(a, b) {
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'string') a = a.toLowerCase()
  if (typeof b === 'string') b = b.toLowerCase()
  return a > b ? 1 : a < b ? -1 : 0
}


// Update the pageSize watcher
watch(pageSize, (newVal) => {
  currentPage.value = 1 // Reset to first page when page size changes
  getData() // Refresh data
})

// Update your paginatedData computed property
// const paginatedData = computed(() => {
//   // For server-side pagination, we just return all received data
//   // The pagination is handled by the server
//   return tableData.value
// })
const paginatedData = computed(() => {
  // If using server-side API, return tableData directly
  if (props.api) return tableData.value

  // For local pagination, slice the filtered data
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  return filteredData.value.slice(start, end)
})
// Computed: Paginate the filtered data

// Update the sortColumn method
const sortColumn = async (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }

  // Don't reset to first page - keep current position
  await getData()
  if (props.api) {
    // For API data - refresh with new sort params
    getData()
  }
  // For local data - the computed filteredData will automatically re-sort
}

// Update the filteredData computed property
const filteredData = computed(() => {
  let result = [...tableData.value]

  // Filtering
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(query)
      ))
  }

  // Sorting - only for local data
  if (sortKey.value && !props.api) {
    result.sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]
      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder.value === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }

      return sortOrder.value === 'asc'
        ? (valA > valB ? 1 : -1)
        : (valB > valA ? 1 : -1)
    })
  }
  return result
})

// Methods
const handleSearch = (value) => {

  searchQuery.value = value
  console.log("Search value ============>: ", value)
  emit('update:search', value)
  currentPage.value = 1
}

const handleFilterUpdate = (filters) => {
  activeFilters.value = filters
  emit('update:filters', filters)
  currentPage.value = 1
}

const reload = () => {
  // currentPage.value = 1
  loading.value = true
  getData()
  emit('reload', 'refresh')
}

// Watch for external data changes
watch(() => props.data, () => {
  loading.value = false
})


const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  getData()
}

// Watch for changes to API URL
watch(async () => props.api, await getData(), { immediate: true })

// Expose methods to parent component
defineExpose({
  reload,
  refreshData: reload,
  getData,
  setData: (data) => {
    tableData.value = data
  },
  setLoading: (isLoading) => { loading.value = isLoading },
  getFilters: () => activeFilters.value,
  setFilters: (filters) => { activeFilters.value = filters },
  resetFilters: () => { activeFilters.value = {} },
  startLoading: () => {
    loading.value = true
  },
  stopLoading: () => {
    loading.value = false
  },
  toggleColumn: (key) => {
    if (key in visibleColumns.value) {
      visibleColumns.value[key] = !visibleColumns.value[key]
    }
  }
})
// Initial load
onMounted(() => {
  if (props.autoLoad) {
    getData()
  }
})
// ... other code ...


const refreshData = () => {
  currentPage.value = 1
  searchQuery.value = ''
  getData()
  emit('refresh')
}
watch(paginatedData, (val) => {
  console.log('✅ paginatedData:', val)
})


</script>

<style lang="scss" scoped>
@use "@/assets/styles/rtytable.scss" as rtytable; // Make sure you create this file

// Update your SCSS
.rty-table-container {
  background-color: var(--bg-wrapper);
  padding:1rem;
  border-radius: 10px;
  // min-height: 100vh;
  // display: flex;
  // flex-direction: column;
  overflow: hidden;
  // justify-content: space-between;

  .main-table {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .table-head-top {
    display: flex;
    flex-direction: row-reverse; // Reverses the justify flow
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 1rem;
    width: 100%;
    padding: 0 0 1rem 0;

    &__right,
    &__left-center,
    &__center,
    &__left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__search {
      min-width: 200px;
    }

    &__reload {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
  }


  // .table-scroll-container {
  //   flex: 1;
  //   overflow: auto;
  //   max-height: v-bind('options?.scrollHeight || "500px"');

  //   table {
  //     min-width: 100%;
  //   }
  // }
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%; // or a specific height if needed
  border: 1px solid var(--nokor-w-b-1);
  border-radius: 8px;
  overflow-x: auto;
  overflow: auto; // allow both scroll-x and scroll-y
  // max-height: 500px; // adjust to your needs
  width: 100%;

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 0.75rem;
      font-size: 0.875rem;
      text-align: left;
      white-space: nowrap;
    }
  }

  .table-header {
    overflow-x: auto;
    // Force horizontal scrollbar to be consistent
    white-space: nowrap;
    display: flex;
    // overflow-x: hidden;

    table {
      min-width: 1200px; // 👈 increase for more scroll
    }

    thead {
      background-color: var(--nokor-w-b-5);
      color: var(--nokor-w-b-1);

      th {
        font-weight: 600;
        position: sticky;
        top: 0;
        background: inherit;
        z-index: 2;
      }
    }
  }

  .table-body {
    flex: 1;
    overflow-x: auto; // 👈 allow horizontal scroll
    overflow-y: auto;
    max-height: 680px; // <--- scrollable height
    background-color: var(--bg-wrapper);

    table {
      min-width: 1200px; // 👈 same as header to match and force scroll
    }

    tbody {
      tr {
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f3f4f6;
        }

        td {
          border-top: 1px solid #e5e7eb;
        }
      }

      .no-data {
        text-align: center;
        padding: 1rem;
        color: #6b7280;
      }
    }
  }
}

.loading-bar {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}

.loading-bar::before {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #3b82f6;
  animation: loading 1.5s infinite ease-in-out;
  background-image: linear-gradient(to right,
      transparent 0%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 100%);
  background-size: 200% 100%;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* Dark mode styles */
.dark .loading-bar {
  background-color: #4b5563;
}

.dark .loading-bar::before {
  background-color: #60a5fa;
}
</style>

{/* Usage example:
<RTYTblBtn :actions="[
  { type: 'view', label: 'View', onClick: () => viewUser(row.id) },
  { type: 'edit', label: 'Edit', onClick: () => editUser(row.id) }
  ]" /> */}