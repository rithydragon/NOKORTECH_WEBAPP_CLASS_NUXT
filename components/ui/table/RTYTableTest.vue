<template>
  <div class="rty-table-container" :style="{ height: options?.height || '100%' }">
    <!-- Loading Indicator -->
    <UProgress v-if="loading" size="xs" orientation="horizontal" color="neutral" />

    <!-- Table Structure using CSS Grid -->
    <div class="grid-container">
      <!-- Table Header -->
      <div class="grid-header">
        <div 
          v-for="(column, index) in visibleProcessedColumns" 
          :key="'header-'+index"
          class="grid-cell header-cell"
          :style="{ gridColumn: index + 1 }"
          :class="column.headerClass"
        >
          <div class="cell-content">
            <span>{{ column.label }}</span>
            <i 
              v-if="sortKey === column.key" 
              class="sort-icon"
              :class="sortOrder === 'asc' ? 'ri-arrow-drop-up-fill' : 'ri-arrow-drop-down-fill'"
            ></i>
          </div>
        </div>
      </div>

      <!-- Table Body - Scrollable Area -->
      <div class="grid-body">
        <!-- Loading State -->
        <div 
          v-if="loading && tableData?.length === 0" 
          class="loading-state"
          :style="{ gridColumn: `1 / span ${visibleProcessedColumns?.length}` }"
        >
          <USpinner class="mr-2" />
          <span>Loading data...</span>
        </div>

        <!-- Empty State -->
        <div 
          v-else-if="filteredData?.length === 0" 
          class="empty-state"
          :style="{ gridColumn: `1 / span ${visibleProcessedColumns?.length}` }"
        >
          <i class="ri-database-2-line"></i> {{ $t('no_data') }}
        </div>

        <!-- Data Rows -->
        <template v-for="(row, rowIndex) in displayedData" :key="row.id || rowIndex">
          <div 
            v-for="(column, colIndex) in visibleProcessedColumns" 
            :key="`row-${rowIndex}-col-${colIndex}`"
            class="grid-cell body-cell"
            :style="{ gridColumn: colIndex + 1 }"
            :class="[getColumnClasses(column, row), getRowClasses(row)]"
          >
            <div class="cell-content">
              <template v-if="column.key === 'actions'">
                <slot name="actions" :row="row"></slot>
              </template>
              <template v-else-if="column.slot">
                <slot :name="`cell-${column.key}`" :row="row"></slot>
              </template>
              <template v-else-if="column.render">
                {{ column.render(row) }}
              </template>
              <template v-else>
                {{ row[column.key] || '-' }}
              </template>
            </div>
          </div>
        </template>
      </div>

      <!-- Fixed Footer -->
      <div class="grid-footer">
        <RTYPagination
          v-if="options?.pagination !== false"
          v-model:current-page="currentPage" 
          v-model:per-page="perPage" 
          :total-items="filteredData?.length"
          :per-page-options="options?.perPageOptions || [10, 25, 50, 100]"
          :fixed-row-count="options?.fixedRowCount || 10"
          :max-visible-pages="7" 
          @page-changed="getData" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (cols) => cols.every(col => col.key && col.label)
  },
  data: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({
      height: '600px',
      pagination: true,
      loading: true,
      fixedRowCount: 10,
      columnVisibility: true
    })
  }
})

// Reactive state and methods remain the same as previous implementation
// ...
</script>

<style scoped>
.rty-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.grid-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}

.grid-header {
  display: grid;
  grid-template-columns: repeat(v-bind('visibleProcessedColumns.length'), minmax(100px, 1fr));
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--bg-color-header);
}

.grid-body {
  display: grid;
  grid-template-columns: repeat(v-bind('visibleProcessedColumns.length'), minmax(100px, 1fr));
  overflow-y: auto;
  height: 100%;
}

.grid-cell {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.grid-cell:last-child {
  border-right: none;
}

.header-cell {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--text-color-header);
  background-color: var(--bg-color-header);
}

.body-cell {
  font-size: 0.875rem;
  color: var(--text-color-body);
  background-color: var(--bg-color-body);
}

.body-cell:hover {
  background-color: var(--bg-color-hover);
}

.grid-footer {
  position: sticky;
  bottom: 0;
  background-color: var(--bg-color-body);
  border-top: 1px solid var(--border-color);
  padding: 12px;
  z-index: 10;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  grid-column: 1 / -1;
}

.sort-icon {
  margin-left: 4px;
}

/* Dark mode variables */
:root {
  --bg-color-header: #f9fafb;
  --bg-color-body: #ffffff;
  --bg-color-hover: #f3f4f6;
  --text-color-header: #6b7280;
  --text-color-body: #4b5563;
  --border-color: #e5e7eb;
}

.dark {
  --bg-color-header: #1f2937;
  --bg-color-body: #111827;
  --bg-color-hover: #1e293b;
  --text-color-header: #9ca3af;
  --text-color-body: #d1d5db;
  --border-color: #374151;
}
</style>