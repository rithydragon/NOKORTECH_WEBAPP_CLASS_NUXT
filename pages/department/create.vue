<template>
    <div>
      <h1>Departments List</h1>
      <NuxtLink to="/departments/create">Create New Department</NuxtLink>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Name (English)</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.code }}</td>
            <td>{{ department.name }}</td>
            <td>{{ department.name_english }}</td>
            <td>{{ department.description }}</td>
            <td>
              <NuxtLink :to="`/departments/${department.id}`">View</NuxtLink>
              <button @click="deleteDepartment(department.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  const { get, remove } = useHttp();
  const departments = ref([]);
  
  // Fetch departments
  onMounted(async () => {
    departments.value = await get('/api/department/list');
  });
  
  // Delete department
  const deleteDepartment = async (id) => {
    await remove(`/api/departments/delete/${id}`);
    departments.value = departments.value.filter((department) => department.id !== id);
  };
  </script>