<template>
    <div>
      <h1>Student Report</h1>
      
      <div class="actions">
        <button @click="fetchStudents">Refresh</button>
        <button @click="exportToExcel" :disabled="loading">
          Export to Excel
        </button>
        <input 
          type="file" 
          @change="handleFileImport" 
          accept=".xlsx,.xls" 
          :disabled="loading"
        />
      </div>
      
      <div v-if="loading">Loading data...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else>
        <table class="student-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Course</th>
              <th>Department</th>
              <th>Status</th>
              <th>Scores</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.ID">
              <td>{{ student.StudentCode }}</td>
              <td>{{ student.StudentName }}</td>
              <td>{{ student.StudentEmail }}</td>
              <td>{{ student.class_name || '-' }}</td>
              <td>{{ student.course_name || '-' }}</td>
              <td>{{ student.department_name || '-' }}</td>
              <td>{{ student.STATUS ? 'Active' : 'Inactive' }}</td>
              <td>
                <ul v-if="student.scores && student.scores.length">
                  <li v-for="score in student.scores" :key="score.ID">
                    {{ score.subject_name }}: {{ score.SCORE }}
                  </li>
                </ul>
                <span v-else>No scores</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useStudentStore } from '~/stores/studentStore';
  
  const studentStore = useStudentStore();
  const { students, loading, error, fetchStudents, exportToExcel, importStudents } = studentStore;
  
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importStudents(file);
      event.target.value = ''; // Reset input
    }
  };
  
  // Fetch initial data
  onMounted(() => {
    fetchStudents();
  });


  definePageMeta( { layout:'layout', middleware: 'auth'})
  </script>
  
  <style scoped>
  .actions {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }
  
  .student-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .student-table th, .student-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .student-table th {
    background-color: #f2f2f2;
  }
  
  .error {
    color: red;
  }
  </style>