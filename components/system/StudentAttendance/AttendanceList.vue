
<template>
    <div class="attendance-container">
      <UCard class="mb-6">
        <template #header>
          <h1 class="text-2xl font-bold">Attendance by Date Range</h1>
        </template>

        <!-- Date Range Picker -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <UFormGroup label="Start Date" class="flex-1">
            <UInput 
              type="date" 
              v-model="startDate"
              icon="i-heroicons-calendar-days-20-solid"
            />
          </UFormGroup>

          <UFormGroup label="End Date" class="flex-1">
            <UInput 
              type="date" 
              v-model="endDate"
              icon="i-heroicons-calendar-days-20-solid"
            />
          </UFormGroup>
  
          <div class="self-end">
            <UButton
              @click="fetchAttendance"
              :loading="loading"
              icon="i-ri-search-line"
            >
              Search
            </UButton>
          </div>
        </div>
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
  <UFormGroup label="Class" class="min-w-[200px]">
    <USelect
      v-model="classes.Id"
      :options="classOptions"
      :placeholder="$t('all_class')"
      option-attribute="Room"
      value-attribute="ClassId"
      icon="i-ri-building-line"
      clearable
      clear-icon="i-ri-close-line"
       @clear="handleStatusClear"
    />
  </UFormGroup>

  <UFormGroup label="Status" class="min-w-[200px]">
    <USelect
    v-model="selectedStatus"
      :options="attendanceTypeOptions"
      option-attribute="name"
      value-attribute="attendanceTypeId"
      placeholder="Select Status"
      icon="i-ri-list-check-2"
      clearable
      clear-icon="i-ri-close-line"
      @clear="handleStatusClear"
    />
  </UFormGroup>
</div>

      </UCard>

      <!-- Results Section -->
      <UCard>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Records" 
            :value="summary.totalRecords" 
            icon="i-ri-database-2-line" 
            color="blue"
          />
          <StatCard 
            title="Present" 
            :value="summary.presentCount" 
            icon="i-ri-checkbox-circle-line" 
            color="green"
          />
          <StatCard 
            title="Absent" 
            :value="summary.absentCount" 
            icon="i-ri-close-circle-line" 
            color="red"
          />
          <StatCard 
            title="Attendance Rate" 
            :value="`${summary.attendanceRate}%`" 
            icon="i-ri-line-chart-line" 
            color="purple"
          />
        </div>

        <!-- Attendance Table -->
        <UTable 
          :rows="paginatedRecords"
          :columns="columns"
          :loading="loading"
        >
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12">
              <UIcon name="i-ri-database-line" class="text-4xl text-gray-400 mb-4" />
              <p class="text-gray-500">No attendance records found</p>
              <UButton 
                v-if="!loading"
                @click="fetchAttendance"
                variant="ghost"
                class="mt-4"
                icon="i-ri-refresh-line"
              >
                Refresh Data
              </UButton>
            </div>
          </template>

          <template #AttendanceDate-data="{ row }">
            <div class="flex items-center gap-2">
              <p class="font-medium">
                {{ row.AttendanceDate ? rtydate(row.AttendanceDate).format('MMM dd, yyyy') : 'No Date' }}
              </p>
            </div>
          </template>

          <template #student-data="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar 
                :text="getInitials(row.StudentName)" 
                size="sm"
                class="flex-shrink-0"
              />
              <div>
                <p class="font-medium">{{ row.StudentName }}</p>
                <p class="text-gray-500 text-xs">{{ row.StudentCode }}</p>
              </div>
            </div>
          </template>
  
          <template #status-data="{ row }">
            <UBadge 
              :label="row.AttendanceType"
              :color="getStatusColor(row.AttendanceType)"
              variant="subtle"
            />
          </template>

          <template #actions-data="{ row }">
            <div class="flex gap-2">
              <UButton
                @click="openEditModal(row)"
                icon="i-ri-edit-line"
                color="gray"
                variant="ghost"
                size="xs"
                :ui="{ rounded: 'rounded-full' }"
                aria-label="Edit"
              />
              <UButton
                @click="confirmDelete(row.AttendanceId)"
                icon="i-ri-delete-bin-line"
                color="red"
                variant="ghost"
                size="xs"
                :ui="{ rounded: 'rounded-full' }"
                aria-label="Delete"
              />
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex justify-end mt-4">
          <UPagination
            v-model="currentPage"
            :page-count="pageSize"
            :total="filteredRecords.length"
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: '!rounded-full min-w-8 h-8',
              default: {
                activeButton: {
                  variant: 'outline'
                }
              }
            }"
          >
            <template #prev="{ onClick }">
              <UTooltip text="Previous page">
                <UButton
                  icon="i-ri-arrow-left-s-line"
                  color="gray"
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                  class="h-8 w-8"
                  @click="onClick"
                />
              </UTooltip>
            </template>

            <template #next="{ onClick }">
              <UTooltip text="Next page">
                <UButton
                  icon="i-ri-arrow-right-s-line"
                  color="gray"
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                  class="h-8 w-8"
                  @click="onClick"
                />
              </UTooltip>
            </template>
          </UPagination>
        </div>
      </UCard>

      <!-- Edit Modal -->
      <UModal v-model="isEditModalOpen">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Edit Attendance Record</h2>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-ri-close-line"
                @click="isEditModalOpen = false"
              />
            </div>
          </template>

          <UForm :state="editForm" @submit="saveAttendance">
            <UFormGroup label="Student" name="student">
              <UInput v-model="editForm.studentName" disabled />
            </UFormGroup>
  
            <UFormGroup label="Date" name="date">
              <UInput 
                :model-value="editForm.attendanceDate ? rtydate(editForm.attendanceDate).format('MMM dd, yyyy') : ''"
                disabled
              />
            </UFormGroup>
  
            <UFormGroup label="Status" name="status" required>
              <USelect
                v-model="editForm.attendanceTypeId"
                :options="attendanceTypeOptions"
                option-attribute="name"
                value-attribute="id"
                placeholder="Select status"
              />
            </UFormGroup>

            <UFormGroup label="Notes" name="notes">
              <UTextarea v-model="editForm.notes" />
            </UFormGroup>

            <div class="flex justify-end gap-3 mt-6">
              <UButton
                type="button"
                color="gray"
                variant="ghost"
                label="Cancel"
                @click="isEditModalOpen = false"
              />
              <UButton
                type="submit"
                color="primary"
                label="Save Changes"
                :loading="saving"
              />
            </div>
          </UForm>
        </UCard>
      </UModal>
  
      <!-- Delete Confirmation -->
      <UModal v-model="isDeleteModalOpen">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Confirm Deletion</h2>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-ri-close-line"
                @click="isDeleteModalOpen = false"
              />
            </div>
          </template>
  
          <p class="mb-6">Are you sure you want to delete this attendance record? This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="ghost"
              label="Cancel"
              @click="isDeleteModalOpen = false"
            />
            <UButton
              color="red"
              label="Delete"
              @click="deleteAttendance"
              :loading="deleting"
            />
          </div>
        </UCard>
      </UModal>
    </div>
  </template>

  <script setup>
import StatCard from './StatCard.vue'
// const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])
const startDate = ref(null)
// const endDate = ref(null)
  const loading = ref(false)
  const attendanceRecords = ref([])
  const classes = ref([])
  const selectedClass = ref('')
  const selectedStatus = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const isEditModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const selectedRecordId = ref(null)

  const editForm = ref({
    attendanceId: null,
    studentName: '',
    attendanceDate: '',
    attendanceTypeId: null,
    notes: ''
  })

  const props = defineProps(['attendanceType'])
  const attendanceType = computed(() => props.attendanceType)

  // Columns for UTable
  const columns = [{
    key: 'AttendanceDate',
    label: 'Date',
    sortable: true,
  }, {
    key: 'student',
    label: 'Student',
    sortable: true,
    slot: 'student-data'
  }, {
    key: 'ClassName',
    label: 'Class',
    sortable: true
  }, {
    key: 'status',
    label: 'Status',
    slot: 'status-data'
  }, {
    key: 'AttendanceNotes',
    label: 'Notes',
    sortable: true
  }, {
    key: 'actions',
    label: 'Actions',
    slot: 'actions-data'
  }]
  
  const attendanceTypeOptions = computed(() => {
  return attendanceType.value.map(type => ({
    value: type.Id,   // Use exact case-sensitive keys as returned from API
    label: type.Name
  }));
});

  // Status options
  const statusOptions = [
    { id: 1, name: 'Present', code: 'P' },
    { id: 2, name: 'Absent', code: 'A' },
    { id: 3, name: 'Late', code: 'L' },
    { id: 4, name: 'Excused', code: 'E' }
  ]
  
  // Computed
  const classOptions = computed(() => [
    { ClassId: '', ClassName: 'All Classes' },
    ...classes.value
  ])
  
  const filteredRecords = computed(() => {
    return attendanceRecords.value.filter(record => {
      const classMatch = !selectedClass.value || record.ClassId === selectedClass.value
      const statusMatch = !selectedStatus.value || record.AttendanceType === selectedStatus.value
      return classMatch && statusMatch
    })
  })
  
  const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredRecords.value.slice(start, end)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(filteredRecords.value.length / pageSize.value)
  })
  
  const summary = computed(() => {
    const presentCount = filteredRecords.value.filter(r => r.AttendanceType === 'Present').length
    const absentCount = filteredRecords.value.filter(r => r.AttendanceType === 'Absent').length
    const total = filteredRecords.value.length
    const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0
  
    return {
      totalRecords: total,
      presentCount,
      absentCount,
      attendanceRate
    }
  })
  
  // Methods
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'green'
      case 'Absent': return 'red'
      case 'Late': return 'yellow'
      case 'Excused': return 'blue'
      default: return 'gray'
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const openEditModal = (record) => {
    editForm.value = {
      attendanceId: record.AttendanceID,
      studentName: record.StudentName,
      attendanceDate: record.AttendanceDate,
      attendanceTypeId: statusOptions.find(s => s.name === record.AttendanceType)?.id,
      notes: record.AttendanceNotes || ''
    }
    isEditModalOpen.value = true
  }
  
  const confirmDelete = (id) => {
    selectedRecordId.value = id
    isDeleteModalOpen.value = true
  }
  
  // API Methods
  const fetchAttendance = async () => {
    try {
      loading.value = true
      const { data } = await useHttp('/api/student_attendance/date_range_list', {
        method:'POST',
        data: {
          StartDate: startDate.value,
          EndDate: endDate.value
        }
      })
      attendanceRecords.value = data.records
      console.log("-----------",attendanceRecords.value)
      console.log("-----------",attendanceRecords.value)

      classes.value = [...new Set(data.classes.map(r => ({
        ClassId: r.ClassID,
        ClassName: r.ClassName
      })))]
    } catch (error) {
      useToast().add({
        title: 'Error',
        description: error.message,
        icon: 'i-ri-error-warning-line',
        color: 'red'
      })
    } finally {
      loading.value = false
    }
  }
  
  const fetchClasses = async () => {
    try {
      const { data } = await useHttp('/api/class/class_list',{method:"POST"})
      classes.value = data
    } catch (error) {
      console.log('Failed to fetch classes:', error)
    }
  }
  
  const saveAttendance = async () => {
    try {
      saving.value = true
      const status = statusOptions.find(s => s.id === editForm.value.attendanceTypeId)
      await useHttp(`/api/student_attendance/update/${editForm.value.attendanceId}`, {
        AttendanceTypeId: status.id,
        Notes: editForm.value.notes
      })
      
      useToast().add({
        title: 'Success',
        description: 'Attendance record updated successfully',
        icon: 'i-ri-checkbox-circle-line',
        color: 'green'
      })
      
      await fetchAttendance()
      isEditModalOpen.value = false
    } catch (error) {
      useToast().add({
        title: 'Error',
        description: error.message,
        icon: 'i-ri-error-warning-line',
        color: 'red'
      })
    } finally {
      saving.value = false
    }
  }
  
  const deleteAttendance = async () => {
    console.log('Delete -------------> ',selectedRecordId.value)
    try {
      deleting.value = true
      const { data ,error } = await useHttp(`/api/student_attendance/delete?Id=${selectedRecordId.value}`)
      
      useToast().add({
        title: 'Success',
        description: 'Attendance record deleted successfully',
        icon: 'i-ri-checkbox-circle-line',
        color: 'green'
      })
      
      await fetchAttendance()
      isDeleteModalOpen.value = false
    } catch (error) {
      useToast().add({
        title: 'Error',
        description: error.message,
        icon: 'i-ri-error-warning-line',
        color: 'red'
      })
    } finally {
      deleting.value = false
    }
  }
  function handleStatusClear() {
  selectedStatus.value = null
  fetchAttendance() // example, reload your list if needed
}

  // Lifecycle
  onMounted(() => {
    fetchClasses()
    fetchAttendance()
  })
  </script>
  
  <style lang="scss">
  /* attendance.scss */
.attendance-container {
  // padding: 1.5rem;
  // max-width: 80rem;
  margin: 0 auto;

  .table-container {
    overflow-x: auto;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 1rem 1.5rem;
        font-size: 0.875rem;
        text-align: left;
        color: #6B7280; // Tailwind's text-gray-500
      }

      th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
      }

      tr:nth-child(even) {
        background-color: #F9FAFB; // Tailwind's bg-gray-50
      }

      tr:hover {
        background-color: #F3F4F6; // Tailwind's bg-gray-100
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background-color: white;
    border-top: 1px solid #E5E7EB; // Tailwind's border-gray-200

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #D1D5DB; // Tailwind's border-gray-300
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      background-color: white;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

  </style>