  <template>
    <div class="rty-table-container" :class="{ 'border rounded-lg': options?.tblBorder }">

      <!-- Table Header Slot -->
      <div v-if="$slots.header" class="flex justify-between items-center mb-4 gap-4">
        <div v-if="$slots['headerLeft']" class="flex-1">
          <slot name="headerLeft"></slot>
        </div>
        <div v-if="$slots['headerCenter']" class="flex-1 text-center">
          <slot name="headerCenter"></slot>
        </div>
        <div v-if="$slots['headerRight']" class="flex-1 flex justify-end">
          <slot name="headerRight"></slot>
        </div>
      </div>

      <!-- Built-in Table Controls -->
      <div class="flex flex-wrap items-center mb-4 gap-2">
        <!-- Left Side: Default Search -->
        <UInput v-model="searchQuery" placeholder="Search..." icon="i-heroicons-magnifying-glass"
          @update:modelValue="handleSearch" />

        <!-- Right Side: Controls -->
        <div class="flex items-center gap-2">
          <UButton icon="i-heroicons-arrow-path" :loading="loading" @click="reload" />
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-10">
        <div class="loading-bar"></div>
      </div>

      <UProgress v-if="loading" size="xs" orientation="horizontal" color="neutral" />
      <!-- Table Wrapper -->
      <div class="flex flex-col h-full">
        <!-- Table Header (outside scroll area) -->
      <div class="overflow-x-auto">
        <table ref="tableRef" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="dark:bg-gray-800">
            <tr>
              <th v-for="(column, index) in processedColumns" :key="index" scope="col"
                class="sticky top-0 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300  text-xs tracking-wider"
                
                >
                <div class="flex items-center justify-between cursor-pointer" 
                :class="{ 'cursor-pointer': column.sortable }"
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
      <div class="flex-1 overflow-x-auto overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 p-2"
            :style="{ maxHeight: options?.scrollHeight || '500px' }">
            <tr v-if="filteredData.length === 0">
              <td :colspan="processedColumns.length" class="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                <i class="ri-database-2-line"></i> {{ $t('no_data') }}
              </td>
            </tr>

        <!-- Data rows -->
        <template v-for="(row, rowIndex) in paginatedData" :key="row.id || rowIndex">
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td v-for="(column, hIndex) in columns" :key="hIndex"
                class="px-3 py-1 whitespace-nowrap text-sm">
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

    <!-- Pagination Component -->
    <div class="py-6">
      <RTYPagination 
          v-if="options?.pagination !== false && showPagination"
          v-model:current-page="pagination.currentPage"
          v-model:per-page="pagination.pageSize"
          :totalItems="pagination.totalItems"
          :totalPages="pagination.totalPages"
          :perPage-options="options?.perPageOptions || [10, 25, 50, 100]"
          @update:current-page="handlePageChange"
          @update:per-page="handlePageSizeChange"
        />
    </div>
      

      <!-- Pagination Component -->
      <!-- <RTYPagination 
      v-if="options?.pagination !== false" 
      v-model:current-page="currentPage" 
      v-model:per-page="pageSize"
        :total-items="filteredData?.length" 
        :per-page-options="options?.pageSizeOptions || [10, 25, 50,100]"
        :max-visible-pages="10" @page-changed="getData" class="mt-6" /> -->
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
  const tableData = ref({})
  const tableRef = ref(null)
  // const pageSize = ref(props.pageSize)
  const visibleColumns = ref({})
  const showPagination = ref(true)


// Reactive state
const pagination = reactive({
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10
})


  //pagination
  const paginationqqq = reactive({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
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
      // let apiConfig = {}

      // if (typeof props.api === 'string') {
      //   apiConfig = {
      //     url: props.api,
      //     method: 'GET'
      //   }
      // } else {
      //   apiConfig = {
      //     method: 'GET',
      //     ...props.api
      //   }
      // }

            // const config = {
      //   ...apiConfig,
      //   ...props.requestConfig,
      //   params: {
      //     page: currentPage.value,
      //     pageSize: pageSize.value,
      //     ...(sortKey.value && { 
      //       sort: sortKey.value,
      //       order: sortOrder.value 
      //     }),
      //     search: searchQuery.value,
      //     ...(props.requestConfig.params || {})
      //   },
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(props.requestConfig.headers || {})
      //   }
      // }

      // const { data, error } = await useHttp(config.url, config)
      // console.log("Data from API: ", data)
 
      // if (error) {
      //   throw error
      // }

      // if (!data) {
      //   throw new Error(`HTTP error! status: ${data.status}`)
      // }

      // tableData.value = data.items || data.data || data
      // totalItems.value = data.total || data.length
      // emit('loaded', tableData.value)


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

          // Process response  ||  show /hide pagination based on response
    // tableData.value = data.data || data.items || [];
    // pagination.totalItems = data.totalItems || data.total || 0;
    // pagination.totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

      // // Update pagination from backend
      // if (data.pagination) {
      //   pagination.totalItems = data.pagination.totalItems
      //   pagination.totalPages = data.pagination.totalPages
      //   pagination.currentPage = data.pagination.currentPage
      //   pagination.pageSize = data.pagination.pageSize
      // } else {
      //   // Fallback if pagination data is at root level
      //   pagination.totalItems = data.totalItems ?? data.totalElements ?? data.total
      //   pagination.totalPages = data.totalPages ?? data.totalPages
      //   pagination.currentPage = data.currentPage ?? data.number + 1
      //   pagination.pageSize = data.pageSize ?? data.size
      // }

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

  // Fetch data from API
  const getDataqq = async () => {
    loading.value = true
    try {
      const response = await useHttp(props.api, {
        method: 'POST',
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          sort: sortKey.value,
          order: sortOrder.value,
          search: searchQuery.value
        }
      })
      tableData.value = response.data
      emit('loaded', tableData.value)
      totalPages.value = response.totalPages || Math.ceil(response.total / pageSize.value)
    } catch (error) {
      tableData.value = []
      console.log('Error fetching data:', error)
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

// Handle page size change
const handlePageSizeChange1 = async (size) => {
  pagination.pageSize = size
  console.log("Page size changed to ===========: ", size)
  // Don't reset to first page automatically
  // pagination.currentPage = 1 // Reset to first page when size changes
  await getData()
}


// Handle page size change - modified version
const handlePageSizeChangessss = async (size) => {

  console.log("Page size changed to ===========: ", size) 
  // Calculate what page we should be on with the new size
  const firstItemIndex = (pagination.currentPage - 1) * pagination.pageSize
  const newPage = Math.floor(firstItemIndex / size) + 1
  
  // Update pagination
  pagination.pageSize = size
  pagination.currentPage = newPage
  
  // Fetch data with new parameters
  await getData()
}
const displayedData = computed(() => {
  return showAll.value 
    ? allData.value 
    : tableData.value;
});

// const handlePageSizeChange = async (size) => {
//   if (size === 100) {
//     showAll.value = true;
//   } else {
//     showAll.value = false;
//     // pagination.pageSize = size;
//     await getData();
//   }
// };

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



  // Computed properties
  const processedData1 = computed(() => {
    if (!data.value) return []
    return [...data.value]
  })

  const filteredData1 = computed(() => {
    if (!searchQuery.value) return processedData.value
    return processedData.value.filter(row =>
      Object.values(row).some(value =>
        value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      ))
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



  // Data processing with api url
  const filteredData22 = computed(() => {
    let result = [...tableData.value]

    // Filtering
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      )
    }

    // Sorting
    if (sortKey.value) {
      result.sort((a, b) => {
        const valA = a[sortKey.value]
        const valB = b[sortKey.value]
        return sortOrder.value === 'asc'
          ? compareValues(valA, valB)
          : compareValues(valB, valA)
      })
    }

    return result
  })


  // Computed properties with local data
  const filteredData11 = computed(() => {
    let result = [...props.data]
    
    // Apply search
    if (internalSearchQuery.value) {
      const query = internalSearchQuery.value.toLowerCase()
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(query)
        ))
    }
    
    // Apply filters
    if (Object.keys(activeFilters.value).length > 0) {
      result = result.filter(row => {
        return Object.entries(activeFilters.value).every(([key, value]) => {
          if (!value || value === 'all') return true
          return row[key] === value
        })
      })
    }
    
    return result
  })

  // Methods
  const compareValues88 = (a, b) => {
    if (a === b) return 0
    return a > b ? 1 : -1
  }


  const filteredData111 = computed(() => {
    // Choose data source: tableData (from API) or props.data (local)
    const baseData = tableData.value?.length ? tableData.value : props.data || []
    let result = [...baseData]

    // Handle search (dynamic query key)
    const query = (searchQuery.value || internalSearchQuery.value || '').toLowerCase()
    if (query) {
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      )
    }

    // Handle filters (only applies to local data props for now)
    if (Object.keys(activeFilters.value || {}).length > 0) {
      result = result.filter(row => {
        return Object.entries(activeFilters.value).every(([key, value]) => {
          if (!value || value === 'all') return true
          return row[key] === value
        })
      })
    }

    // Handle sorting
    if (sortKey.value) {
      result.sort((a, b) => {
        const valA = a[sortKey.value]
        const valB = b[sortKey.value]
        return sortOrder.value === 'asc'
          ? compareValues(valA, valB)
          : compareValues(valB, valA)
      })
    }

    return result
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
const paginatedData = computed(() => {
  // For server-side pagination, we just return all received data
  // The pagination is handled by the server
  return tableData.value
})



const paginatedData1 = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    // const end = currentPage.value * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
  })

  // Update the paginatedData computed property
  const paginatedData333 = computed(() => {
    if (!props.api) {
      // For local data
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredData.value.slice(start, end)
    } else {
      // For API data - just return the full data since API handles pagination
      return filteredData.value
    }
  })

  const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
  const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredData.value.length))

  // Methods
  const sortColumn11 = (key) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
    getData()
  }


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
  // Always reset to first page when sorting changes
  // pagination.currentPage = 1
  // getData()

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
    // Parent should handle actual reload and set loading to false
  }
  // const reload = () => {
  //   currentPage.value = 1
  //   getData()
  //   emit('refresh')
  // }


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
  // Expose methods to parent
  // defineqqExpose({
  //   reload,
  //   setLoading: (isLoading) => { loading.value = isLoading },
  //   getFilters: () => activeFilters.value,
  //   setFilters: (filters) => { activeFilters.value = filters },
  //   resetFilters: () => { activeFilters.value = {} }
  // })

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


  </script>

  <style lang="scss" scoped>
  @use "@/assets/styles/rtytable.scss" as rtytable; // Make sure you create this file
  // Update your SCSS
  .rty-table-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .table-scroll-container {
      flex: 1;
      overflow: auto;
      max-height: v-bind('options?.scrollHeight || "500px"');
      
      table {
        min-width: 100%;
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
    content: '';
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
  ]"/>  */}