<template>
  <RTModal v-if="isModalOpen" :show="isModalOpen" :mode="modalMode" :message="confirmMessage" :modalTitle="modalMode"
    actionLabel="Save" :actionButtons="[
      { label: $t('close'), event: 'close', class: 'bg-gray-500 text-white' },
      { label: $t('print'), event: 'delete', class: 'bg-red-500 text-white' },
      { label: $t('save'), event: 'save', class: 'bg-green-500 text-white' }
    ]" :hideFooter="false" :width="'90vw'" :height="'95vh'" :disabled="true" :data="modalData" @close="closeModal"
    @submit="handleSubmit" @confirm="handleConfirm" @delete="handleDelete" @save="handleSave">
    <template #default="{ data }">
      <header class="w-full items-center">
        <div class="text-center mb-6 w-full flex justify-end">
          <div>
            <h1 class="text-lg font-bold khmer-moul">{{ $t('kingdom_of_cambodia') }}</h1>
            <h1 class="text-gray-600">{{ $t('nation_religion_king') }}</h1>
          </div>
        </div>
        <div class="text-center mb-6 w-full flex justify-start">
          <div>
            <h1 class="text-lg font-bold">{{ $t('moeys') }}</h1>
            <h1 class="text-gray-600">{{ $t('school') }} {{ $t('school_name') }}</h1>
          </div>
        </div>
      </header>

      <div class="flex flex-col justify-center items-center">
        <div class="flex-1 gap-2 text-center items-center">
          <div class="text-center pb-4">
            <h1 class="text-lg font-bold">{{ $t('student_score_record_list') }}</h1>
          </div>
          <div class="flex gap-[20px] justify-center">
            <div class="flex items-center">
              <h1>{{ $t('major') }} : Mojor</h1>
            </div>
            <div class="flex items-center">
              <h1>{{ $t('subject') }} : Subject</h1>
            </div>
          </div>
          <div class="flex gap-[20px]  justify-center">
            <div class="flex items-center">
              <h1>{{ $t('group') }} : Group</h1>
            </div>
            <div class="flex items-center">
              <h1>{{ $t('batch') }} : Batch </h1>
            </div>
            <div class="flex items-center">
              <h1>{{ $t('time') }} : Time</h1>
            </div>
          </div>
          <div class="flex gap-[20px]  justify-center">
            <div class="flex items-center">
              <h1>{{ $t('academic_year') }} : Group</h1>
            </div>
            <div class="flex items-center">
              <h1>{{ $t('semester') }} : Batch</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between pb-3">
        <button>{{ $t('goto_telegram_group') }}</button>
        <div class="flex gap-2 items-center">
          <button>{{ $t('export_as_excel') }}</button>
          <button>{{ $t('import') }}</button>
        </div>
      </div>


      <div class="attendance-management">
        <!-- Header Section -->
        <div class="header-section">
          <h1 class="page-title">
            <i class="ri-user-3-fill"></i> Student Attendance Management
          </h1>
          <div class="date-display">
            <i class="ri-calendar-2-fill"></i> {{ currentDate }}
          </div>
        </div>

        <!-- Main Content -->
        <div class="attendance-content">
          <!-- Attendance Form Card -->
          <div class="attendance-card">
            <div class="card-header">
              <h2>
                <i class="ri-clipboard-fill"></i> Record Daily Attendance
              </h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitAttendance" class="attendance-form"
                :class="{ 'form-disabled': isSubmitting }">
                <fieldset :disabled="isSubmitting">
                  <div class="form-grid" :class="{ 'form-disabled': isSubmitting }">

                    <!-- Student Select -->
                    <div class="form-group">
                      <label for="student" class="form-label">
                        <i class="ri-user-line"></i> {{ $t('student') }}
                      </label>
                      <USelect id="student" v-model="attendance.studentId" :options="studentOptions"
                        option-attribute="label" placeholder="Select student" required class="form-control" />
                    </div>

                    <!-- Date Picker -->
                    <div class="form-group">
                      <label for="date" class="form-label">
                        <i class="ri-calendar-line"></i> {{ $t('date') }}
                      </label>
                      <UInput type="date" id="date" v-model="attendance.date" required class="form-control" />
                    </div>

                    <!-- Attendance Type -->
                    <div class="form-group">
                      <label for="type" class="form-label">
                        <i class="ri-list-check-2"></i> {{ $t('attendance_type') }}:
                      </label>
                      <USelect id="type" v-model="attendance.typeId" :options="attendanceTypeOptions"
                        placeholder="Select status" required class="form-control" />
                    </div>

                    <!-- Notes -->
                    <div class="form-group full-width">
                      <label for="notes" class="form-label">
                        <i class="ri-sticky-note-line"></i> {{ $t('note') }}
                      </label>
                      <UTextarea id="notes" v-model="attendance.notes" placeholder="Additional notes (optional)"
                        class="form-control" />
                    </div>
                  </div>

                  <div class="form-actions">
                    <UButton type="submit" color="primary" icon="ri-check-line" :loading="isSubmitting">
                      {{ editingId ? $t('update') : $t('submit') }} {{ $t('attendance') }}
                    </UButton>
                    <UButton  @click="resetForm" color="gray" variant="ghost" icon="ri-close-line">
                      {{ editingId ? $t('cancel') : $t('reset') }}
                    </UButton>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>

          <!-- Today's Attendance Card -->
          <div class="attendance-card">
            <div class="card-header">
              <h2>
                <i class="ri-list-check-3"></i> {{ $t('today_attendance_record') }}
              </h2>
              <div class="card-actions">
                <UInput v-model="searchQuery" :placeholder="$t('searching...')" icon="ri-search-line"
                  class="search-input" />
                <UButton icon="ri-refresh-line" @click="fetchTodaysAttendance" :loading="isLoading" color="gray"
                  variant="ghost" />
              </div>
            </div>
            <div class="card-body">
              <div class="attendance-table-container">
                <USkeleton v-if="isLoadingAttendance" class="h-40 rounded-lg" />
                <div v-if="isLoadingAttendance" class="table-loading-overlay">
                  <div class="spinner"></div>
                  <p>Loading attendance records...</p>
                </div>
                <table v-else class="attendance-table">
                  <thead>
                    <tr>
                      <th>{{ $t('student') }}</th>
                      <th>{{ $t('status') }}</th>
                      <th>{{ $t('note') }}</th>
                      <th>{{ $t('action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(record,index) in filteredAttendance" :key="record.AttendanceId">
                      <td class="student-cell">
                        <div class="student-info">
                          <RTYAvatar size="30" />
                          <div class="flex flex-col">
                            <div class="student-code">{{ record.StudentName || '...' }}</div>
                            <div class="student-name">{{ record.StudentCode || '...' }}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <UBadge :label="record.AttendanceType" :color="getStatusColor(record.AttendanceCode)" class="status-badge" />
                      </td>
                      <td class="notes-cell">
                        <div v-if="record.AttendanceNotes" class="notes-content">
                          {{ record.AttendanceNotes }}
                        </div>
                        <div v-else class="no-notes">
                          <i class="ri-sticky-note-line"></i> {{ $t('no_notes') }}
                        </div>
                      </td>
                      <td class="actions-cell">
                        <UButton @click="editAttendance(record,index)" icon="ri-pencil-line" color="blue" variant="ghost" size="sm" class="action-btn" />
                        <UButton @click="actionAttendance(record.AttendanceId,record)" icon="ri-delete-bin-line" color="red" variant="ghost" size="sm" class="action-btn" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty State -->
                <div v-if="filteredAttendance.length === 0" class="empty-state">
                  <i class="ri-user-unfollow-line"></i>
                  <p>{{ $t('no_attendance_records_found_for_today!') }}</p>
                  <UButton @click="fetchTodaysAttendance" icon="ri-refresh-line" color="primary" variant="soft">
                    Refresh
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Delete Confirmation Modal -->
        <UModal v-model="isDeleteModalOpen">
          <UCard>
            <template #header>
              Confirm Deletion
            </template>

            <p>{{ $t('are_you_sure_want_to_delete_this_record') }}</p>

            <template #footer>
              <div class="modal-actions">
                <UButton @click="isDeleteModalOpen = false" color="gray" variant="ghost">
                  Cancel
                </UButton>
                <UButton @click="deleteAttendance" color="red" icon="ri-delete-bin-line" :loading="isDeleting">
                  Delete Record
                </UButton>
              </div>
            </template>
          </UCard>
        </UModal>
      </div>

      <SystemStudentAttendanceList :attendanceType="attendanceTypes"/>

      <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
        <p class="font-semibold">{{ tBy({ en: "Note:", km: "ចំណាំ:" }) }}</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>
            <strong>{{ tBy({ en: "Verify your entry", km: "ផ្ទៀងផ្ទាត់ការបញ្ចូលរបស់អ្នក" }) }}</strong>
          </li>
          <li>
            {{ tBy({
              en: "After submitting the entry, you cannot update it.", km:
                "បន្ទាប់ពីដាក់បញ្ចូលអ្នកមិនអាចធ្វើបច្ចុប្បន្នភាពបានទេ។"
            }) }}
          </li>
          <li>
            {{ tBy({
              en: "Submit your entry only after you have completed all students.", km:
                "សូមដាក់បញ្ចូលបន្ទាប់ពីអ្នកបានបញ្ចប់និស្សិតទាំងអស់។"
            }) }}
          </li>
          <li>
            <strong>{{ tBy({ en: "Importing Excel scores", km: "ការនាំចូលពិន្ទុ Excel" }) }}</strong>
            {{ 
            tBy({ en: "is only supported for Excel files exported from the list.", km: "គាំទ្រតែឯកសារ Excel ដែលនាំចេញពីបញ្ជីប៉ុណ្ណោះ។" }) }}
          </li>
        </ul>
      </div>
      <div class="p-4">
        <h2 class="font-bold text-lg">{{ tBy({ en: "Note", km: "ចំណាំ" }) }}</h2>
        <ul class="list-disc pl-5">
          <li>{{ tBy({ en: "Verify your entry!", km: "ផ្ទៀងផ្ទាត់ការបញ្ចូលរបស់អ្នក!" }) }}</li>
          <li>{{ tBy({
            en: "You cannot update after submission.", km:
              "អ្នកមិនអាចធ្វើបច្ចុប្បន្នភាពបន្ទាប់ពីដាក់ស្នើបានទេ។"
          }) }}</li>
          <li>{{ tBy({
            en: "Submit after all records are done.", km:
              "ដាក់ស្នើបន្ទាប់ពីការកត់ត្រាទាំងអស់ត្រូវបានបញ្ចប់។"
          }) }}</li>
          <li>{{ tBy({ en: "Teaching session should not exceed 30!", km: "សម័យបង្រៀនមិនអាចលើសពី 30 បានទេ!" })
          }}</li>
        </ul>

        <h3 class="mt-4 text-xl text-orange-600">
          {{ tBy({ en: "Grand total teaching hours 45/45", km: "ម៉ោងបង្រៀនសរុប 45/45" }) }}
        </h3>

        <h4 class="mt-4 text-gray-600">{{ tBy({ en: "Color Note", km: "ចំណាំពណ៌" }) }}</h4>
        <ul>
          <li class="text-blue-500">{{ tBy({ en: "Blue: Submitted", km: "ខៀវ: បានដាក់ស្នើ" }) }}</li>
          <li class="text-cyan-500">{{ tBy({ en: "Cyan: Accepted", km: "ក្បៀស: អ្នកបានទទួល" }) }}</li>
          <li class="text-red-500">{{ tBy({ en: "Red: Rejected", km: "ក្រហម: មិនទទួលយក" }) }}</li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center gap-2">
        <button @click="closeModal" class="bg-green-500 text-white px-4 py-2 rounded">{{ $t('close') }}</button>
        <button @click="print" class="bg-green-500 text-white px-4 py-2 rounded">{{ $t('print') }}</button>
        <button @click="handleSave" class="bg-red-500 text-white px-4 py-2  rounded">{{ $t('save') }}</button>
      </div>
    </template>
  </RTModal>
</template>

<script setup>

import { computed } from 'vue';
const toast = useToast()
const { t } = useI18n()
const { confirm } = useConfirm(); // Make sure to import useConfirm
defineProps({
  isModalOpen: Boolean,
  modalMode: String,
  modalData: Object,
  confirmMessage: String,
});

function exportExcel(a) {
  console.log(a)
}
const emit = defineEmits(["close", "submit", "confirm"]);

// Methods for handling events
const closeModal = () => emit("close");
const handleSubmit = () => emit("submit", modalData);
const handleConfirm = () => emit("confirm", modalData);

const editingId = ref(null)
const isSubmitting = ref(false)
const todaysAttendance = ref([])
const isLoading = ref(false)
const isDeleteModalOpen = ref(false)
const recordToDelete = ref(null)
const isDeleting = ref(false)
const searchQuery = ref('')
const studentList = ref([])
const attendanceTypes = ref([])

const attendance = ref({
  studentId: null,
  date: new Date().toISOString().split('T')[0],
  typeId: null,
  notes: ''
});

// Fetch initial data
onMounted(async () => {
  await fetchStudents();
  await fetchAttendanceTypes();
  await fetchTodaysAttendance();
});

async function fetchStudents() {
  const { data, error } = await useHttp('/api/student/list', {
    method: 'POST'
  });
  studentList.value = data
}

async function fetchAttendanceTypes() {
  const { data, error } = await useHttp('/api/attendance_type/list', {
    method: 'POST',
  });

  if (data) {
    attendanceTypes.value = data;
  } else {
    console.log("Failed to fetch attendance types:", error);
  }
}

const attendanceTypeOptions = computed(() => {
  return attendanceTypes.value.map(type => ({
    value: type.Id,   // Use exact case-sensitive keys as returned from API
    label: type.Name
  }));
});

const isLoadingAttendance = ref(false);

// async function fetchTodaysAttendance() {
//   const today = new Date().toISOString().split('T')[0];
//   const {data, error} = await use(`/api/attendance/date/${today}`);
//   todaysAttendance.value = data
// }

const fetchTodaysAttendance = async () => {
  isLoading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    console.log("Today:", today)

    const {data,error} = await useHttp('/api/student_attendance/daily_record', {
      method: "POST",
      data: { Date: today }  // 🔹 Send the date in request body
    })
    console.log("Attendance Data:", data)

    if (data) {
      todaysAttendance.value = data.attendance
    } else {
      console.log("Error fetching attendance:", error)
    }
  } finally {
    isLoading.value = false
  }
}

const editAttendance = (record,i) => {

  editingId.value = i+1
  attendance.value = {
    studentId: record.StudentId,
    date: rtydate(record.AttendanceDate).format('yyyy-MM-dd'),
    typeId: record.AttendanceTypeId,
    notes: record.AttendanceNotes
  }
  // Scroll to form
  document.querySelector('.attendance-form')?.scrollIntoView({ behavior: 'smooth' })
}

async function deleteAttendance(id) {
  console.log("Id to delete ; ", id)
    const { data, error } = await useHttp(`/api/student_attendance/delete`, {
      method: 'GET',
      data: { Id: id }
    });
    if(error) toast.add({color:error.message || 'Delete failed!'})
    if (data) {
      toast.add({color:'green', title:'Delete successfully!'})
      await fetchTodaysAttendance();
    }
}

const actionAttendance = async (id,data) => {
  console.log("Delete row data  index -----: ", id)
  console.log("data Delete row data  index -----: ", data)

  const isConfirmed = await confirm({
    type: 'warning',
    title: t('do_you_want_to_delete_', { value: tBy({en:data.StudentEnglishName,km:data.StudentName }) || '...' }),
    description: t('this_action_cannot_be_undone'), // Optional description
    confirmText: t('delete'), // Optional button text
  });

  if (isConfirmed) {
    try {
      await deleteAttendance(id)
      reloadTable()
    } catch (err) {
      toast.add({color:'red', title:('Delete error:', err)})
    }
  }

  // if (!confirm('Are you sure you want to delete this score?')) {

  // }
};

const mappedData = {
  student_id: attendance.value.studentId,
  attendance_date: attendance.value.date,
  attendance_type_id: attendance.value.typeId,
  notes: attendance.value.notes
};

const submitAttendance = async () => {
  isSubmitting.value = true;
  try {
    const payload = { ...attendance.value };
    console.log("Payload ---------------------->>>>>>>>>>>", payload)
    console.log("editingId.value --------------===========", editingId.value)

    // Add the ID when editing
    if (editingId.value) {
      payload.id = editingId.value;
      console.log("payload id ", payload.id)
    }

//     const mappedData = {
//   student_id: attendance.value.studentId,
//   attendance_date: attendance.value.date,
//   attendance_type_id: attendance.value.typeId,
//   notes: attendance.value.notes
// };

    const { data, error } = await useHttp(
      editingId.value
        ? '/api/student_attendance/update'
        : '/api/student_attendance/create',
      {
        method: "POST",
        data: payload
      }
    );
    if(data){
      toast.add({color:'green', title:editingId.value ? 'Edit successfully!' : 'Create successfully!'})
    }

    if (error) {
      toast.add({color:'red',title:("Submit Error----------------:", error)})
      console.log("Submit Error----------------:", error);
      return;
    }

    resetForm();
    await fetchTodaysAttendance();
  } catch (err) {
    toast.add({color:'red',title:("Unexpected error:", err)})
    console.log("Unexpected error:", err);
  } finally {
    isSubmitting.value = false;
  }
};


// const deleteAttendance = async () => {
//   isDeleting.value = true
//   try {
//     await deleteAttendanceRecord(recordToDelete.value)
//     await fetchTodaysAttendance()
//     isDeleteModalOpen.value = false
//   } finally {
//     isDeleting.value = false
//   }
// }

const resetForm = () => {
  editingId.value = null
  attendance.value = {
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    typeId: '',
    notes: ''
  }
}

// Computed properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const studentOptions = computed(() => {
  return studentList.value.map(student => {
    const name = student?.StudentNameEnglish || student?.StudentName || 'Unnamed'
    const label = `${name} - ${student?.StudentCode}`
    return {
      value: student.Id,
      label
    }
  })
})

const filteredAttendance = computed(() => {
  if (!searchQuery.value) return todaysAttendance.value
  const query = searchQuery.value?.toLowerCase();
  return todaysAttendance.value.filter(record =>
    record.StudentName.toLowerCase().includes(query) ||
    record.StudentNameEnglish.toLowerCase().includes(query) ||
    record.StudentCode.toLowerCase().includes(query))
})

// Methods
const getStatusColor = (code) => {
  switch (code) {
    case 'PRESENT': return 'green'
    case 'ABSENT': return 'red'
    case 'LATE': return 'yellow'
    case 'EXCUSED': return 'blue'
    default: return 'gray'
  }
}

async function reloadTable(){
  await fetchTodaysAttendance()
}
const confirmDelete = (id) => {
  recordToDelete.value = id
  isDeleteModalOpen.value = true
}

// Lifecycle hooks
onMounted(async () => {
  await fetchTodaysAttendance()
})
// Load Data on Component Mount
definePageMeta({ layout: 'layout', middleware: ['auth'], role: "teacher" });

</script>
<style lang="scss" scoped>
:root {
  --bg-card: #ffffff;
  --border-color: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  /* ... other variables ... */
}

.dark {
  --bg-card: #1f2937;
  --border-color: #374151;
  --text-primary: #f9fafb;
  /* ... dark mode variants ... */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
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

table {
  width: 100%;
  border-collapse: collapse;

  thead>tr>td {
    font-size: 13px;
  }

  tbody>tr>td {
    font-size: 14px;
  }

}

th,
td {
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


/* Base container styles */
.attendance-management {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 0;
}

/* Header section */
.header-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  gap: 1rem;
}

@media (min-width: 768px) {
  .header-section {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Page title */
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 1.875rem;
  }
}

/* Date display */
.date-display {
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Main content layout */
.attendance-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .attendance-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Card styles */
.attendance-card {
  background-color: var(--bg-card);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

/* Card header */
.card-header {
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .card-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Card actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 640px) {
  .card-actions {
    width: auto;
  }
}

.search-input {
  min-width: 12.5rem;
}

/* Card body */
.card-body {
  padding: 1.5rem;
}

/* Form styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-control {
  width: 100%;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Table styles */
.attendance-table-container {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table thead {
  background-color: var(--bg-table-header);
}

.attendance-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.attendance-table tbody {
  background-color: var(--bg-card);
}

.attendance-table td {
  text-align: left;
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--text-primary);
  border-top: 1px solid var(--border-color);
}

/* Specific cell styles */
.student-cell {
  white-space: nowrap;
}

.student-info {
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: start;
}

.student-name {
  font-weight: 500;
  color: var(--text-primary);
}

.student-code {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.notes-cell {
  max-width: 20rem;
}

.notes-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-notes {
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge {
  text-transform: capitalize;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: inline-flex;
}

/* Empty state */
.empty-state {
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-secondary);
  gap: 0.75rem;
}

.empty-state i {
  font-size: 2.25rem;
}

.empty-state p {
  font-size: 0.875rem;
}

/* Modal actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Status colors */
.present {
  background-color: var(--bg-present);
  color: var(--text-present);
}

.absent {
  background-color: var(--bg-absent);
  color: var(--text-absent);
}

.late {
  background-color: var(--bg-late);
  color: var(--text-late);
}

.excused {
  background-color: var(--bg-excused);
  color: var(--text-excused);
}

/* Dark mode variants */
.dark .present {
  background-color: var(--bg-present-dark);
  color: var(--text-present-dark);
}

.dark .absent {
  background-color: var(--bg-absent-dark);
  color: var(--text-absent-dark);
}

.dark .late {
  background-color: var(--bg-late-dark);
  color: var(--text-late-dark);
}

.dark .excused {
  background-color: var(--bg-excused-dark);
  color: var(--text-excused-dark);
}

.attendance-container {
  max-width: 1200px;
  margin: 0 auto;

  .attendance-form,
  .attendance-list {
    background: #f9f9f9;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    select,
    input,
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    textarea {
      min-height: 80px;
    }
  }

  button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background: #45a049;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .p {
      color: #4CAF50;
    }

    .a {
      color: #F44336;
    }

    .l {
      color: #FFC107;
    }
  }
}

.attendance-card {
  position: relative;
  
  .form-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .attendance-form {
    transition: opacity 0.3s ease;
  }

  .attendance-table-container {
    position: relative;

    .table-loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #ddd;
        border-top-color: #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      p {
        margin-top: 0.5rem;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
