
<template>
  <table border="1">
    <thead>
      <tr>
        <th>Subject</th>
        <th>Room</th>
        <th>Date</th>
        <th>Time</th>
        <th>Students</th>
        <th>Assistants</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in tableData"  :key="index">
        <!-- <td><input v-model="row.subject" @input="markAsEdited(row)" :disabled="row.isEditing" /></td> -->
        <td><input v-model="row.subject" :disabled="!row.isEditing" /></td>
        <td><input v-model="row.room" :disabled="!row.isEditing" /></td>
        <td><input v-model="row.date" type="date" :disabled="!row.isEditing" /></td>
        <td><input v-model="row.time" :disabled="!row.isEditing" /></td>
        <td><input v-model="row.students" type="number" :disabled="row.isEditing" /></td>
        <td><input v-model="row.assistants" type="number" :disabled="row.isEditing" /></td>
        <td>
          <button v-if="row.isEditing" @click="saveData(row, index)">Save</button>
          <button v-else @click="editRow(row)">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <button @click="addRow">Add Row</button>
  <button @click="saveAllData" :disabled="editedRows.size === 0">Save All</button>
</template>
<script setup>
import { ref, onMounted } from 'vue';

// Data Model
const tableData = ref([]);
const editedRows = ref(new Set());

// Fetch Data from API on Load
const fetchTeachings = async () => {
  try {
    const res = await fetch("http://localhost:5643/api/teachings/list");
    const data = await res.json();
    tableData.value = data.map(item => ({
      id: item.Id,
      subject: item.Subject,
      room: item.Room,
      date: item.Date,
      time: item.Time,
      students: item.Students,
      assistants: item.Assistants,
      isEditing: false
    }));
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

// Add New Row
const addRow = () => {
  tableData.value.push({
    id: null, subject: '', room: '', date: '', time: '', students: '', assistants: '', isEditing: true
  });
};

// // Track Edited Rows
// const markAsEdited = (row) => {
//   editedRows.value.add(row);
// };

// Save or Update Data
const saveData = async (row, index) => {
  try {
    const apiUrl = row.id 
      ? `http://localhost:5643/api/teaching/update/${row.id}` 
      : "http://localhost:5643/api/teaching/create";
    
    const method = row.id ? "PUT" : "POST";

    const res = await fetch(apiUrl, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    const data = await res.json();
    console.log(data.message);

    row.isEditing = false;
    if (!row.id) {
      await fetchTeachings(); // Refresh Data After Adding
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

// Save All Edited Data
const saveAllData = async () => {
  if (editedRows.value.size === 0) return;

  try {
    const dataToSave = Array.from(editedRows.value);

    const res = await fetch("http://localhost:5643/api/teaching/update_all", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });

    const data = await res.json();
    console.log(data.message);

    // Reset editing state
    editedRows.value.clear();
    fetchTeachings();
  } catch (error) {
    console.log("Error saving all:", error);
  }
};

// Toggle Edit Mode
const editRow = (row) => {
  row.isEditing = true;
};

// Load Data on Component Mount
onMounted(fetchTeachings);
definePageMeta({ layout: 'layout', middleware: ['auth'], role: "teacher" });
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: center;
}
input {
  width: 100%;
  padding: 5px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
}

table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; text-align: center; }
input { width: 100%; padding: 5px; }
button { margin-top: 10px; padding: 5px 10px; }
</style>
