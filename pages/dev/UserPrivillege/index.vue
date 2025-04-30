<template>
    <div>
      <!-- Table Component -->
      <RTTable2 :api="apis" :columns="columns">
                <!-- Custom template for 'name' column -->
                <template v-slot:cell-name="{ row }">
          <strong class="bg-blue-400">{{ row.name }}</strong> <!-- Render name in bold -->
        </template>
        <template #Age>
          <strong class="bg-blue-400">{{ row.age }}</strong> <!-- Render name in bold -->
        </template>
        <!-- Custom template for 'birthday' column -->
        <template v-slot:cell-birthday="{ row }">
          <span>{{ new Date(row.birthday).toLocaleDateString() }}</span> <!-- Format birthday -->
        </template>
        <!-- Scoped slot for rendering custom actions -->
        <template #actions="{ row }">
          <button class="custom-btn" @click="handleView(row)">View</button>
          <button class="custom-btn" @click="handleEdit(row)">Edit</button>
          <button class="delete-btn" @click="handleDelete(row)">Delete</button>
        </template>
      </RTTable2>
  
      <!-- View Modal -->
      <RTModal v-if="isViewModalVisible" @close="closeViewModal">
        <template #content>
          <h3>View User Details</h3>
          <p><strong>ID:</strong> {{ currentRow?.ID }}</p>
          <p><strong>Full Name:</strong> {{ currentRow?.F_NAME_ENGLISH }} {{ currentRow?.L_NAME_ENGLISH }}</p>
          <p><strong>Email:</strong> {{ currentRow?.EMAIL }}</p>
          <p><strong>Phone Number:</strong> {{ currentRow?.PHONE_NUMBER }}</p>
          <p><strong>Role:</strong> {{ currentRow?.ROLE_NAME }}</p>
        </template>
      </RTModal>
  
      <!-- Edit Modal -->
      <RTModal v-if="isEditModalVisible" @close="closeEditModal">
        <template #content>
          <h3>Edit User</h3>
          <label for="fullName">Full Name:</label>
          <input type="text" v-model="editedRow.F_NAME_ENGLISH" placeholder="First Name">
          <input type="text" v-model="editedRow.L_NAME_ENGLISH" placeholder="Last Name">
          
          <label for="email">Email:</label>
          <input type="email" v-model="editedRow.EMAIL" placeholder="Email">
          
          <label for="phoneNumber">Phone Number:</label>
          <input type="text" v-model="editedRow.PHONE_NUMBER" placeholder="Phone Number">
          
          <label for="role">Role:</label>
          <input type="text" v-model="editedRow.ROLE_NAME" placeholder="Role">
  
          <div class="mt-4">
            <button @click="updateUser" class="custom-btn">Save Changes</button>
            <button @click="closeEditModal" class="cancel-btn">Cancel</button>
          </div>
        </template>
      </RTModal>

      <!-- Delete Confirmation Modal -->
      <RTModal v-if="isDeleteModalVisible" @close="closeDeleteModal">
        <template #content>
          <h3>Are you sure you want to delete this user?</h3>
          <p><strong>Full Name:</strong> {{ currentRow?.F_NAME_ENGLISH }} {{ currentRow?.L_NAME_ENGLISH }}</p>
          <div class="mt-4">
            <button @click="deleteUser" class="delete-btn">Yes, Delete</button>
            <button @click="closeDeleteModal" class="cancel-btn">Cancel</button>
          </div>
        </template>
      </RTModal>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const apis = 'http://localhost:7800/api/users/list';

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await $axios.get('/api/users/list'); // Adjust the endpoint if necessary
      data.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch data.';
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
  
  // Table headers
  const columns = [
    { label: 'ID', key: 'ID' },
    { label: 'Full Name', key: 'userFirstNameKhmer', render: (row) => `${row.F_NAME_ENGLISH} ${row.L_NAME_ENGLISH}` },
    { label: 'Gender', key: 'GENDER' },
    { label: 'Email', key: 'EMAIL' },
    { label: 'Phone Number', key: 'PHONE_NUMBER' },
    { label: 'Actions', key: 'actions' },
    { label: 'Username', key: 'USERNAME' },
    { label: 'Created At', key: 'CREATED_AT' },
    { label: 'Role', key: 'ROLE_NAME' }
  ];
  
  // Modal visibility states
  const isViewModalVisible = ref(false);
  const isEditModalVisible = ref(false);
  const isDeleteModalVisible = ref(false);
  
  // Current row and edited row states
  const currentRow = ref(null);
  const editedRow = ref({});
  
  // Action handlers
  const handleView = (row) => {
    currentRow.value = row;  // Set row data to display in the modal
    isViewModalVisible.value = true;  // Show the view modal
  };
  
  const handleEdit = (row) => {
    editedRow.value = { ...row };  // Create a copy of the row data for editing
    isEditModalVisible.value = true;  // Show the edit modal
  };
  
  const handleDelete = (row) => {
    currentRow.value = row;  // Set row data to display in the delete confirmation modal
    isDeleteModalVisible.value = true;  // Show the delete confirmation modal
  };
  
  // Modal close handlers
  const closeViewModal = () => {
    isViewModalVisible.value = false;
    currentRow.value = null;  // Reset row data
  };
  
  const closeEditModal = () => {
    isEditModalVisible.value = false;
    editedRow.value = {};  // Reset edited data
  };
  
  const closeDeleteModal = () => {
    isDeleteModalVisible.value = false;
    currentRow.value = null;  // Reset row data
  };
  
  // Update user method (example, assumes API exists for update)
  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:7800/api/update-user/${editedRow.value.ID}`, editedRow.value);
      alert('User updated successfully');
      closeEditModal();
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };
  
  // Delete user method (example, assumes API exists for delete)
  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:7800/api/users/${currentRow.value.ID}`);
      alert('User deleted successfully');
      closeDeleteModal();
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };
  onMounted(() => {
    fetchData();
  });

  definePageMeta({
    layout:"userprivillege-layout"
  })
  </script>
  
  <style scoped>
  .custom-btn {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .custom-btn:hover {
    background-color: #45a049;
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .delete-btn:hover {
    background-color: #e53935;
  }
  
  .cancel-btn {
    background-color: #ccc;
    color: black;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background-color: #bbb;
  }
  </style>
  