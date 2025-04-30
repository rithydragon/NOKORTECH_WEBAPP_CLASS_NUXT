<script setup>
import { ref, onMounted } from "vue";

const teachers = ref([]);
const classes = ref([]);
const selectedTeacher = ref(null);
const selectedClass = ref(null);
const message = ref("");

const fetchTeachers = async () => {
  const res = await useHttp("/api/teachers/list");
  teachers.value = await res.json();
};

const fetchClasses = async () => {
  const res = await useHttp("/api/teachings/list");
  classes.value = await res.json();
};

const assignClass = async () => {
  if (!selectedTeacher.value || !selectedClass.value) return;

  const res = await useHttp("/api/class_assign/assign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teacherId: selectedTeacher.value,
      classId: selectedClass.value,
      assignedBy: 1, // Admin ID
    }),
  });

  const data = await res.json();
  message.value = data.message;
};

onMounted(() => {
  fetchTeachers();
  fetchClasses();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Assign Class</h1>
    
    <div class="flex flex-col space-y-4 mt-4">
      <select v-model="selectedTeacher" class="border p-2 rounded">
        <option disabled value="">Select Teacher</option>
        <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.Id">
          {{ teacher.Name }}
        </option>
      </select>

      <select v-model="selectedClass" class="border p-2 rounded">
        <option disabled value="">Select Class</option>
        <option v-for="cls in classes" :key="cls.id" :value="cls.Id">
          {{ cls.Subject }}
        </option>
      </select>

      <button @click="assignClass" class="bg-blue-500 text-white p-2 rounded">Assign Class</button>

      <p v-if="message" class="text-green-500">{{ message }}</p>
    </div>
  </div>
</template>
