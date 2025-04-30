<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>
    <table v-else class="min-w-full table-auto">
      <thead class="bg-gray-100">
        <tr>
          <!-- Dynamically render table headers -->
          <th v-for="(column, index) in columns" :key="index" class="px-4 py-2 text-left">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dynamically render rows -->
        <tr v-for="(row, rowIndex) in data" :name="rowIndex" class="border-t">
          <td v-for="(column, colIndex) in columns" :name="colIndex" class="px-4 py-2">
            <!-- Check if a custom slot exists for the column name -->
            <template v-if="$slots[`cell-${column.name}`]">
              <!-- Use custom template if defined in parent -->
              <slot :name="`cell-${column.name}`" :row="row" :column="column" :index="rowIndex" />
            </template>
            <template v-else>
              <!-- Default rendering if no custom template -->
              <span>{{ row[column.name] }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  api: {
    type: String,
    required: false, // Optional if you provide custom data directly
  },
  columns: {
    type: Array,
    required: true,
    default: () => [], // Custom columns with labels and keys
  },
  data: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const loading = ref(true);
const error = ref(null);

// If no data is passed as prop, fetch data from the API
const data = ref(props.data);
if (!props.data && props.api) {
  onMounted(async () => {
    try {
      const response = await fetch(props.api);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      data.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
}
</script>

<style scoped>
.error {
  color: red;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: left;
}
</style>
