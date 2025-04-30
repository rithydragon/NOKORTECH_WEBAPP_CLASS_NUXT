<script setup>
import { ref, onMounted } from 'vue';

const departments = ref([]);
const showSlideover = ref(false);
const editingDepartment = ref(null);

const baseURL = 'http://localhost:5643/api/department';

// Fetch departments
const fetchDepartments = async () => {
  try {
    const response = await fetch(`${baseURL}`);
    departments.value = await response.json();
  } catch (error) {
    console.log("Error fetching departments:", error);
  }
};

onMounted(fetchDepartments);

// Open Create/Edit Slideover
const openSlideover = (department = null) => {
  editingDepartment.value = department;
  showSlideover.value = true;
};

// Delete department
const deleteDepartment = async (id) => {
  if (confirm("Are you sure you want to delete this department?")) {
    try {
      await fetch(`${baseURL}/delete/${id}`, { method: 'DELETE' });
      fetchDepartments(); // Refresh list
    } catch (error) {
      console.log("Delete failed:", error);
    }
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between">
      <h1 class="text-xl font-semibold">Departments</h1>
      <button @click="openSlideover()" class="bg-blue-500 text-white px-4 py-2 rounded">+ Add Department</button>
    </div>

    <!-- Data Table -->
    <div class="mt-4 bg-white shadow rounded-lg p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Code</th>
            <th class="p-2">Name</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in departments" :key="dept.id" class="border-b">
            <td class="p-2">{{ dept.code }}</td>
            <td class="p-2">{{ dept.nameEnglish }}</td>
            <td class="p-2 flex gap-2">
              <button @click="openSlideover(dept)" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button @click="deleteDepartment(dept.id)" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slideover Form -->
    <RTYDepartmentSlideoverForm v-if="showSlideover" :department="editingDepartment" @close="showSlideover = false" @refresh="fetchDepartments()" />
  </div>
</template>
